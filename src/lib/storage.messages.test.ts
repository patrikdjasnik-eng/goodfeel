import { beforeEach, describe, expect, it } from 'vitest';
import {
  decryptMessage,
  loadConversation,
  saveEncryptedMessage,
  validateMessageContent
} from './storage';
import { resetTestDatabase } from '../test/helpers';

const users = {
  alice: {
    id: 'alice-user',
    name: 'Alice',
    handle: 'alice',
    email: 'alice@example.com',
    headline: '',
    location: ''
  },
  bob: {
    id: 'bob-user',
    name: 'Bob',
    handle: 'bob',
    email: 'bob@example.com',
    headline: '',
    location: ''
  },
  eve: {
    id: 'eve-user',
    name: 'Eve',
    handle: 'eve',
    email: 'eve@example.com',
    headline: '',
    location: ''
  }
};

describe('messaging šifrování a ukládání', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('uloží zašifrovanou zprávu s ciphertextem a iv', async () => {
    const message = await saveEncryptedMessage(users.alice.id, users.bob.id, 'Ahoj Bobe!');

    expect(message.id).toBeTruthy();
    expect(message.senderId).toBe(users.alice.id);
    expect(message.recipientId).toBe(users.bob.id);
    expect(message.ciphertext).toBeTruthy();
    expect(message.iv).toBeTruthy();
    expect(message.ciphertext).not.toContain('Ahoj');
  });

  it('načte conversation pro obě strany a řadí zprávy vzestupně', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'První zpráva');
    await saveEncryptedMessage(users.bob.id, users.alice.id, 'Druhá zpráva');

    const fromAliceView = await loadConversation(users.alice.id, users.bob.id);
    expect(fromAliceView).toHaveLength(2);
    expect(fromAliceView[0].senderId).toBe(users.alice.id);
    expect(fromAliceView[1].senderId).toBe(users.bob.id);

    const fromBobView = await loadConversation(users.bob.id, users.alice.id);
    expect(fromBobView).toHaveLength(2);
  });

  it('vrátí prázdnou conversation, když mezi uživateli nic není', async () => {
    expect(await loadConversation(users.alice.id, users.bob.id)).toHaveLength(0);
  });

  it('nevmíchá do conversation zprávy jiného uživatele', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'Pro Boba');
    await saveEncryptedMessage(users.alice.id, users.eve.id, 'Pro Evu');

    const conversation = await loadConversation(users.alice.id, users.bob.id);

    expect(conversation).toHaveLength(1);
    expect(conversation[0].recipientId).toBe(users.bob.id);
  });
});

describe('messaging dešifrování a přístup', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    localStorage.clear();
  });

  it('dešifruje zprávu pro příjemce', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'Tajný vzkaz');

    const [message] = await loadConversation(users.bob.id, users.alice.id);
    const body = await decryptMessage(message, users.bob.id);

    expect(body).toBe('Tajný vzkaz');
  });

  it('dešifruje zprávu i pro odesílatele', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'Tajný vzkaz');

    const [message] = await loadConversation(users.alice.id, users.bob.id);
    await expect(decryptMessage(message, users.alice.id)).resolves.toBe('Tajný vzkaz');
  });

  it('při šifrování ořízne okolní mezery', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, '  Zpráva s mezerami  ');

    const [message] = await loadConversation(users.bob.id, users.alice.id);
    await expect(decryptMessage(message, users.bob.id)).resolves.toBe('Zpráva s mezerami');
  });

  it('zakáže čtení zprávy uživateli, který není odesílatel ani příjemce', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'Tajný vzkaz');

    const [message] = await loadConversation(users.alice.id, users.bob.id);

    await expect(decryptMessage(message, users.eve.id)).rejects.toThrow(
      'K této zprávě nemáte přístup.'
    );
  });

  it('vytvoří a znovupoužije message identity při dalším šifrování', async () => {
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'První');
    await saveEncryptedMessage(users.alice.id, users.bob.id, 'Druhá');

    const conversation = await loadConversation(users.bob.id, users.alice.id);
    expect(conversation).toHaveLength(2);
    await expect(decryptMessage(conversation[1], users.bob.id)).resolves.toBe('Druhá');
  });
});

describe('validace obsahu zpráv', () => {
  it('odmítne prázdnou zprávu', () => {
    expect(() => validateMessageContent('   ')).toThrow('Zpráva je prázdná.');
  });

  it('odmítne zprávu delší než 4000 znaků', () => {
    expect(() => validateMessageContent('a'.repeat(4001))).toThrow('Zpráva je příliš dlouhá.');
    expect(() => validateMessageContent('a'.repeat(4000))).not.toThrow();
  });

  it.each([
    ['csam výraz', 'csam'],
    ['anglickou dětskou pornografii', 'child porn'],
    ['českou dětskou pornografii', 'dětská pornografie'],
    ['sexuální zneužívání dětí', 'sexuální zneužívání dětí'],
    ['najmutí vraha anglicky', 'hire a hitman'],
    ['contract killing', 'contract killing'],
    ['najmutí vraha česky', 'najmout vraha'],
    ['vraždu na objednávku', 'vražda na objednávku']
  ])('zablokuje zprávu obsahující %s', (_description, fragment) => {
    expect(() => validateMessageContent(`před tím ${fragment} za tím`)).toThrow(
      'Tuhle zprávu nelze odeslat přes Goodfeel.'
    );
  });

  it('povolí běžnou zprávu', () => {
    expect(() => validateMessageContent('Zdravím, jak jde spolupráce?')).not.toThrow();
  });
});