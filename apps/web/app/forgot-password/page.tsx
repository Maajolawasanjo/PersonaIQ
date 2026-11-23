'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api/services';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      router.replace('/email-sent?type=password-reset');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to process your request.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Secure your account." subheadline="Request a password-reset link for your registered email." topRightText="Remember your password?" topRightLinkText="Sign in" topRightLinkHref="/login" badgeText="PASSWORD RECOVERY">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-950">Forgot password?</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">If an account exists for this address, we’ll send reset instructions.</p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">Email address
            <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          <button type="submit" disabled={busy} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? 'Requesting…' : 'Request password reset'}
          </button>
        </form>
        <Link href="/login" className="inline-flex min-h-11 items-center text-sm font-medium text-gray-600">Back to sign in</Link>
      </div>
    </AuthLayout>
  );
}
