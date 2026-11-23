import Link from 'next/link';
import { ArrowLeft, Link2 } from 'lucide-react';

export default function ConnectedAccountsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 py-2">
      <Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to Settings
      </Link>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <Link2 aria-hidden="true" className="h-8 w-8 text-primary" />
        <h1 className="mt-5 text-3xl font-bold text-gray-950">Connected accounts</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          This workspace does not currently support connecting or disconnecting
          external Google, GitHub, Microsoft or Apple accounts.
        </p>
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-950">No account-linking controls are available</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Account connections will appear here only when an authenticated
            provider integration is available and its status can be verified.
            Changes made on this page are not simulated.
          </p>
        </div>
      </section>
    </main>
  );
}
