import Link from 'next/link';
import { ArrowLeft, Palette } from 'lucide-react';

export default function AppearanceSettingsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 py-2">
      <Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to Settings
      </Link>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <Palette aria-hidden="true" className="h-8 w-8 text-primary" />
        <h1 className="mt-5 text-3xl font-bold text-gray-950">Appearance</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          PersonaIQ currently uses one consistent light interface with
          a restrained red accent. Dark-mode, density and font-size preferences
          are not yet supported as functioning account settings.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          The interface respects your device&apos;s reduced-motion preference.
          Once preference controls are implemented, changes will be saved and
          applied across the application rather than shown as temporary switches.
        </p>
      </section>
    </main>
  );
}
