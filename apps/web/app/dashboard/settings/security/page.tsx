'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LockKeyhole, ShieldCheck, XCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { userApi } from '@/lib/api/services';
import type { UserSession } from '@/lib/api/types';
import { validatePasswordRules } from '@/components/auth/PasswordStrengthMeter';

type SessionState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; sessions: UserSession[] };

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;
    userApi.getSessions()
      .then(data => {
        if (mounted) setSessions({ status: 'ready', sessions: data });
      })
      .catch(() => {
        if (mounted) setSessions({ status: 'error' });
      });
    return () => { mounted = false; };
  }, []);

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (busy || !current || !validatePasswordRules(next).isValid || next !== confirm) return;
    setBusy(true);
    try {
      await userApi.changePassword({ current_password: current, new_password: next });
      await logout();
      router.replace('/login?password=updated');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Password change could not be completed.');
      setBusy(false);
    }
  };

  const revoke = async (sessionId: string) => {
    if (revoking) return;
    setRevoking(sessionId);
    setError('');
    setStatus('');
    try {
      const result = await userApi.revokeSession(sessionId);
      if (!result.revoked) throw new Error('Session revocation was not confirmed.');
      setSessions(previous => previous.status === 'ready'
        ? { status: 'ready', sessions: previous.sessions.filter(s => s.id !== sessionId) }
        : previous);
      setStatus('Refresh session revoked. Existing access tokens can remain valid until they expire.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not revoke this session.');
    } finally {
      setRevoking(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 py-2">
      <Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to Settings
      </Link>
      <header>
        <h1 className="text-3xl font-bold text-gray-950">Account security</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">Update your password and review sessions that can refresh your sign-in.</p>
      </header>

      {status && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{status}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <form onSubmit={changePassword} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <LockKeyhole aria-hidden="true" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-950">Change password</h2>
        </div>
        <p className="text-sm leading-6 text-gray-600">Changing your password revokes all refresh sessions, including this one. You will need to sign in again.</p>
        <label className="block text-sm font-semibold text-gray-900">Current password
          <input type="password" autoComplete="current-password" required value={current} onChange={event => setCurrent(event.target.value)} disabled={busy} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
        </label>
        <label className="block text-sm font-semibold text-gray-900">New password
          <input type="password" autoComplete="new-password" required value={next} onChange={event => setNext(event.target.value)} disabled={busy} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
        </label>
        <label className="block text-sm font-semibold text-gray-900">Confirm new password
          <input type="password" autoComplete="new-password" required value={confirm} onChange={event => setConfirm(event.target.value)} disabled={busy} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
        </label>
        <p className="text-xs text-gray-600">Use a strong password with numbers and letters. Your current password is required.</p>
        <button type="submit" disabled={busy || !current || !validatePasswordRules(next).isValid || next !== confirm} className="min-h-12 rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? 'Changing password…' : 'Change password and sign out'}
        </button>
      </form>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" aria-labelledby="sessions-heading">
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary" />
          <h2 id="sessions-heading" className="text-lg font-semibold text-gray-950">Refresh sessions</h2>
        </div>
        <p className="text-sm leading-6 text-gray-600">
          These records can renew sign-ins. Revoking a session blocks future refreshes, but a previously issued access token may remain valid for up to 15 minutes.
          We cannot reliably identify which record corresponds to this browser yet.
        </p>
        {sessions.status === 'loading' ? <p role="status" className="text-sm text-gray-600">Loading sessions…</p> :
          sessions.status === 'error' ? <p role="alert" className="text-sm text-red-700">Sessions could not be loaded. No account state was changed.</p> :
          sessions.sessions.length === 0 ? <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">No active refresh sessions were returned.</p> :
          <ul className="divide-y divide-gray-100">
            {sessions.sessions.map(session => (
              <li key={session.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-950">Browser session</p>
                  <p className="mt-1 text-xs text-gray-600">Created {new Date(session.created_at).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-gray-500">Expires {new Date(session.expires_at).toLocaleString()}</p>
                </div>
                <button type="button" onClick={() => revoke(session.id)} disabled={Boolean(revoking)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                  <XCircle aria-hidden="true" className="h-4 w-4" />
                  {revoking === session.id ? 'Revoking…' : 'Revoke'}
                </button>
              </li>
            ))}
          </ul>
        }
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-950">Two-factor authentication</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Email verification is required when creating a new account.
          A separate second factor for every sign-in is not yet available.
        </p>
      </section>
    </main>
  );
}
