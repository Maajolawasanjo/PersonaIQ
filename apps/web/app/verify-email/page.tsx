'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/providers/auth-provider';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [remaining, setRemaining] = useState(60);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setEmail(sessionStorage.getItem('personaiq_pending_verification_email') || '');
  }, []);

  useEffect(() => {
    if (remaining <= 0) return;
    const timeout = setTimeout(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timeout);
  }, [remaining]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[0-9]{6}$/.test(code) || !email.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await verifyOtp(email.trim().toLowerCase(), code);
      sessionStorage.removeItem('personaiq_pending_verification_email');
      router.replace('/onboarding');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Verification failed.');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (remaining > 0 || !email.trim() || busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await resendOtp(email.trim().toLowerCase());
      setNotice('If this email has a pending account, another code will be sent when eligible.');
      setRemaining(60);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to request a new code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      headline="Verify your email."
      subheadline="Confirm ownership of your email before signing into PERSONAIQ."
      topRightText="Already verified?"
      topRightLinkText="Sign in"
      topRightLinkHref="/login"
      badgeText="EMAIL VERIFICATION"
    >
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-gray-950">Check your inbox</h1>
        <p className="text-sm leading-6 text-gray-600">Enter the six-digit code sent to your email. Codes expire after 10 minutes.</p>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{notice}</p>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">Email address
            <input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          <label className="block text-sm font-semibold text-gray-900">Verification code
            <input type="text" required autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" className="mt-2 block h-14 w-full rounded-xl border border-gray-300 px-4 text-center font-mono text-2xl font-bold tracking-[0.4em]"/>
          </label>
          <button type="submit" disabled={busy || !email.trim() || code.length !== 6} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? 'Verifying…' : 'Verify and continue'}
          </button>
        </form>
        <button type="button" onClick={resend} disabled={busy || remaining > 0} className="min-h-11 text-sm font-semibold text-primary disabled:text-gray-400">
          {remaining > 0 ? 'Request another code in ' + remaining + 's' : 'Request another code'}
        </button>
        <div><Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-950">Return to sign in</Link></div>
      </div>
    </AuthLayout>
  );
}
