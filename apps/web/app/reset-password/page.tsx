'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordStrengthMeter, validatePasswordRules } from '@/components/auth/PasswordStrengthMeter';
import { authApi } from '@/lib/api/services';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const resetToken = url.searchParams.get('token') || '';
    setToken(resetToken);
    // Avoid retaining a reset token in browsing history after its first read.
    if (resetToken) window.history.replaceState(null, '', url.pathname);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || password !== confirm || !validatePasswordRules(password).isValid || busy) return;
    setBusy(true);
    setError('');
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setToken('');
      setPassword('');
      setConfirm('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'This link may have expired. Request another reset link.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Choose a new password." subheadline="Secure your PersonaIQ account with a unique password." topRightText="Remember your password?" topRightLinkText="Sign in" topRightLinkHref="/login" badgeText="PASSWORD RESET">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-gray-950">{success ? 'Password updated' : 'Reset your password'}</h1>
        {success ? (
          <div role="status" className="space-y-4 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-700">Your password has been changed. Sign in with your new password to continue.</p>
            <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">Sign in</Link>
          </div>
        ) : !token ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">This page needs a valid password-reset link from your email.</p>
            <Link href="/forgot-password" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">Request a reset link</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <PasswordField id="reset-password" label="New password" value={password} onChange={setPassword} autoComplete="new-password"/>
            <PasswordStrengthMeter password={password}/>
            <label className="block text-sm font-semibold text-gray-900">Confirm new password
              <input type="password" required autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
            </label>
            {confirm && password !== confirm && <p className="text-xs text-red-700">Passwords do not match.</p>}
            <button type="submit" disabled={busy || !validatePasswordRules(password).isValid || confirm !== password} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? 'Saving…' : 'Save new password'}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
