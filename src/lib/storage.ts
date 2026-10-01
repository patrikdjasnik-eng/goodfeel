import { demoFeed, demoUser } from '../data/demo';
import type { AccountRecord, DirectMessage, FeedItem, UserProfile } from '../types';

const databaseName = 'goodfeel-mvp';
const databaseVersion = 2;
const accountStore = 'accounts';
const feedStore = 'feed';
const messageStore = 'messages';
const identityStore = 'message-identities';
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

      if (!database.objectStoreNames.contains(messageStore)) {
        const store = database.createObjectStore(messageStore, { keyPath: 'id' });
        store.createIndex('senderId', 'senderId', { unique: false });
        store.createIndex('recipientId', 'recipientId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!database.objectStoreNames.contains(identityStore)) {
        database.createObjectStore(identityStore, { keyPath: 'userId' });
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



interface MessageIdentityRecord {
  userId: string;
  privateKey: CryptoKey;
  publicKeyJwk: JsonWebKey;
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';

  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });

  return btoa(binary);
};

const base64ToBytes = (value: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(value);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const ensureMessageIdentity = async (userId: string): Promise<MessageIdentityRecord> => {
  const existing = await getRecord<MessageIdentityRecord>(identityStore, userId);

  if (existing) {
    return existing;
  }

  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    false,
    ['deriveKey']
  );

  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const record: MessageIdentityRecord = {
    userId,
    privateKey: keyPair.privateKey,
    publicKeyJwk
  };

  await putRecord(identityStore, record);
  return record;
};

const deriveConversationKey = async (
  ownIdentity: MessageIdentityRecord,
  otherPublicKeyJwk: JsonWebKey
): Promise<CryptoKey> => {
  const otherPublicKey = await crypto.subtle.importKey(
    'jwk',
    otherPublicKeyJwk,
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    false,
    []
  );

  return crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: otherPublicKey
    },
    ownIdentity.privateKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
};

const blockedMessagePatterns: ReadonlyArray<RegExp> = [
  /\b(child\s*(porn|sexual|abuse)|csam)\b/i,
  /(?<![\p{L}\p{N}])(dětsk(?:á|é|ou)\s*pornograf(?:ie|ii)|sexuální\s*zneužívání\s*dětí)(?![\p{L}\p{N}])/iu,
  /\b(hire\s+(a\s+)?hitman|contract\s+killing)\b/i,
  /\b(najmout\s+vraha|vražda\s+na\s+objednávku)\b/i
];

export const validateMessageContent = (message: string): void => {
  const normalized = message.trim();

  if (!normalized) {
    throw new Error('Zpráva je prázdná.');
  }

  if (normalized.length > 4000) {
    throw new Error('Zpráva je příliš dlouhá.');
  }

  if (blockedMessagePatterns.some((pattern) => pattern.test(normalized))) {
    throw new Error('Tuhle zprávu nelze odeslat přes Goodfeel.');
  }
};

export const loadPublicProfiles = async (): Promise<UserProfile[]> => {
  const accounts = await getAllRecords<AccountRecord>(accountStore);

  return accounts.map(({ passwordHash: _passwordHash, ...profile }) => profile);
};

export const deleteFeedItem = async (
  itemId: string,
  actorUserId: string
): Promise<void> => {
  const item = await getRecord<FeedItem>(feedStore, itemId);

  if (!item) {
    throw new Error('Příspěvek už neexistuje.');
  }

  if (item.author.id !== actorUserId) {
    throw new Error('Cizí příspěvek nelze smazat.');
  }

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(feedStore, 'readwrite');
    transaction.objectStore(feedStore).delete(itemId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Smazání příspěvku selhalo.'));
  });

  database.close();
};

export const updateOwnedFeedItem = async (
  item: FeedItem,
  actorUserId: string
): Promise<void> => {
  const storedItem = await getRecord<FeedItem>(feedStore, item.id);

  if (!storedItem) {
    throw new Error('Příspěvek už neexistuje.');
  }

  if (storedItem.author.id !== actorUserId || item.author.id !== actorUserId) {
    throw new Error('Cizí příspěvek nelze upravit.');
  }

  await putRecord(feedStore, {
    ...item,
    author: storedItem.author,
    createdAt: storedItem.createdAt,
    likes: storedItem.likes,
    comments: storedItem.comments
  });
};

export const saveEncryptedMessage = async (
  senderId: string,
  recipientId: string,
  plaintext: string
): Promise<DirectMessage> => {
  validateMessageContent(plaintext);

  const senderIdentity = await ensureMessageIdentity(senderId);
  const recipientIdentity = await ensureMessageIdentity(recipientId);
  const conversationKey = await deriveConversationKey(senderIdentity, recipientIdentity.publicKeyJwk);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext.trim());
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    conversationKey,
    encoded
  );

  const message: DirectMessage = {
    id: crypto.randomUUID(),
    senderId,
    recipientId,
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
    createdAt: new Date().toISOString()
  };

  await putRecord(messageStore, message);
  return message;
};

export const loadConversation = async (
  currentUserId: string,
  otherUserId: string
): Promise<DirectMessage[]> => {
  const messages = await getAllRecords<DirectMessage>(messageStore);

  return messages
    .filter(
      (message) =>
        (message.senderId === currentUserId && message.recipientId === otherUserId) ||
        (message.senderId === otherUserId && message.recipientId === currentUserId)
    )
    .sort(
      (first, second) =>
        new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
    );
};

export const decryptMessage = async (
  message: DirectMessage,
  currentUserId: string
): Promise<string> => {
  if (currentUserId !== message.senderId && currentUserId !== message.recipientId) {
    throw new Error('K této zprávě nemáte přístup.');
  }

  const otherUserId =
    currentUserId === message.senderId ? message.recipientId : message.senderId;
  const ownIdentity = await ensureMessageIdentity(currentUserId);
  const otherIdentity = await ensureMessageIdentity(otherUserId);
  const conversationKey = await deriveConversationKey(ownIdentity, otherIdentity.publicKeyJwk);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToBytes(message.iv)
    },
    conversationKey,
    base64ToBytes(message.ciphertext)
  );

  return new TextDecoder().decode(decrypted);
};

export const initializeStorage = async (): Promise<void> => {
  const existingDemo = await getRecord<AccountRecord>(accountStore, demoUser.email);

  if (!existingDemo) {
    await putRecord<AccountRecord>(accountStore, {
      ...demoUser,
      passwordHash: await hashPassword('goodfeel')
    });
  }

  await ensureMessageIdentity(demoUser.id);

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

  await ensureMessageIdentity(user.id);

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
