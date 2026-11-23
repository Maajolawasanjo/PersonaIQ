import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function TwoFactorStatusPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-5 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-7 sm:p-9">
        <ShieldAlert aria-hidden="true" className="h-9 w-9 text-amber-600" />
        <h1 className="mt-5 text-2xl font-bold text-gray-950">
          Two-factor authentication is not available yet
        </h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          PersonaIQ currently requires email verification for newly created accounts.
          A separate code or authenticator challenge on every sign-in has not
          been implemented, and this page does not issue or validate one.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">
            Sign in
          </Link>
          <Link href="/verify-email" className="inline-flex min-h-11 items-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-800">
            Verify a new account
          </Link>
        </div>
      </section>
    </main>
  );
}
