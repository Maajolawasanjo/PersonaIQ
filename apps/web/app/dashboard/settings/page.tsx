'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Bell, CreditCard, LockKeyhole, Palette,
  Shield, Trash2, UserRound, Link2, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { userApi } from '@/lib/api/services';

const settingsLinks = [
  { href: '/dashboard/profile', label: 'Profile', detail: 'Your name and account details', icon: UserRound },
  { href: '/dashboard/settings/security', label: 'Security', detail: 'Password and active sessions', icon: LockKeyhole },
  { href: '/dashboard/settings/notifications', label: 'Notifications', detail: 'Communication preferences', icon: Bell },
  { href: '/dashboard/settings/privacy', label: 'Privacy', detail: 'How your uploads and information are handled', icon: Shield },
  { href: '/dashboard/settings/appearance', label: 'Appearance', detail: 'Current display and accessibility status', icon: Palette },
  { href: '/dashboard/settings/accounts', label: 'Connected accounts', detail: 'Available integrations', icon: Link2 },
  { href: '/dashboard/settings/billing', label: 'Billing', detail: 'Billing availability and support', icon: CreditCard },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmation !== 'DELETE' || !password || isDeleting) return;
    setError(null);
    setIsDeleting(true);
    try {
      const result = await userApi.deleteAccount(password);
      if (!result.deleted) throw new Error('Deletion was not confirmed.');
      await logout();
      sessionStorage.setItem('personaiq_account_deletion_confirmed', 'yes');
      router.replace('/system/account-deleted');
    } catch (cause) {
      console.error('Account deletion was not confirmed:', cause);
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : 'Account deletion could not be completed. Your account remains available.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7 pb-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-700">Your account</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account and preferences in one place.</p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-7">
        <p className="text-sm font-semibold text-gray-950">
          {user?.first_name || user?.full_name || 'Your PersonaIQ account'}
        </p>
        {user?.email && <p className="mt-1 text-sm text-gray-600">{user.email}</p>}
        <div className="mt-5 divide-y divide-gray-100">
          {settingsLinks.map(({ href, label, detail, icon: Icon }) => (
            <Link key={href} href={href} className="group flex min-h-16 items-center gap-4 py-4 hover:text-primary">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 group-hover:bg-red-50 group-hover:text-primary">
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-950">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-gray-600">{detail}</span>
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-5 sm:p-7" aria-labelledby="delete-title">
        <h2 id="delete-title" className="text-lg font-semibold text-gray-950">Delete your account</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          This is permanent. Your account data and uploaded photos linked to your journeys
          will be submitted for removal. If storage cleanup fails, deletion will not be reported as complete.
        </p>

        {!showDelete ? (
          <button type="button" onClick={() => setShowDelete(true)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50">
            <Trash2 aria-hidden="true" className="h-4 w-4" /> Review account deletion
          </button>
        ) : (
          <form onSubmit={handleDelete} className="mt-6 space-y-4" noValidate>
            <label className="block text-sm font-semibold text-gray-800">
              Type DELETE to confirm
              <input type="text" value={confirmation} onChange={event => setConfirmation(event.target.value)}
                autoComplete="off" required aria-describedby="delete-description"
                className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-950 focus:border-primary focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </label>
            <p id="delete-description" className="text-xs text-gray-600">Account deletion cannot be undone.</p>
            <label className="block text-sm font-semibold text-gray-800">
              Current password
              <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)}
                required className="mt-2 block h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-950 focus:border-primary focus:outline-none focus:ring-2 focus:ring-red-100" />
            </label>
            {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={confirmation !== 'DELETE' || !password || isDeleting}
                className="min-h-11 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">
                {isDeleting ? 'Deleting…' : 'Permanently delete account'}
              </button>
              <button type="button" onClick={() => { setShowDelete(false); setConfirmation(''); setPassword(''); setError(null); }}
                className="min-h-11 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
