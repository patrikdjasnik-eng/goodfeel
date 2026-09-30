import { memo, useCallback, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Briefcase,
  Calendar,
  Compass,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Wrench,
  X
} from 'lucide-react';
import type { FeedItem, UserProfile } from '../types';
import { Composer } from './Composer';
import { FeedCard } from './FeedCard';
import { BrandLockup } from './Brand';
import { MessagesView } from './MessagesView';
import { AvatarToken } from './AvatarToken';

interface DashboardProps {
  user: UserProfile;
  feed: FeedItem[];
  onCreate: (item: FeedItem) => Promise<void>;
  onLike: (item: FeedItem) => Promise<void>;
  onUpdate: (item: FeedItem) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onLogout: () => void;
}

const primaryNavigation = [
  { label: 'Domů', icon: Home },
  { label: 'Objevovat', icon: Compass },
  { label: 'Projekty', icon: FolderKanban },
  { label: 'Práce', icon: Briefcase }
];

const secondaryNavigation = [
  { label: 'Služby', icon: Wrench },
  { label: 'Zprávy', icon: MessageCircle },
  { label: 'Uložené', icon: Bookmark },
  { label: 'Komunity', icon: Users },
  { label: 'Události', icon: Calendar },
  { label: 'Profil', icon: User }
];

export const Dashboard = memo(({
  user,
  feed,
  onCreate,
  onLike,
  onUpdate,
  onDelete,
  onLogout
}: DashboardProps) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | FeedItem['kind']>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'feed' | 'messages'>('feed');

  const visibleFeed = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('cs');

    return feed.filter((item) => {
      const matchesFilter = filter === 'all' || item.kind === filter;
      const haystack = [item.author.name, item.author.headline, item.title ?? '', item.body, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('cs');

      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [feed, filter, query]);

  const proofProjects = useMemo(
    () => feed.filter((item) => item.kind === 'project' && item.verification === 'verified').slice(0, 3),
    [feed]
  );

  const userProjects = useMemo(
    () => feed.filter((item) => item.kind === 'project' && item.author.id === user.id).length,
    [feed, user.id]
  );

  const firstName = useMemo(() => user.name.trim().split(/\s+/)[0] || user.name, [user.name]);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const renderNavigation = useCallback(
    (items: typeof primaryNavigation, primary = false) =>
      items.map(({ label, icon: Icon }, index) => {
        const isMessages = label === 'Zprávy';
        const isActive = isMessages
          ? view === 'messages'
          : primary && index === 0 && view === 'feed';

        return (
          <button
            className={isActive ? 'active' : ''}
            key={label}
            onClick={() => {
              if (isMessages) {
                setView('messages');
              } else if (primary && index === 0) {
                setView('feed');
              }

              closeMobileMenu();
            }}
            type="button"
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        );
      }),
    [closeMobileMenu, view]
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <BrandLockup compact />
          <button className="mobile-close icon-button" onClick={closeMobileMenu} type="button">
            <X size={21} />
          </button>
        </div>

        <nav className="side-nav" aria-label="Hlavní navigace">
          <div className="side-nav-group side-nav-primary">
            {renderNavigation(primaryNavigation, true)}
          </div>
          <div className="side-nav-group side-nav-secondary">
            {renderNavigation(secondaryNavigation)}
          </div>
        </nav>

        <div className="sidebar-space">
          <span><Sparkles size={16} /> Tvůj Goodfeel</span>
          <button type="button"><Plus size={18} /> Nový obsah</button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          aria-label="Zavřít menu"
          className="mobile-backdrop"
          onClick={closeMobileMenu}
          type="button"
        />
      )}

      <main className="dashboard-main">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileMenuOpen(true)} type="button">
            <Menu size={21} />
          </button>
          <label className="search-box">
            <Search size={19} />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Hledat lidi, projekty, služby nebo práci…"
              value={query}
            />
          </label>
          <div className="topbar-actions">
            <button className="icon-button" type="button"><Bell size={20} /></button>
            <AvatarToken name={user.name} size="sm" />
            <button className="logout-button" onClick={onLogout} type="button">
              <LogOut size={17} />
              <span>Odhlásit</span>
            </button>
          </div>
        </header>

        {view === 'messages' ? (
          <div className="dashboard-messages-wrap">
            <MessagesView
              currentUser={user}
              feed={feed}
              onClose={() => setView('feed')}
            />
          </div>
        ) : (
          <div className="dashboard-grid">
            <section className="feed-column">
              <div className="space-header">
                <div className="space-header-copy">
                  <span className="space-eyebrow">
                    <Sparkles size={14} />
                    Tvůj prostor
                  </span>
  
                  <h1>
                    Vítej zpět, <span>{firstName}.</span>
                  </h1>
  
                  <p>
                    Pokračuj tam, kde jsi skončil. Tvoje práce, lidé a nové příležitosti jsou tady.
                  </p>
  
                  <div className="space-pulse" aria-label="Přehled tvého prostoru">
                    <span><strong>{userProjects}</strong> projektů</span>
                    <i />
                    <span><strong>{proofProjects.length}</strong> ověřené</span>
                    <i />
                    <span><strong>{visibleFeed.length}</strong> nové v prostoru</span>
                  </div>
                </div>
  
              </div>
  
              <Composer onCreate={onCreate} user={user} />
  
              <div className="feed-filters" role="tablist" aria-label="Filtr feedu">
                {([
                  ['all', 'Pro vás'],
                  ['post', 'Příspěvky'],
                  ['project', 'Projekty'],
                  ['service', 'Služby'],
                  ['job', 'Příležitosti']
                ] as const).map(([value, label]) => (
                  <button
                    className={filter === value ? 'active' : ''}
                    key={value}
                    onClick={() => setFilter(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
  
              <div className="activity-label">
                <span />
                <strong>Aktivita komunity</strong>
                <small>{visibleFeed.length} položek</small>
              </div>
  
              <div className="feed-list">
                {visibleFeed.map((item) => (
                  <FeedCard
                  currentUserId={user.id}
                  item={item}
                  key={item.id}
                  onDelete={onDelete}
                  onLike={onLike}
                  onUpdate={onUpdate}
                />
                ))}
                {visibleFeed.length === 0 && (
                  <div className="empty-state">
                    <Search size={28} />
                    <strong>Nic jsme nenašli</strong>
                    <span>Zkuste jiný výraz nebo jiný filtr.</span>
                  </div>
                )}
              </div>
            </section>
  
            <aside className="right-column">
              <section className="profile-card">
                <div className="profile-topline">
                  <AvatarToken name={user.name} online size="xl" />
                  <span className="status-dot">Online</span>
                </div>
                <h2>{user.name}</h2>
                <span>@{user.handle}</span>
                <p>{user.headline}</p>
                <small>{user.location}</small>
                <div className="profile-stats">
                  <div><strong>24</strong><span>Kontaktů</span></div>
                  <div><strong>{userProjects}</strong><span>Projektů</span></div>
                  <div><strong>{proofProjects.length}</strong><span>Ověřených</span></div>
                </div>
              </section>
  
              <section className="side-card">
                <div className="card-title-row">
                  <h3><TrendingUp size={19} /> Trendy na Goodfeel</h3>
                  <button type="button">Vše</button>
                </div>
                <ol className="trend-list">
                  <li><span>01</span><div><strong>AI pro malé týmy</strong><small>2.4k příspěvků</small></div></li>
                  <li><span>02</span><div><strong>Building in public</strong><small>1.8k příspěvků</small></div></li>
                  <li><span>03</span><div><strong>Freelance pricing</strong><small>1.2k příspěvků</small></div></li>
                  <li><span>04</span><div><strong>Produktový design</strong><small>980 příspěvků</small></div></li>
                </ol>
              </section>
  
              <section className="side-card">
                <div className="card-title-row">
                  <h3><ShieldCheck size={19} /> Proof of Work</h3>
                  <button type="button">Vše</button>
                </div>
                <div className="proof-list">
                  {proofProjects.length > 0 ? (
                    proofProjects.map((item) => (
                      <article key={item.id}>
                        <span className="proof-icon"><ShieldCheck size={18} /></span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>Potvrzeno klientem · {item.author.name}</small>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="muted-copy">Zatím žádné ověřené projekty.</p>
                  )}
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
