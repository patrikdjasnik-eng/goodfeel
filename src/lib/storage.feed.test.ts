import { beforeEach, describe, expect, it } from 'vitest';
import {
  deleteFeedItem,
  loadFeed,
  saveFeedItem,
  updateFeedItem,
  updateOwnedFeedItem
} from './storage';
import { makeFeedItem, makeUser, resetTestDatabase } from '../test/helpers';

const owner = makeUser({ id: 'owner', name: 'Owner', email: 'owner@example.com' });
const stranger = makeUser({ id: 'stranger', name: 'Stranger', email: 'stranger@example.com' });

const createItem = (overrides: Parameters<typeof makeFeedItem>[0] = {}) =>
  makeFeedItem({ author: owner, ...overrides });

describe('feed uložení a načtení', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('uloží a načte příspěvek', async () => {
    const item = createItem();

    await saveFeedItem(item);

    const feed = await loadFeed();
    expect(feed).toHaveLength(1);
    expect(feed[0].id).toBe(item.id);
    expect(feed[0].body).toBe(item.body);
  });

  it('řadí feed od nejnovějšího příspěvku', async () => {
    const older = createItem({ id: 'older', createdAt: '2026-01-01T00:00:00.000Z', body: 'starší' });
    const newer = createItem({ id: 'newer', createdAt: '2026-02-01T00:00:00.000Z', body: 'novější' });

    await saveFeedItem(older);
    await saveFeedItem(newer);

    const feed = await loadFeed();
    expect(feed.map((item) => item.id)).toEqual(['newer', 'older']);
  });
});

describe('feed úpravy vlastního obsahu', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('upraví vlastní příspěvek a zachová autorství a metadata', async () => {
    const item = createItem({ likes: 5, comments: 2 });
    await saveFeedItem(item);

    await updateOwnedFeedItem({ ...item, body: 'Nový text po editaci' }, owner.id);

    const [updated] = await loadFeed();
    expect(updated.body).toBe('Nový text po editaci');
    expect(updated.author.id).toBe(owner.id);
    expect(updated.createdAt).toBe(item.createdAt);
    expect(updated.likes).toBe(5);
    expect(updated.comments).toBe(2);
  });

  it('zakáže úpravu cizího příspěvku', async () => {
    const item = createItem({ body: 'Cizí text' });
    await saveFeedItem(item);

    await expect(updateOwnedFeedItem({ ...item, body: 'Změněno' }, stranger.id)).rejects.toThrow(
      'Cizí příspěvek nelze upravit.'
    );

    const feed = await loadFeed();
    expect(feed[0].body).toBe('Cizí text');
  });

  it('zakáže úpravu, když položka falešně tvrdí cizího autora', async () => {
    const item = createItem();
    await saveFeedItem(item);

    const spoofedItem = { ...item, author: stranger, body: 'Podvržený autor' };

    await expect(updateOwnedFeedItem(spoofedItem, owner.id)).rejects.toThrow(
      'Cizí příspěvek nelze upravit.'
    );
  });

  it('odmítne úpravu neexistujícího příspěvku', async () => {
    await expect(updateOwnedFeedItem(createItem(), owner.id)).rejects.toThrow(
      'Příspěvek už neexistuje.'
    );
  });

  it('updateFeedItem aktualizuje počet reakcí', async () => {
    const item = createItem({ likes: 1 });
    await saveFeedItem(item);

    await updateFeedItem({ ...item, likes: 2 });

    const [updated] = await loadFeed();
    expect(updated.likes).toBe(2);
  });
});

describe('feed mazání vlastního obsahu', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('smaže vlastní příspěvek', async () => {
    const item = createItem();
    await saveFeedItem(item);

    await deleteFeedItem(item.id, owner.id);

    expect(await loadFeed()).toHaveLength(0);
  });

  it('zakáže smazání cizího příspěvku a ponechá ho ve feedu', async () => {
    const item = createItem();
    await saveFeedItem(item);

    await expect(deleteFeedItem(item.id, stranger.id)).rejects.toThrow(
      'Cizí příspěvek nelze smazat.'
    );

    expect(await loadFeed()).toHaveLength(1);
  });

  it('odmítne smazání neexistujícího příspěvku', async () => {
    await expect(deleteFeedItem('neexistujici', owner.id)).rejects.toThrow(
      'Příspěvek už neexistuje.'
    );
  });
});