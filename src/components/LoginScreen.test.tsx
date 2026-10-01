import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { demoUser } from '../data/demo';
import { initializeStorage } from '../lib/storage';
import { resetTestDatabase } from '../test/helpers';
import { LoginScreen } from './LoginScreen';

const demoEmail = demoUser.email;
const demoPassword = 'goodfeel';

describe('LoginScreen', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('výchozí režim je přihlášení', () => {
    render(<LoginScreen onAuthenticated={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Přihlásit se do Goodfeel' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Heslo')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Přihlásit se' })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Jméno')).toBeNull();
  });

  it('přepíná mezi přihlášením a registrací', async () => {
    const user = userEvent.setup();

    render(<LoginScreen onAuthenticated={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Vytvořit nový účet' }));

    expect(screen.getByRole('heading', { name: 'Vytvořit nový účet' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Jméno')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Heslo · alespoň 8 znaků')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Už mám účet' }));

    expect(
      screen.getByRole('heading', { name: 'Přihlásit se do Goodfeel' })
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Jméno')).toBeNull();
  });

  it('vyplní demo účet a umí zobrazit heslo', async () => {
    const user = userEvent.setup();

    render(<LoginScreen onAuthenticated={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Použít demo účet' }));

    expect(screen.getByPlaceholderText('E-mail')).toHaveValue(demoEmail);
    const passwordInput = screen.getByPlaceholderText('Heslo');
    expect(passwordInput).toHaveValue(demoPassword);

    await user.click(screen.getByRole('button', { name: 'Zobrazit heslo' }));
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Skrýt heslo' })).toBeInTheDocument();
  });

  it('zobrazí chybu po neúspěšném přihlášení', async () => {
    const user = userEvent.setup();
    const onAuthenticated = vi.fn();

    render(<LoginScreen onAuthenticated={onAuthenticated} />);

    await user.type(screen.getByPlaceholderText('E-mail'), 'nikdo@example.com');
    await user.type(screen.getByPlaceholderText('Heslo'), 'spatne-heslo');
    await user.click(screen.getByRole('button', { name: 'Přihlásit se' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'E-mail nebo heslo není správně.'
    );
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it('po přihlášení demo účtem předá profil dál', async () => {
    const user = userEvent.setup();
    const onAuthenticated = vi.fn();

    await initializeStorage();
    render(<LoginScreen onAuthenticated={onAuthenticated} />);

    await user.click(screen.getByRole('button', { name: 'Použít demo účet' }));
    await user.click(screen.getByRole('button', { name: 'Přihlásit se' }));

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
    expect(onAuthenticated.mock.calls[0][0]).toMatchObject({
      email: demoEmail,
      name: demoUser.name,
      handle: demoUser.handle
    });
  });

  it('po registraci předá nový profil dál', async () => {
    const user = userEvent.setup();
    const onAuthenticated = vi.fn();

    render(<LoginScreen onAuthenticated={onAuthenticated} />);

    await user.click(screen.getByRole('button', { name: 'Vytvořit nový účet' }));
    await user.type(screen.getByPlaceholderText('Jméno'), 'Nová Testovací');
    await user.type(screen.getByPlaceholderText('E-mail'), 'nova@example.com');
    await user.type(screen.getByPlaceholderText('Heslo · alespoň 8 znaků'), 'bezpecne-heslo');
    await user.click(screen.getByRole('button', { name: 'Vytvořit účet' }));

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
    expect(onAuthenticated.mock.calls[0][0]).toMatchObject({
      name: 'Nová Testovací',
      email: 'nova@example.com'
    });
  });
});