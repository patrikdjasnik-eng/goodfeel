import { FormEvent, memo, useCallback, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
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

          <div className="auth-proof-row" aria-label="Goodfeel developer preview">
            <span><CheckCircle2 size={15} /> Proof of Work</span>
            <span><CheckCircle2 size={15} /> Local-first MVP</span>
            <span><CheckCircle2 size={15} /> PWA ready</span>
          </div>
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
        <div className="auth-card-inner">
          <div className="auth-card-status">
            <span><ShieldCheck size={15} /> Developer Preview</span>
            <small>v0.1</small>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Přihlášení nebo registrace">
            <button
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
              role="tab"
              type="button"
            >
              Přihlášení
            </button>
            <button
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'active' : ''}
              onClick={() => switchMode('register')}
              role="tab"
              type="button"
            >
              Registrace
            </button>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">Goodfeel</p>
            <h2>{mode === 'login' ? 'Vítejte zpět' : 'Vytvořte si profil'}</h2>
            <p>
              {mode === 'login'
                ? 'Pokračujte tam, kde jste skončili.'
                : 'Začněte publikovat práci, služby a projekty.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <label className="field-label">
                <span className="field-label-text">Jméno</span>
                <span className="input-wrap">
                  <Users size={18} />
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
              <span className="field-label-text">E-mail</span>
              <span className="input-wrap">
                <Mail size={18} />
                <input
                  autoCapitalize="none"
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vy@example.com"
                  required
                  spellCheck={false}
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="field-label">
              <span className="field-label-text">Heslo</span>
              <span className="input-wrap">
                <LockKeyhole size={18} />
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
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="primary-button auth-submit" disabled={busy} type="submit">
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

          <div className="demo-login">
            <div>
              <strong>Jen si Goodfeel prohlédnout?</strong>
              <span>Použijte lokální demo účet bez registrace.</span>
            </div>
            <button onClick={fillDemo} type="button">
              Vyplnit demo účet
            </button>
            <small>demo@goodfeel.local · goodfeel</small>
          </div>

          <p className="auth-note">
            Developer Preview ukládá účet pouze lokálně v tomto prohlížeči.
          </p>
        </div>
      </section>
    </main>
  );
});

LoginScreen.displayName = 'LoginScreen';
