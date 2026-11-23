'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { userApi } from '@/lib/api/services';

const occasions = [
  { value: 'Interview', label: 'Interview' },
  { value: 'Conference', label: 'Conference or presentation' },
  { value: 'Meeting', label: 'Work meeting' },
  { value: 'Wedding', label: 'Wedding or celebration' },
  { value: 'Other', label: 'Something else' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading, refetchUser, updateUserLocally } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [eventType, setEventType] = useState('Interview');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login?redirect=%2Fonboarding');
      return;
    }
    if (user.onboarding_completed) {
      router.replace('/dashboard');
      return;
    }
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setOccupation(user.occupation || '');
  }, [user, isLoading, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      const saved = await userApi.completeOnboarding({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        occupation: occupation.trim() || undefined,
        default_event_type: eventType,
      });
      if (!saved.onboarding_completed) throw new Error('Setup was not confirmed by the server.');
      updateUserLocally(saved);
      await refetchUser();
      router.replace('/dashboard');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save your setup. Please retry.');
    } finally {
      setBusy(false);
    }
  };

  if (isLoading || !user || user.onboarding_completed) {
    return <main role="status" className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-5 text-sm text-gray-700">Loading your account…</main>;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] px-5 py-10 text-gray-950">
      <div className="mx-auto max-w-xl space-y-6">
        <header>
          <p className="text-lg font-extrabold">Persona<span className="text-primary">IQ</span></p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-red-700">Account setup</p>
          <h1 className="mt-2 text-3xl font-bold">Make your workspace yours</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">Tell us a little about yourself and the occasions you usually prepare for. You can change your profile later.</p>
        </header>
        <form onSubmit={submit} className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">First name
              <input required maxLength={100} value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
            </label>
            <label className="text-sm font-semibold">Last name
              <input required maxLength={100} value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
            </label>
          </div>
          <label className="block text-sm font-semibold">Occupation (optional)
            <input value={occupation} maxLength={100} onChange={event => setOccupation(event.target.value)} placeholder="e.g. Student, designer, developer" className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm font-normal"/>
          </label>
          <label className="block text-sm font-semibold">What type of event are you preparing for?
            <select value={eventType} onChange={event => setEventType(event.target.value)} className="mt-2 block h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm font-normal">
              {occasions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button type="submit" disabled={busy} className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? 'Saving your setup…' : 'Finish setup'}
          </button>
          <p className="text-center text-xs text-gray-500">Your setup is saved only after confirmation from the server.</p>
        </form>
        <p className="text-center text-sm text-gray-600">Want to sign out? <Link href="/dashboard/settings" className="font-semibold text-primary">Account settings</Link></p>
      </div>
    </main>
  );
}
