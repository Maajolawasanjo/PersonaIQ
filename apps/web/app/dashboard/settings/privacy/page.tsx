'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacySettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4"/> Back to settings
      </Link>
      <div className="space-y-3">
        <ShieldCheck className="h-8 w-8 text-red-700"/>
        <h1 className="text-3xl font-bold text-gray-950">Privacy & Your Data</h1>
        <p className="text-sm leading-6 text-gray-600">PERSONAIQ processes the personal information and images you choose to submit. Image storage and retention depend on the configured backend service.</p>
      </div>
      <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-semibold text-amber-950">Data controls are being updated</h2>
        <p className="text-sm leading-6 text-amber-900">Automatic image deletion and analytics preferences are not currently available as working account controls. We have hidden the previous switches because they did not save or enforce your choices.</p>
        <p className="text-sm text-amber-900">Do not assume that closing your browser deletes uploaded images.</p>
      </section>
      <section className="rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-950">Need help with your data?</h2>
        <p className="mt-2 text-sm text-gray-600">You can contact support about information associated with your account while self-service controls are being completed.</p>
        <Link href="/contact" className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800">Contact support</Link>
      </section>
    </div>
  );
}
