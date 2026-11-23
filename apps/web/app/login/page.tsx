'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';
import { useAuth } from '@/providers/auth-provider';

function safeDestination(redirect: string | null): string {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//') || redirect.includes('\\')) {
    return '/dashboard';
  }
  return redirect;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [passwordChangedNotice, setPasswordChangedNotice] = useState(false);

  useEffect(() => {
    setPasswordChangedNotice(new URLSearchParams(window.location.search).get('password') === 'updated');
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setError('');
    setVerificationNeeded(false);
    try {
      const session = await signIn(email.trim().toLowerCase(), password);
      const redirect = safeDestination(new URLSearchParams(window.location.search).get('redirect'));
      router.replace(session.user && !session.user.onboarding_completed ? '/onboarding' : redirect);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Sign in failed.';
      setVerificationNeeded(message.toLowerCase().includes('verify your email'));
      setError(message.replace(/^(BACKEND_WARMING|NETWORK_ERROR|SESSION_EXPIRED):\s*/, ''));
    } finally {
      setBusy(false);
    }
  };

  const openVerification = () => {
    sessionStorage.setItem('personaiq_pending_verification_email', email.trim().toLowerCase());
    router.push('/verify-email');
  };

  return (
    <AuthLayout
      headline="Welcome back to PersonaIQ."
      subheadline="Access your saved outfits, event preparations and personal styling workspace."
      topRightText="New to PersonaIQ?"
      topRightLinkText="Create account"
      topRightLinkHref="/signup"
      badgeText="SIGN IN"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">Use your registered email address and password.</p>
        </div>
        {passwordChangedNotice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Your password was updated. Sign in again with the new password.</p>}
        {error && (
          <div role="alert" className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p>{error}</p>
            {verificationNeeded && <button type="button" onClick={openVerification} className="min-h-10 font-semibold underline">Verify my email</button>}
          </div>
        )}
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm font-semibold text-gray-900">Email address
            <input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          <PasswordField id="login-password" label="Password" value={password} onChange={setPassword} autoComplete="current-password"
            rightElement={<Link href="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link>}
          />
          <button type="submit" disabled={busy} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in to workspace'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
