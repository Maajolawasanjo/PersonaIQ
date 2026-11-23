import type { ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Inbox } from 'lucide-react';

export function WorkspaceLoading({ label = 'Loading your information' }: { label?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="space-y-4">
      <span className="sr-only">{label}</span>
      <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-7 sm:p-9">
        <div className="h-3 w-28 rounded-full bg-gray-100" />
        <div className="mt-5 h-7 w-2/3 rounded-lg bg-gray-100" />
        <div className="mt-4 h-4 w-3/4 rounded-lg bg-gray-100" />
        <div className="mt-7 h-11 w-40 rounded-xl bg-gray-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map(index => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="mt-4 h-8 w-14 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceError({
  title = 'Your information could not be loaded',
  description = 'The service may be temporarily unavailable. No changes were made.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
}) {
  return (
    <section role="alert" className="rounded-3xl border border-red-200 bg-white p-6 sm:p-8">
      <AlertCircle aria-hidden="true" className="h-7 w-7 text-red-700" />
      <h2 className="mt-4 text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">{description}</p>
      <button type="button" onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-red-800">
        Try again
      </button>
    </section>
  );
}

export function WorkspaceEmpty({
  title, description, href, action, icon,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  icon?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        {icon || <Inbox aria-hidden="true" className="h-6 w-6" />}
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-950">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">{description}</p>
      <Link href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-red-800">
        {action} <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </section>
  );
}
