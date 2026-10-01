import { beforeEach, describe, expect, it } from 'vitest';
import {
  getSession,
  initializeStorage,
  loadFeed,
  login,
  logout,
  register,
  loadPublicProfiles
} from './storage';
import { demoFeed, demoUser } from '../data/demo';
import { resetTestDatabase } from '../test/helpers';

const validPassword = 'bezpecne-heslo';

describe('auth registrace', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('registrace vytvoří účet, message identitu a uloží session', async () => {
    const user = await register('Jan Novák', '  Jan@Example.com  ', validPassword);

    expect(user.id).toBeTruthy();
    expect(user.email).toBe('jan@example.com');
    expect(user.handle).toMatch(/^jan[a-z0-9]*\d{3}$/);
    expect(user.headline).toBe('Nový člen Goodfeel');

    expect(getSession()).toEqual(user);
  });

  it('registrace odmítne e-mail, který už existuje, bez ohledu na velikost písmen', async () => {
    await register('Jan Novák', 'jan@example.com', validPassword);

    await expect(register('Jana Nováková', 'JAN@example.com', validPassword)).rejects.toThrow(
      'Účet s tímto e-mailem už existuje.'
    );
  });

  it('registrace vyžaduje heslo dlouhé alespoň 8 znaků', async () => {
    await expect(register('Jan Novák', 'jan@example.com', 'kratke')).rejects.toThrow(
      'Heslo musí mít alespoň 8 znaků.'
    );
  });

  it('registrace s krátkým heslem neuloží účet', async () => {
    await expect(register('Jan Novák', 'jan@example.com', 'kratke')).rejects.toThrow();

    await expect(login('jan@example.com', 'kratke')).rejects.toThrow('E-mail nebo heslo není správně.');
  });

  it('registrace vytvoří handle z diakritického jména', async () => {
    const user = await register('Jiří Červený', 'jiri@example.com', validPassword);

    expect(user.handle).toMatch(/^jiri[a-z0-9]*\d{3}$/);
    expect(user.handle).not.toContain('ř');
  });

  it('jméno bez písmen dostane výchozí handle builder', async () => {
    const user = await register('!!!', 'symbols@example.com', validPassword);

    expect(user.handle).toMatch(/^builder\d{3}$/);
  });

  it('loadPublicProfiles neobsahuje hash hesla', async () => {
    await register('Jan Novák', 'jan@example.com', validPassword);

    const profiles = await loadPublicProfiles();

    expect(profiles).toHaveLength(1);
    expect(profiles[0].email).toBe('jan@example.com');
    expect(profiles[0]).not.toHaveProperty('passwordHash');
  });
});

describe('auth přihlášení a session', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('přihlásí registrovaného uživatele a uloží session', async () => {
    const created = await register('Jan Novák', 'jan@example.com', validPassword);

    const user = await login(' JAN@example.com ', validPassword);

    expect(user.id).toBe(created.id);
    expect(user.name).toBe('Jan Novák');
    expect(getSession()).toEqual(user);
  });

  it('odmítne špatné heslo', async () => {
    await register('Jan Novák', 'jan@example.com', validPassword);

    await expect(login('jan@example.com', 'spatne-heslo')).rejects.toThrow(
      'E-mail nebo heslo není správně.'
    );
  });

  it('odmítne neznámý e-mail', async () => {
    await expect(login('nikdo@example.com', validPassword)).rejects.toThrow(
      'E-mail nebo heslo není správně.'
    );
  });

  it('logout odstraní session', async () => {
    await register('Jan Novák', 'jan@example.com', validPassword);
    expect(getSession()).not.toBeNull();

    logout();

    expect(getSession()).toBeNull();
  });

  it('getSession vrátí null pro neplatný JSON v session', async () => {
    localStorage.setItem('goodfeel.session', '{"broken');

    expect(getSession()).toBeNull();
  });
});

describe('inicializace demo dat', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('vytvoří demo účet, feed a message identitu', async () => {
    await initializeStorage();

    const user = await login('demo@goodfeel.local', 'goodfeel');
    expect(user.id).toBe(demoUser.id);

    const feed = await loadFeed();
    expect(feed).toHaveLength(demoFeed.length);
  });

  it('je idempotentní a nezdvojuje demo data', async () => {
    await initializeStorage();
    await initializeStorage();

    const feed = await loadFeed();
    expect(feed).toHaveLength(demoFeed.length);
    await expect(login('demo@goodfeel.local', 'goodfeel')).resolves.toBeTruthy();
  });
});