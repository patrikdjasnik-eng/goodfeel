import { memo, useCallback, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Check,
  Clock3,
  FolderKanban,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Repeat2,
  Send,
  ShieldCheck,
  Trash2,
  Wrench,
  X
} from 'lucide-react';
import type { FeedItem } from '../types';
import { WorkmojiText } from './WorkmojiText';
import { AvatarToken } from './AvatarToken';

interface FeedCardProps {
  item: FeedItem;
  currentUserId: string;
  onLike: (item: FeedItem) => Promise<void>;
  onUpdate: (item: FeedItem) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

const kindLabel: Record<FeedItem['kind'], string> = {
  post: 'Příspěvek',
  project: 'Projekt',
  service: 'Služba',
  job: 'Příležitost'
};

const KindIcon = ({ kind }: { kind: FeedItem['kind'] }) => {
  if (kind === 'project') return <FolderKanban size={15} />;
  if (kind === 'service') return <Wrench size={15} />;
  if (kind === 'job') return <Briefcase size={15} />;
  return <Send size={15} />;
};

export const FeedCard = memo(({
  item,
  currentUserId,
  onLike,
  onUpdate,
  onDelete
}: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(item.body);
  const [busy, setBusy] = useState(false);

  const isOwner = item.author.id === currentUserId;

  const relativeTime = useMemo(() => {
    const minutes = Math.max(1, Math.round((Date.now() - new Date(item.createdAt).getTime()) / 60_000));

    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} h`;
    return `${Math.round(minutes / 1440)} d`;
  }, [item.createdAt]);

  const toggleLike = useCallback(async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);

    try {
      await onLike({
        ...item,
        likes: Math.max(0, item.likes + (nextLiked ? 1 : -1))
      });
    } catch {
      setLiked(!nextLiked);
    }
  }, [item, liked, onLike]);

  const saveEdit = useCallback(async () => {
    const normalizedBody = editBody.trim();

    if (!normalizedBody || normalizedBody === item.body) {
      setEditing(false);
      setEditBody(item.body);
      return;
    }

    setBusy(true);

    try {
      await onUpdate({
        ...item,
        body: normalizedBody
      });
      setEditing(false);
      setMenuOpen(false);
    } finally {
      setBusy(false);
    }
  }, [editBody, item, onUpdate]);

  const deleteItem = useCallback(async () => {
    if (!window.confirm('Opravdu chcete tento příspěvek smazat?')) return;

    setBusy(true);

    try {
      await onDelete(item.id);
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }, [item.id, onDelete]);

  return (
    <article className="feed-card">
      <header className="feed-card-header">
        <AvatarToken name={item.author.name} size="md" />
        <div className="feed-author">
          <div>
            <strong>{item.author.name}</strong>
            <span className="verified-dot" title="Ověřený profil">
              <BadgeCheck size={15} />
            </span>
            <span>· {relativeTime}</span>
          </div>
          <small>{item.author.headline}</small>
        </div>

        <span className={`kind-badge kind-${item.kind}`}>
          <KindIcon kind={item.kind} /> {kindLabel[item.kind]}
        </span>

        {isOwner && (
          <div className="feed-owner-menu">
            <button
              aria-expanded={menuOpen}
              aria-label="Možnosti příspěvku"
              className="feed-more-button"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div className="feed-owner-popover">
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                    setEditBody(item.body);
                  }}
                  type="button"
                >
                  <Pencil size={15} />
                  Upravit
                </button>
                <button className="danger" disabled={busy} onClick={deleteItem} type="button">
                  <Trash2 size={15} />
                  Smazat
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="feed-content">
        {item.title && <h3>{item.title}</h3>}

        {editing ? (
          <div className="feed-inline-editor">
            <textarea
              autoFocus
              maxLength={1200}
              onChange={(event) => setEditBody(event.target.value)}
              value={editBody}
            />
            <div>
              <span>{editBody.length}/1200</span>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditBody(item.body);
                }}
                type="button"
              >
                <X size={15} />
                Zrušit
              </button>
              <button className="primary" disabled={busy || !editBody.trim()} onClick={saveEdit} type="button">
                <Check size={15} />
                {busy ? 'Ukládám…' : 'Uložit'}
              </button>
            </div>
          </div>
        ) : (
          <p><WorkmojiText text={item.body} /></p>
        )}

        {item.tags.length > 0 && (
          <div className="tag-row">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        {item.kind !== 'post' && (
          <div className="proof-strip">
            <div>
              {item.verification === 'verified' ? <ShieldCheck size={18} /> : <Clock3 size={18} />}
              <span>
                {item.verification === 'verified'
                  ? 'Potvrzeno klientem'
                  : item.verification === 'pending'
                    ? 'Čeká na potvrzení klientem'
                    : 'Veřejná nabídka'}
              </span>
            </div>
            <strong>
              {item.status === 'completed' ? 'Dokončeno' : item.status === 'open' ? 'Otevřeno' : 'Aktivní'}
            </strong>
          </div>
        )}
      </div>

      <footer className="feed-actions">
        <button className={liked ? 'liked' : ''} onClick={toggleLike} type="button">
          <Heart fill={liked ? 'currentColor' : 'none'} size={19} />
          {item.likes}
        </button>
        <button type="button">
          <MessageCircle size={19} /> {item.comments}
        </button>
        <button type="button">
          <Repeat2 size={19} /> Sdílet
        </button>
      </footer>
    </article>
  );
});

FeedCard.displayName = 'FeedCard';
