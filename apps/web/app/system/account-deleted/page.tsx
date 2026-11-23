'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AccountDeletionResultPage() {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'unconfirmed'>('checking');

  useEffect(() => {
    const confirmed = sessionStorage.getItem('personaiq_account_deletion_confirmed') === 'yes';
    sessionStorage.removeItem('personaiq_account_deletion_confirmed');
    setStatus(confirmed ? 'confirmed' : 'unconfirmed');
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] p-5">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {status === 'checking' ? (
          <p role="status" className="text-sm text-gray-600">Checking account-deletion status…</p>
        ) : status === 'confirmed' ? (
          <>
            <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-emerald-600" />
            <h1 className="mt-5 text-2xl font-bold text-gray-950">Account deletion confirmed</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              PERSONAIQ confirmed your account deletion request and associated
              storage cleanup. You have been signed out.
            </p>
          </>
        ) : (
          <>
            <ShieldAlert aria-hidden="true" className="h-10 w-10 text-amber-600" />
            <h1 className="mt-5 text-2xl font-bold text-gray-950">Deletion was not verified</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Opening this page does not delete an account. Account deletion must
              be confirmed from Settings while signed in.
            </p>
          </>
        )}
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
          Return to homepage
        </Link>
      </section>
    </main>
  );
}
