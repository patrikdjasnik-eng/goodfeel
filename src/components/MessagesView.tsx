import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  ArrowLeft,
  LockKeyhole,
  Search,
  Send,
  ShieldCheck
} from 'lucide-react';
import type { DirectMessage, FeedItem, UserProfile } from '../types';
import {
  decryptMessage,
  loadConversation,
  saveEncryptedMessage
} from '../lib/storage';
import { AvatarToken } from './AvatarToken';

interface MessagesViewProps {
  currentUser: UserProfile;
  feed: FeedItem[];
  onClose: () => void;
}

interface DecryptedMessage {
  record: DirectMessage;
  body: string;
}

export const MessagesView = memo(({ currentUser, feed, onClose }: MessagesViewProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const contacts = useMemo(() => {
    const unique = new Map<string, UserProfile>();

    feed.forEach((item) => {
      if (item.author.id !== currentUser.id) {
        unique.set(item.author.id, item.author);
      }
    });

    return Array.from(unique.values()).filter((profile) => {
      const normalized = query.trim().toLocaleLowerCase('cs');

      if (!normalized) return true;

      return [profile.name, profile.handle, profile.headline]
        .join(' ')
        .toLocaleLowerCase('cs')
        .includes(normalized);
    });
  }, [currentUser.id, feed, query]);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedUserId) ?? null,
    [contacts, selectedUserId]
  );

  useEffect(() => {
    if (!selectedUserId && contacts[0]) {
      setSelectedUserId(contacts[0].id);
    }
  }, [contacts, selectedUserId]);

  const refreshConversation = useCallback(async () => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    try {
      const records = await loadConversation(currentUser.id, selectedUserId);
      const decrypted = await Promise.all(
        records.map(async (record) => ({
          record,
          body: await decryptMessage(record, currentUser.id)
        }))
      );

      setMessages(decrypted);
      setError('');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Konverzaci se nepodařilo načíst.'
      );
    }
  }, [currentUser.id, selectedUserId]);

  useEffect(() => {
    void refreshConversation();
  }, [refreshConversation]);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedUserId || !draft.trim() || busy) return;

      setBusy(true);
      setError('');

      try {
        await saveEncryptedMessage(currentUser.id, selectedUserId, draft);
        setDraft('');
        await refreshConversation();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Zprávu se nepodařilo odeslat.'
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, currentUser.id, draft, refreshConversation, selectedUserId]
  );

  return (
    <section className="messages-view" aria-label="Zprávy">
      <aside className="messages-sidebar">
        <div className="messages-sidebar-head">
          <button aria-label="Zpět na feed" className="messages-back" onClick={onClose} type="button">
            <ArrowLeft size={19} />
          </button>
          <div>
            <strong>Zprávy</strong>
            <span>Soukromé konverzace</span>
          </div>
        </div>

        <label className="messages-search">
          <Search size={17} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hledat kontakt…"
            value={query}
          />
        </label>

        <div className="messages-contact-list">
          {contacts.map((contact) => (
            <button
              className={selectedUserId === contact.id ? 'active' : ''}
              key={contact.id}
              onClick={() => setSelectedUserId(contact.id)}
              type="button"
            >
              <AvatarToken
                active={selectedUserId === contact.id}
                name={contact.name}
                size="md"
              />
              <span>
                <strong>{contact.name}</strong>
                <small>@{contact.handle}</small>
              </span>
            </button>
          ))}

          {contacts.length === 0 && (
            <div className="messages-empty-contact">
              <span>Zatím tu není nikdo, komu by šlo napsat.</span>
            </div>
          )}
        </div>
      </aside>

      <div className="messages-chat">
        {selectedContact ? (
          <>
            <header className="messages-chat-head">
              <AvatarToken name={selectedContact.name} online size="lg" />
              <div>
                <strong>{selectedContact.name}</strong>
                <span>@{selectedContact.handle}</span>
              </div>
              <div className="messages-encryption-badge" title="End-to-end šifrování">
                <LockKeyhole size={15} />
                E2EE
              </div>
            </header>

            <div className="messages-security-note">
              <ShieldCheck size={17} />
              <span>
                Obsah se kontroluje na zařízení před zašifrováním. Uložená zpráva obsahuje jen ciphertext.
              </span>
            </div>

            <div className="messages-thread" aria-live="polite">
              {messages.map(({ record, body }) => {
                const own = record.senderId === currentUser.id;

                return (
                  <div className={own ? 'message-row own' : 'message-row'} key={record.id}>
                    <article className="message-bubble">
                      <p>{body}</p>
                      <time dateTime={record.createdAt}>
                        {new Date(record.createdAt).toLocaleTimeString('cs-CZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </article>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <div className="messages-thread-empty">
                  <LockKeyhole size={28} />
                  <strong>Začněte soukromou konverzaci</strong>
                  <span>První zpráva se před uložením zašifruje přímo v prohlížeči.</span>
                </div>
              )}
            </div>

            <form className="message-composer" onSubmit={submit}>
              {error && <span className="message-error">{error}</span>}
              <div>
                <textarea
                  maxLength={4000}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Napsat šifrovanou zprávu…"
                  rows={1}
                  value={draft}
                />
                <button disabled={busy || !draft.trim()} type="submit">
                  <Send size={18} />
                  <span>{busy ? 'Šifruji…' : 'Odeslat'}</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="messages-no-selection">
            <LockKeyhole size={34} />
            <strong>Vyberte konverzaci</strong>
            <span>Zprávy jsou v tomto prototypu šifrované pomocí Web Crypto.</span>
          </div>
        )}
      </div>
    </section>
  );
});

MessagesView.displayName = 'MessagesView';
