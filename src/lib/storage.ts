import { demoFeed, demoUser } from '../data/demo';
import type { AccountRecord, FeedItem, UserProfile } from '../types';

const databaseName = 'goodfeel-mvp';
const databaseVersion = 1;
const accountStore = 'accounts';
const feedStore = 'feed';
const sessionKey = 'goodfeel.session';

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(accountStore)) {
        database.createObjectStore(accountStore, { keyPath: 'email' });
      }

      if (!database.objectStoreNames.contains(feedStore)) {
        database.createObjectStore(feedStore, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB nelze otevřít.'));
  });

const hashPassword = async (password: string): Promise<string> => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
};

const putRecord = async <T>(storeName: string, value: T): Promise<void> => {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Zápis do IndexedDB selhal.'));
  });

  database.close();
};

const getRecord = async <T>(storeName: string, key: IDBValidKey): Promise<T | undefined> => {
  const database = await openDatabase();

  const result = await new Promise<T | undefined>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error ?? new Error('Čtení z IndexedDB selhalo.'));
  });

  database.close();
  return result;
};

const getAllRecords = async <T>(storeName: string): Promise<T[]> => {
  const database = await openDatabase();

  const result = await new Promise<T[]>((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error ?? new Error('Čtení z IndexedDB selhalo.'));
  });

  database.close();
  return result;
};

export const initializeStorage = async (): Promise<void> => {
  const existingDemo = await getRecord<AccountRecord>(accountStore, demoUser.email);

  if (!existingDemo) {
    await putRecord<AccountRecord>(accountStore, {
      ...demoUser,
      passwordHash: await hashPassword('goodfeel')
    });
  }

  const currentFeed = await getAllRecords<FeedItem>(feedStore);

  if (currentFeed.length === 0) {
    for (const item of demoFeed) {
      await putRecord(feedStore, item);
    }
  }
};

export const loadFeed = async (): Promise<FeedItem[]> => {
  const items = await getAllRecords<FeedItem>(feedStore);

  return items.sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
};

export const saveFeedItem = async (item: FeedItem): Promise<void> => {
  await putRecord(feedStore, item);
};

export const updateFeedItem = async (item: FeedItem): Promise<void> => {
  await putRecord(feedStore, item);
};

export const login = async (email: string, password: string): Promise<UserProfile> => {
  const account = await getRecord<AccountRecord>(accountStore, email.trim().toLowerCase());

  if (!account || account.passwordHash !== (await hashPassword(password))) {
    throw new Error('E-mail nebo heslo není správně.');
  }

  const user: UserProfile = {
    id: account.id,
    name: account.name,
    handle: account.handle,
    email: account.email,
    headline: account.headline,
    location: account.location
  };

  localStorage.setItem(sessionKey, JSON.stringify(user));
  return user;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await getRecord<AccountRecord>(accountStore, normalizedEmail);

  if (existing) {
    throw new Error('Účet s tímto e-mailem už existuje.');
  }

  if (password.length < 8) {
    throw new Error('Heslo musí mít alespoň 8 znaků.');
  }

  const handleBase = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '') || 'builder';

  const user: UserProfile = {
    id: crypto.randomUUID(),
    name: name.trim(),
    handle: `${handleBase}${Math.floor(Math.random() * 900 + 100)}`,
    email: normalizedEmail,
    headline: 'Nový člen Goodfeel',
    location: 'Remote'
  };

  await putRecord<AccountRecord>(accountStore, {
    ...user,
    passwordHash: await hashPassword(password)
  });

  localStorage.setItem(sessionKey, JSON.stringify(user));
  return user;
};

export const getSession = (): UserProfile | null => {
  try {
    const rawSession = localStorage.getItem(sessionKey);
    return rawSession ? (JSON.parse(rawSession) as UserProfile) : null;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(sessionKey);
};
