import Link from 'next/link';
import { ArrowLeft, Accessibility } from 'lucide-react';

export default function AccessibilitySettingsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 py-2">
      <Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to Settings
      </Link>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <Accessibility aria-hidden="true" className="h-8 w-8 text-primary" />
        <h1 className="mt-5 text-3xl font-bold text-gray-950">Accessibility</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          PersonaIQ supports keyboard navigation and visible keyboard focus.
          The interface also respects the reduced-motion setting on your device.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Personal contrast, font sizing and motion overrides are not yet
          available as saved preferences. We have removed the previous
          switches because they did not change the actual interface.
        </p>
      </section>
    </main>
  );
}
