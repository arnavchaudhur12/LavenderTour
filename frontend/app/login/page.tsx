'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

type FormState = {
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
  token: string;
};

const initialState: FormState = {
  email: '',
  password: '',
  phone: '',
  confirmPassword: '',
  token: '',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const modeFromQuery = searchParams.get('mode');
  const resetTokenFromQuery = searchParams.get('token') ?? '';
  const initialMode: Mode = modeFromQuery === 'reset' ? 'reset' : 'login';

  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState<FormState>({ ...initialState, token: resetTokenFromQuery });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (mode === 'register') return 'Create your account';
    if (mode === 'forgot') return 'Reset your password';
    if (mode === 'reset') return 'Choose a new password';
    return 'Login to Lavender Tour';
  }, [mode]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'login') {
        await callApi('/auth/login', { email: form.email, password: form.password });
        setMessage('Login successful. Your session token has been issued by the backend.');
      } else if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await callApi('/auth/register', {
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        setMessage('Account created. You can now sign in with your email and password.');
        setMode('login');
      } else if (mode === 'forgot') {
        const response = await callApi('/auth/forgot-password', { email: form.email });
        const maybeToken = response.reset_token ? ` Reset token: ${response.reset_token}` : '';
        setMessage(`${response.message}.${maybeToken}`.trim());
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await callApi('/auth/reset-password', { token: form.token, password: form.password });
        setMessage('Password updated. You can now log in with the new password.');
        setMode('login');
      }
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Something went wrong';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,72,245,0.16),_transparent_28%),linear-gradient(180deg,#f7f1e8_0%,#fffdf9_100%)] text-night">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-lavender-700">
            Lavender Tour
          </Link>
          <Link href="/" className="rounded-full border border-night/10 bg-white/70 px-4 py-2 text-sm text-night/80">
            Back to home
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-12 md:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-lavender-700">Account access</p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
              <p className="max-w-xl text-lg text-night/70">
                Sign in with your registered email and password. New users should create a profile with email, phone number,
                and password before continuing.
              </p>
            </div>

            <div className="rounded-3xl border border-night/10 bg-white/70 p-6 shadow-lg glow">
              <p className="mb-3 text-sm text-night/60">Flow</p>
              <ul className="space-y-2 text-sm text-night/80">
                <li>• Existing user: log in with email and password</li>
                <li>• New user: create profile with phone, email, and password</li>
                <li>• Forgot password: reset link goes to the registered email address</li>
              </ul>
            </div>
          </section>

          <section className="rounded-[2rem] border border-night/10 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,16,36,0.12)] md:p-8">
            <div className="mb-6 flex flex-wrap gap-2">
              <ModeButton active={mode === 'login'} onClick={() => setMode('login')}>
                Login
              </ModeButton>
              <ModeButton active={mode === 'register'} onClick={() => setMode('register')}>
                Create account
              </ModeButton>
              <ModeButton active={mode === 'forgot'} onClick={() => setMode('forgot')}>
                Forgot password
              </ModeButton>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                <Field
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                  placeholder="you@example.com"
                />
              )}

              {mode === 'register' && (
                <Field
                  label="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                  placeholder="+91 6290699109"
                />
              )}

              {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                <Field
                  label={mode === 'reset' ? 'New password' : 'Password'}
                  type="password"
                  value={form.password}
                  onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                  placeholder="Minimum 8 characters"
                />
              )}

              {(mode === 'register' || mode === 'reset') && (
                <Field
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))}
                  placeholder="Repeat your password"
                />
              )}

              {mode === 'reset' && (
                <Field
                  label="Reset token"
                  type="text"
                  value={form.token}
                  onChange={(value) => setForm((current) => ({ ...current, token: value }))}
                  placeholder="Paste the token from your reset email"
                />
              )}

              {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-lavender-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-lavender-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Please wait...' : buttonLabel(mode)}
              </button>
            </form>

            <div className="mt-6 text-sm text-night/65">
              {mode === 'login' ? (
                <p>
                  New here?{' '}
                  <button className="font-medium text-lavender-700" onClick={() => setMode('register')} type="button">
                    Create your account
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p>
                  Already registered?{' '}
                  <button className="font-medium text-lavender-700" onClick={() => setMode('login')} type="button">
                    Go to login
                  </button>
                </p>
              ) : (
                <p>
                  Remembered it?{' '}
                  <button className="font-medium text-lavender-700" onClick={() => setMode('login')} type="button">
                    Back to login
                  </button>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LoginPageFallback() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,72,245,0.16),_transparent_28%),linear-gradient(180deg,#f7f1e8_0%,#fffdf9_100%)] text-night">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-8">
        <div className="rounded-3xl border border-night/10 bg-white/80 px-6 py-4 text-sm text-night/70 shadow-lg">
          Loading login screen...
        </div>
      </div>
    </main>
  );
}

async function callApi(path: string, payload: Record<string, string>) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }
  return data;
}

function buttonLabel(mode: Mode) {
  if (mode === 'register') return 'Create account';
  if (mode === 'forgot') return 'Send reset link';
  if (mode === 'reset') return 'Update password';
  return 'Login';
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active ? 'bg-night text-white' : 'bg-sand text-night/75 hover:bg-sand/70'
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-night/75">{label}</span>
      <input
        className="w-full rounded-2xl border border-night/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
