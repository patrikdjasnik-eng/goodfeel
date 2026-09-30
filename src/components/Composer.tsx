import { FormEvent, memo, useCallback, useMemo, useState } from 'react';
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

  const placeholder = useMemo(() => {
    if (kind === 'project') return 'Co jste postavili, dokončili nebo právě stavíte?';
    if (kind === 'service') return 'Jakou službu nabízíte a komu pomůže?';
    if (kind === 'job') return 'Koho hledáte a na jakou spolupráci?';
    return 'Co právě stavíte, řešíte nebo jste se naučili?';
  }, [kind]);

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
        className="composer-collapsed surface"
        onClick={() => setExpanded(true)}
        type="button"
      >
        <span className="avatar avatar-large">{user.name.slice(0, 1).toUpperCase()}</span>
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
    <form className="composer composer-expanded surface" onSubmit={submit}>
      <div className="composer-head">
        <span className="avatar avatar-large">{user.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>Co dnes tvoříte?</strong>
          <span>Myšlenka → projekt → příležitost</span>
        </div>
        <Sparkles className="composer-spark" size={21} />
        <button
          aria-label="Sbalit editor"
          className="composer-collapse"
          onClick={() => setExpanded(false)}
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
        placeholder={placeholder}
        required
        rows={kind === 'post' ? 2 : 3}
        value={body}
      />

      <div className="composer-footer">
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
