import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function BillingSettingsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 py-2">
      <Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to Settings
      </Link>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <CreditCard aria-hidden="true" className="h-8 w-8 text-primary" />
        <h1 className="mt-5 text-3xl font-bold text-gray-950">Billing</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          Subscription management is not yet available in the PERSONAIQ
          workspace. We cannot display a verified subscription, invoices,
          or payment method here until billing is connected to the backend.
        </p>
        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          No checkout, plan upgrade, or cancellation button is provided on
          this page until those actions are genuinely supported.
        </div>
        <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50">
          Contact support
        </Link>
      </section>
    </main>
  );
}
