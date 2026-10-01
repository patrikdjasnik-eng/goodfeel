import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FeedItem } from '../types';
import { makeUser } from '../test/helpers';
import { Composer } from './Composer';

const bodyPlaceholder = 'Co právě stavíte, řešíte nebo jste se naučili?';
const projectBodyPlaceholder = 'Co jste postavili, dokončili nebo právě stavíte?';
const jobBodyPlaceholder = 'Koho hledáte a na jakou spolupráci?';
const sparkOptionName = 'Good Spark: Tohle má dobrý feeling.';

const setupComposer = () => {
  const onCreate = vi.fn(async (_item: FeedItem) => {});
  const user = makeUser();

  render(<Composer onCreate={onCreate} user={user} />);

  return { onCreate, user };
};

const expandComposer = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /Vytvořit/ }));
};

const workmojiTrigger = () => screen.getByTitle('Goodfeel Workmoji');

describe('Composer', { timeout: 15000 }, () => {
  it('začíná sbalený a po kliknutí rozbalí editor', async () => {
    const user = userEvent.setup();

    setupComposer();
    expect(screen.queryByPlaceholderText(bodyPlaceholder)).toBeNull();

    await expandComposer(user);

    expect(screen.getByPlaceholderText(bodyPlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Typ nového obsahu' })).toBeInTheDocument();
  });

  it('vloží Workmoji za aktuální pozici kurzoru', async () => {
    const user = userEvent.setup();

    setupComposer();
    await expandComposer(user);

    const textarea = screen.getByPlaceholderText(bodyPlaceholder);
    await user.type(textarea, 'Ahoj');

    await user.click(workmojiTrigger());
    await user.click(screen.getByRole('button', { name: sparkOptionName }));

    expect(textarea).toHaveValue('Ahoj :gf-spark: ');
    expect(workmojiTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('vloží Workmoji doprostřed textu podle označené pozice', async () => {
    const user = userEvent.setup();

    setupComposer();
    await expandComposer(user);

    const textarea = screen.getByPlaceholderText<HTMLTextAreaElement>(bodyPlaceholder);
    await user.type(textarea, 'Ahoj světe');

    textarea.setSelectionRange(5, 5);
    fireEvent.select(textarea);

    await user.click(workmojiTrigger());
    await user.click(screen.getByRole('button', { name: sparkOptionName }));

    expect(textarea).toHaveValue('Ahoj :gf-spark: světe');
  });

  it('zavře Workmoji picker klávesou Escape i kliknutím mimo', async () => {
    const user = userEvent.setup();

    setupComposer();
    await expandComposer(user);

    await user.click(workmojiTrigger());
    expect(screen.getByRole('dialog', { name: 'Goodfeel Workmoji' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Goodfeel Workmoji' })).toBeNull()
    );

    await user.click(workmojiTrigger());
    expect(screen.getByRole('dialog', { name: 'Goodfeel Workmoji' })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Goodfeel Workmoji' })).toBeNull()
    );
  });

  it('publikuje příspěvek s tagy a sbalí editor', async () => {
    const user = userEvent.setup();
    const { onCreate, user: profile } = setupComposer();

    await expandComposer(user);
    await user.type(
      screen.getByPlaceholderText(bodyPlaceholder),
      'Dokončil jsem :gf-delivered: nasazení'
    );
    await user.type(screen.getByLabelText('Tagy'), 'typescript, react, ');

    await user.click(screen.getByRole('button', { name: /Publikovat/ }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));

    const item = onCreate.mock.calls[0][0];

    expect(item).toMatchObject({
      kind: 'post',
      body: 'Dokončil jsem :gf-delivered: nasazení',
      tags: ['typescript', 'react'],
      likes: 0,
      comments: 0,
      verification: 'none',
      status: 'active'
    });
    expect(item.author).toEqual(profile);
    expect(item.title).toBeUndefined();
    expect(item.id).toMatch(/^[0-9a-f-]{8,}$/);

    expect(screen.queryByPlaceholderText(bodyPlaceholder)).toBeNull();
    expect(screen.getByRole('button', { name: /Vytvořit/ })).toBeInTheDocument();
  });
  it('neodešle projekt bez názvu a po doplnění nastaví pending verifikaci', async () => {
    const user = userEvent.setup();
    const { onCreate } = setupComposer();

    await expandComposer(user);
    await user.click(screen.getByRole('button', { name: 'Projekt' }));
    await user.type(
      screen.getByPlaceholderText(projectBodyPlaceholder),
      'Popis nového projektu'
    );

    const form = document.querySelector('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);
    expect(onCreate).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText('Projekt — krátký název'), 'Skladový systém');
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(onCreate.mock.calls[0][0]).toMatchObject({
      kind: 'project',
      title: 'Skladový systém',
      body: 'Popis nového projektu',
      verification: 'pending',
      status: 'active'
    });
  });

  it('publikuje pracovní nabídku se stavem open', async () => {
    const user = userEvent.setup();
    const { onCreate } = setupComposer();

    await expandComposer(user);
    await user.click(screen.getByRole('button', { name: 'Práce' }));
    await user.type(screen.getByPlaceholderText('Práce — krátký název'), 'Hledám frontend parťáka');
    await user.type(
      screen.getByPlaceholderText(jobBodyPlaceholder),
      'Nabízíme dlouhodobou spolupráci.'
    );

    await user.click(screen.getByRole('button', { name: /Publikovat/ }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(onCreate.mock.calls[0][0]).toMatchObject({
      kind: 'job',
      title: 'Hledám frontend parťáka',
      verification: 'none',
      status: 'open'
    });
  });
});
