import type { FeedItem, UserProfile } from '../types';

const databaseName = 'goodfeel-mvp';

export const resetTestDatabase = async (): Promise<void> => {
  const request = indexedDB.deleteDatabase(databaseName);

  await new Promise<void>((resolve) => {
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
};

export const makeUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'user-1',
  name: 'Test User',
  handle: 'testuser',
  email: 'test@example.com',
  headline: 'Builder',
  location: 'Remote',
  ...overrides
});

export const makeFeedItem = (overrides: Partial<FeedItem> = {}): FeedItem => ({
  id: 'feed-1',
  kind: 'post',
  author: makeUser(),
  createdAt: new Date().toISOString(),
  body: 'Test body',
  tags: [],
  likes: 0,
  comments: 0,
  verification: 'none',
  status: 'active',
  ...overrides
});