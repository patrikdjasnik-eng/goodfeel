import { FormEvent, memo, useCallback, useState } from 'react';
import {
  BadgeCheck,
  BarChart3,
  Briefcase,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Users
} from 'lucide-react';
import type { UserProfile } from '../types';
import { login, register } from '../lib/storage';
import { BrandLockup } from './Brand';

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
        setError(caughtError instanceof Error ? caughtError.message : 'Přihlášení se nepodařilo.');
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
  }, []);

  return (
    <main className="auth-shell">
      <section className="auth-pitch glass-panel">
        <BrandLockup />

        <div className="auth-copy">
          <p className="eyebrow">Sociální síť pro skutečnou práci</p>
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

        <div className="feature-list">
          <article>
            <BadgeCheck size={21} />
            <div>
              <strong>Proof of Work</strong>
              <span>Dokončené projekty mohou potvrdit skuteční klienti.</span>
            </div>
          </article>
          <article>
            <Briefcase size={21} />
            <div>
              <strong>Práce a služby</strong>
              <span>Nabídky spolupráce nejsou schované mimo komunitu.</span>
            </div>
          </article>
          <article>
            <Users size={21} />
            <div>
              <strong>Lidé místo korporátního divadla</strong>
              <span>Krátké příspěvky, diskuze, projekty a reálné zkušenosti.</span>
            </div>
          </article>
          <article>
            <BarChart3 size={21} />
            <div>
              <strong>Reputace roste s prací</strong>
              <span>Ne podle počtu prázdných endorsementů.</span>
            </div>
          </article>
        </div>
      </section>

      <section className="auth-card glass-panel">
        <div className="auth-tabs" role="tablist" aria-label="Přihlášení nebo registrace">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Přihlášení
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
            type="button"
          >
            Registrace
          </button>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Goodfeel MVP</p>
          <h2>{mode === 'login' ? 'Vítejte zpět' : 'Vytvořte si profil'}</h2>
          <p>
            {mode === 'login'
              ? 'Přihlaste se ke svému účtu.'
              : 'Začněte publikovat práci, služby a projekty.'}
          </p>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label className="field-label">
              Jméno
              <span className="input-wrap">
                <Users size={19} />
                <input
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Vaše jméno"
                  required
                  value={name}
                />
              </span>
            </label>
          )}

          <label className="field-label">
            E-mail
            <span className="input-wrap">
              <Mail size={19} />
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vy@example.com"
                required
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="field-label">
            Heslo
            <span className="input-wrap">
              <LockKeyhole size={19} />
              <input
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 8 : undefined}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === 'register' ? 'Alespoň 8 znaků' : 'Vaše heslo'}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                className="icon-button"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button full-width" disabled={busy} type="submit">
            {busy ? 'Pracuji…' : mode === 'login' ? 'Přihlásit se' : 'Vytvořit účet'}
          </button>
        </form>

        <div className="demo-login">
          <span>Chcete se jen podívat?</span>
          <button onClick={fillDemo} type="button">
            Vyplnit demo účet
          </button>
          <small>demo@goodfeel.local · goodfeel</small>
        </div>

        <p className="auth-note">
          MVP ukládá účet lokálně v prohlížeči. Produkční autentizace a serverová databáze přijdou v další fázi.
        </p>
      </section>
    </main>
  );
});

LoginScreen.displayName = 'LoginScreen';
