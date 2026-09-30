import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { FeedItem, UserProfile } from './types';
import {
  getSession,
  initializeStorage,
  loadFeed,
  deleteFeedItem,
  logout,
  saveFeedItem,
  updateFeedItem
} from './lib/storage';
import { registerServiceWorker } from './lib/pwa';
import { BrandMark } from './components/Brand';

const Dashboard = lazy(() =>
  import('./components/Dashboard').then((module) => ({ default: module.Dashboard }))
);

const LoginScreen = lazy(() =>
  import('./components/LoginScreen').then((module) => ({ default: module.LoginScreen }))
);

type AppStatus = 'loading' | 'ready' | 'error';

function App() {
  const [status, setStatus] = useState<AppStatus>('loading');
  const [error, setError] = useState('');
  const [user, setUser] = useState<UserProfile | null>(() => getSession());
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const bootstrap = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      await initializeStorage();
      const items = await loadFeed();
      setFeed(items);
      setStatus('ready');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Goodfeel se nepodařilo inicializovat.'
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void bootstrap();
    void registerServiceWorker();
  }, [bootstrap]);

  const handleAuthenticated = useCallback((authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
  }, []);

  const handleCreate = useCallback(async (item: FeedItem) => {
    await saveFeedItem(item);
    setFeed((current) =>
      [item, ...current].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      )
    );
  }, []);

  const handleLike = useCallback(async (item: FeedItem) => {
    await updateFeedItem(item);
    setFeed((current) =>
      current.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    );
  }, []);

  const handleUpdate = useCallback(async (item: FeedItem) => {
    await updateFeedItem(item);
    setFeed((current) =>
      current.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    );
  }, []);

  const handleDelete = useCallback(async (itemId: string) => {
    await deleteFeedItem(itemId);
    setFeed((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  if (status === 'loading') {
    return (
      <main className="boot-screen" aria-live="polite">
        <BrandMark className="boot-mark" />
        <strong>Goodfeel</strong>
        <p>Načítám lokální pracovní prostor…</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="boot-screen boot-error" role="alert">
        <BrandMark className="boot-mark" />
        <strong>Goodfeel se nespustil</strong>
        <p>{error}</p>
        <button className="primary-button" onClick={() => void bootstrap()} type="button">
          Zkusit znovu
        </button>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="boot-screen" aria-live="polite">
          <span className="boot-mark" aria-hidden="true">
            <span />
          </span>
          <strong>Goodfeel</strong>
          <p>Připravuji rozhraní…</p>
        </main>
      }
    >
      {user ? (
        <Dashboard
          feed={feed}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onLike={handleLike}
          onLogout={handleLogout}
          onUpdate={handleUpdate}
          user={user}
        />
      ) : (
        <LoginScreen onAuthenticated={handleAuthenticated} />
      )}
    </Suspense>
  );
}

export default App;
