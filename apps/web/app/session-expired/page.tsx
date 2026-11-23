'use client';

import Link from 'next/link';
import { ArrowRight, LockKeyhole } from 'lucide-react';

export default function SessionExpiredPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xl font-extrabold text-gray-950">
          Persona<span className="text-red-600">IQ</span>
        </p>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-950">Your session has ended</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Please sign in again to continue. Your account credentials are never
          prefilled or stored on this screen.
        </p>
        <Link href="/login?redirect=%2Fdashboard"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          Sign in securely <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
