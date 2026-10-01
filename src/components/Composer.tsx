import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Briefcase,
  ChevronUp,
  FolderKanban,
  Plus,
  Send,
  Sparkles,
  Wrench
} from 'lucide-react';
import type { ContentKind, FeedItem, UserProfile } from '../types';
import type { WorkmojiDefinition } from '../workmoji/catalog';
import { WorkmojiMark } from './WorkmojiMark';
import { WorkmojiPicker } from './WorkmojiPicker';
import { WorkmojiText } from './WorkmojiText';
import { AvatarToken } from './AvatarToken';

interface ComposerProps {
  user: UserProfile;
  onCreate: (item: FeedItem) => Promise<void>;
}

const labels: Record<ContentKind, string> = {
  post: 'Příspěvek',
  project: 'Projekt',
  service: 'Služba',
  job: 'Práce'
};

export const Composer = memo(({ user, onCreate }: ComposerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [kind, setKind] = useState<ContentKind>('post');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [busy, setBusy] = useState(false);
  const [workmojiOpen, setWorkmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const workmojiAnchorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const placeholder = useMemo(() => {
    if (kind === 'project') return 'Co jste postavili, dokončili nebo právě stavíte?';
    if (kind === 'service') return 'Jakou službu nabízíte a komu pomůže?';
    if (kind === 'job') return 'Koho hledáte a na jakou spolupráci?';
    return 'Co právě stavíte, řešíte nebo jste se naučili?';
  }, [kind]);

  useEffect(() => {
    if (!workmojiOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        workmojiAnchorRef.current &&
        !workmojiAnchorRef.current.contains(target)
      ) {
        setWorkmojiOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [workmojiOpen]);

  const rememberSelection = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
  }, []);

  const insertWorkmoji = useCallback(
    (workmoji: WorkmojiDefinition) => {
      const { start, end } = selectionRef.current;
      const needsLeadingSpace = start > 0 && !/\s/.test(body[start - 1] ?? '');
      const needsTrailingSpace = end < body.length && !/\s/.test(body[end] ?? '');
      const insertion = `${needsLeadingSpace ? ' ' : ''}${workmoji.token}${needsTrailingSpace ? ' ' : ' '}`;
      const nextBody = `${body.slice(0, start)}${insertion}${body.slice(end)}`;

      if (nextBody.length > 1200) return;

      setBody(nextBody);
      setWorkmojiOpen(false);

      requestAnimationFrame(() => {
        const nextTextarea = textareaRef.current;
        const cursorPosition = start + insertion.length;

        selectionRef.current = {
          start: cursorPosition,
          end: cursorPosition
        };

        nextTextarea?.focus();
        nextTextarea?.setSelectionRange(cursorPosition, cursorPosition);
      });
    },
    [body]
  );

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!body.trim() || (kind !== 'post' && !title.trim())) return;

      setBusy(true);

      try {
        const item: FeedItem = {
          id: crypto.randomUUID(),
          kind,
          author: user,
          createdAt: new Date().toISOString(),
          title: kind === 'post' ? undefined : title.trim(),
          body: body.trim(),
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 5),
          likes: 0,
          comments: 0,
          verification: kind === 'project' ? 'pending' : 'none',
          status: kind === 'project' ? 'active' : kind === 'job' ? 'open' : 'active'
        };

        await onCreate(item);
        setTitle('');
        setBody('');
        setTags('');
        setKind('post');
        setWorkmojiOpen(false);
        setExpanded(false);
      } finally {
        setBusy(false);
      }
    },
    [body, kind, onCreate, tags, title, user]
  );

  if (!expanded) {
    return (
      <button
        className="composer-collapsed"
        onClick={() => setExpanded(true)}
        type="button"
      >
        <AvatarToken name={user.name} size="lg" />
        <span className="composer-collapsed-copy">
          <strong>Co dnes tvoříte?</strong>
          <small>Sdílejte myšlenku, projekt nebo novou příležitost.</small>
        </span>
        <span className="composer-collapsed-action">
          <Plus size={18} />
          Vytvořit
        </span>
      </button>
    );
  }

  return (
    <form className="composer composer-expanded" onSubmit={submit}>
      <div className="composer-head">
        <AvatarToken name={user.name} size="lg" />
        <div>
          <strong>Co dnes tvoříte?</strong>
          <span>Myšlenka → projekt → příležitost</span>
        </div>
        <Sparkles className="composer-spark" size={21} />
        <button
          aria-label="Sbalit editor"
          className="composer-collapse"
          onClick={() => {
            setWorkmojiOpen(false);
            setExpanded(false);
          }}
          type="button"
        >
          <ChevronUp size={18} />
        </button>
      </div>

      <div className="composer-kinds" role="tablist" aria-label="Typ nového obsahu">
        <button className={kind === 'post' ? 'active' : ''} onClick={() => setKind('post')} type="button">
          <Send size={17} /> Příspěvek
        </button>
        <button className={kind === 'project' ? 'active' : ''} onClick={() => setKind('project')} type="button">
          <FolderKanban size={17} /> Projekt
        </button>
        <button className={kind === 'service' ? 'active' : ''} onClick={() => setKind('service')} type="button">
          <Wrench size={17} /> Služba
        </button>
        <button className={kind === 'job' ? 'active' : ''} onClick={() => setKind('job')} type="button">
          <Briefcase size={17} /> Práce
        </button>
      </div>

      {kind !== 'post' && (
        <input
          className="composer-title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder={`${labels[kind]} — krátký název`}
          required
          value={title}
        />
      )}

      <textarea
        maxLength={1200}
        onChange={(event) => setBody(event.target.value)}
        onClick={rememberSelection}
        onKeyUp={rememberSelection}
        onSelect={rememberSelection}
        placeholder={placeholder}
        ref={textareaRef}
        required
        rows={kind === 'post' ? 2 : 3}
        value={body}
      />

      {body.includes(':gf-') && (
        <div className="composer-workmoji-preview">
          <span>Náhled</span>
          <p><WorkmojiText text={body} /></p>
        </div>
      )}

      <div className="composer-footer">
        <div className="workmoji-anchor" ref={workmojiAnchorRef}>
          <button
            aria-expanded={workmojiOpen}
            aria-haspopup="dialog"
            className={`workmoji-trigger ${workmojiOpen ? 'active' : ''}`.trim()}
            onClick={() => setWorkmojiOpen((current) => !current)}
            title="Goodfeel Workmoji"
            type="button"
          >
            <WorkmojiMark id="gf-spark" size={19} />
            <span>Workmoji</span>
          </button>

          {workmojiOpen && (
            <WorkmojiPicker
              onClose={() => setWorkmojiOpen(false)}
              onSelect={insertWorkmoji}
            />
          )}
        </div>

        <input
          aria-label="Tagy"
          onChange={(event) => setTags(event.target.value)}
          placeholder="Tagy oddělené čárkou"
          value={tags}
        />
        <span>{body.length}/1200</span>
        <button className="send-button" disabled={busy} type="submit">
          <Send size={18} />
          {busy ? 'Publikuji…' : 'Publikovat'}
        </button>
      </div>
    </form>
  );
});

Composer.displayName = 'Composer';
