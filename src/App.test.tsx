import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadFeed, register } from './lib/storage';
import { resetTestDatabase } from './test/helpers';
import App from './App';

const bodyPlaceholder = 'Co právě stavíte, řešíte nebo jste se naučili?';
const uiTimeout = { timeout: 10000 };

const expectLoginScreen = async () => {
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'Přihlásit se do Goodfeel' })
    ).toBeInTheDocument();
  }, uiTimeout);
};

describe('App smoke', { timeout: 15000 }, () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('bez uložené session zobrazí přihlášení', async () => {
    render(<App />);

    await expectLoginScreen();
    expect(screen.queryByRole('button', { name: /Odhlásit/ })).toBeNull();
  });

  it('se session zobrazí dashboard a umožní publikovat příspěvek do feedu', async () => {
    const user = userEvent.setup();
    const profile = await register('Petra Testovací', 'petra@example.com', 'bezpecne-heslo');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Co dnes tvoříte/ })).toBeInTheDocument();
    }, uiTimeout);

    await user.click(screen.getByRole('button', { name: /Co dnes tvoříte/ }));
    await user.type(screen.getByPlaceholderText(bodyPlaceholder), 'První příspěvek z testu');
    await user.click(screen.getByRole('button', { name: /Publikovat/ }));

    await waitFor(() => {
      expect(screen.getByText('První příspěvek z testu')).toBeInTheDocument();
    }, uiTimeout);
    expect(screen.getAllByText(profile.name).length).toBeGreaterThan(0);

    const stored = await loadFeed();
    expect(stored.some((item) => item.body === 'První příspěvek z testu')).toBe(true);
  });

  it('po odhlášení se vrátí na přihlašovací obrazovku', async () => {
    const user = userEvent.setup();

    await register('Petra Testovací', 'petra@example.com', 'bezpecne-heslo');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Odhlásit/ })).toBeInTheDocument();
    }, uiTimeout);

    await user.click(screen.getByRole('button', { name: /Odhlásit/ }));
    await expectLoginScreen();
  });
});