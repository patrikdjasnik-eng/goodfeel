import { FormEvent, memo, useCallback, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Users
} from 'lucide-react';
import type { UserProfile } from '../types';
import { login, register } from '../lib/storage';
import { BrandLockup, BrandMark } from './Brand';

interface LoginScreenProps {
  onAuthenticated: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'register';

export const LoginScreen = memo(({ onAuthenticated }: LoginScreenProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setShowPassword(false);
  }, []);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      setBusy(true);

      try {
        const user =
          mode === 'login'
            ? await login(email, password)
            : await register(name, email, password);

        onAuthenticated(user);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Přihlášení se nepodařilo.'
        );
      } finally {
        setBusy(false);
      }
    },
    [email, mode, name, onAuthenticated, password]
  );

  const fillDemo = useCallback(() => {
    setMode('login');
    setEmail('demo@goodfeel.local');
    setPassword('goodfeel');
    setError('');
    setShowPassword(false);
  }, []);

  return (
    <main className="auth-shell">
      <section className="auth-hero" aria-label="Goodfeel">
        <div className="auth-brand">
          <BrandLockup />
        </div>

        <div className="auth-visual" aria-hidden="true">
          <span className="auth-orbit auth-orbit-one" />
          <span className="auth-orbit auth-orbit-two" />
          <span className="auth-orbit auth-orbit-three" />

          <div className="auth-visual-logo">
            <BrandMark />
          </div>

          <span className="auth-visual-dot auth-visual-dot-one" />
          <span className="auth-visual-dot auth-visual-dot-two" />
          <span className="auth-visual-dot auth-visual-dot-three" />
        </div>

        <div className="auth-hero-copy">
          <p className="auth-kicker">Sociální síť pro skutečnou práci</p>
          <h1>
            Skuteční lidé.<br />
            Skutečná práce.<br />
            <span>Větší možnosti.</span>
          </h1>
          <p>
            Profily, projekty, nabídky práce a přirozené konverzace na jednom místě.
            Reputace vzniká z toho, co opravdu dokončíte.
          </p>
        </div>
      </section>

      <section className="auth-login">
        <div className="auth-login-inner">
          <div className="auth-heading">
            <p className="auth-login-kicker">Goodfeel</p>
            <h2>
              {mode === 'login'
                ? 'Přihlásit se do Goodfeel'
                : 'Vytvořit nový účet'}
            </h2>
            <p>
              {mode === 'login'
                ? 'Pokračujte tam, kde jste skončili.'
                : 'Začněte sdílet projekty, práci a výsledky.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <label className="auth-field">
                <span className="sr-only">Jméno</span>
                <span className="input-wrap">
                  <Users size={18} />
                  <input
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jméno"
                    required
                    value={name}
                  />
                </span>
              </label>
            )}

            <label className="auth-field">
              <span className="sr-only">E-mail</span>
              <span className="input-wrap">
                <Mail size={18} />
                <input
                  autoCapitalize="none"
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="E-mail"
                  required
                  spellCheck={false}
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="auth-field">
              <span className="sr-only">Heslo</span>
              <span className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={mode === 'register' ? 8 : undefined}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === 'register' ? 'Heslo · alespoň 8 znaků' : 'Heslo'}
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="auth-submit" disabled={busy} type="submit">
              <span>
                {busy
                  ? 'Pracuji…'
                  : mode === 'login'
                    ? 'Přihlásit se'
                    : 'Vytvořit účet'}
              </span>
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          {mode === 'login' ? (
            <>
              <button className="auth-text-action" onClick={fillDemo} type="button">
                Použít demo účet
              </button>

              <div className="auth-divider">
                <span />
              </div>

              <button
                className="auth-secondary-action"
                onClick={() => switchMode('register')}
                type="button"
              >
                Vytvořit nový účet
              </button>
            </>
          ) : (
            <>
              <button
                className="auth-text-action"
                onClick={() => switchMode('login')}
                type="button"
              >
                Už mám účet
              </button>

              <div className="auth-divider">
                <span />
              </div>

              <button
                className="auth-secondary-action"
                onClick={fillDemo}
                type="button"
              >
                Vyzkoušet demo účet
              </button>
            </>
          )}

          <p className="auth-note">
            Developer Preview · účet se zatím ukládá pouze lokálně v tomto prohlížeči.
          </p>
        </div>
      </section>
    </main>
  );
});

LoginScreen.displayName = 'LoginScreen';
