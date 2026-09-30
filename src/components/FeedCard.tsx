import { memo, useCallback, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Clock3,
  FolderKanban,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import type { FeedItem } from '../types';

interface FeedCardProps {
  item: FeedItem;
  onLike: (item: FeedItem) => Promise<void>;
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

export const FeedCard = memo(({ item, onLike }: FeedCardProps) => {
  const [liked, setLiked] = useState(false);

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

  return (
    <article className="feed-card">
      <header className="feed-card-header">
        <span className="avatar">{item.author.name.slice(0, 1).toUpperCase()}</span>
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
      </header>

      <div className="feed-content">
        {item.title && <h3>{item.title}</h3>}
        <p>{item.body}</p>

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
