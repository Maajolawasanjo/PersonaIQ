'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordStrengthMeter, validatePasswordRules } from '@/components/auth/PasswordStrengthMeter';
import { useAuth } from '@/providers/auth-provider';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const normalizedEmail = email.trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const validPassword = validatePasswordRules(password, normalizedEmail).isValid;
  const canSubmit = Boolean(
    firstName.trim() && lastName.trim() && validEmail &&
    validPassword && password === confirmation && terms && privacy && !busy
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError('');
    setBusy(true);
    try {
      const registration = await signUp(normalizedEmail, password, firstName.trim(), lastName.trim());
      if (!registration.verification_required) throw new Error('Email verification could not be started.');
      sessionStorage.setItem('personaiq_pending_verification_email', registration.email);
      router.replace('/verify-email');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Registration could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      headline="Welcome to PersonaIQ."
      subheadline="Create your account to prepare outfits and organize your looks for important occasions."
      topRightText="Already registered?"
      topRightLinkText="Sign in"
      topRightLinkHref="/login"
      badgeText="CREATE ACCOUNT"
    >
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">We’ll ask you to verify your email before accessing your workspace.</p>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-900">First name
              <input autoComplete="given-name" required maxLength={100} value={firstName} onChange={event => setFirstName(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
            </label>
            <label className="text-sm font-semibold text-gray-900">Last name
              <input autoComplete="family-name" required maxLength={100} value={lastName} onChange={event => setLastName(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
            </label>
          </div>
          <label className="block text-sm font-semibold text-gray-900">Email address
            <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          <PasswordField id="signup-password" label="Password" value={password} onChange={setPassword} autoComplete="new-password"/>
          <PasswordStrengthMeter password={password} email={normalizedEmail}/>
          <label className="block text-sm font-semibold text-gray-900">Confirm password
            <input type="password" required autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          {confirmation && confirmation !== password && <p className="text-xs text-red-700">Passwords do not match.</p>}
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={terms} onChange={event => setTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-red-700"/>
            <span>I agree to the <Link href="/terms" className="font-semibold text-primary underline">Terms of Use</Link>.</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={privacy} onChange={event => setPrivacy(event.target.checked)} className="mt-1 h-4 w-4 accent-red-700"/>
            <span>I have read the <Link href="/privacy" className="font-semibold text-primary underline">Privacy Information</Link>, including photo storage and providers.</span>
          </label>
          <button type="submit" disabled={!canSubmit} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
