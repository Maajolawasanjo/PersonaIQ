'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, FileText } from 'lucide-react';
import { plansApi } from '@/lib/api/services';
import type { SavedPlanSummary } from '@/lib/api/types';

type PlansState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; plans: SavedPlanSummary[] };

export default function SavedPlansPage() {
  const [state, setState] = useState<PlansState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const plans = await plansApi.listPlans();
        if (active) {
          setState({
            status: 'ready',
            plans: [...plans].sort((a, b) =>
              (b.created_at || '').localeCompare(a.created_at || '')
            ),
          });
        }
      } catch {
        if (active) setState({ status: 'error' });
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-6 py-2">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">Your records</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">Saved Plans</h1>
          <p className="mt-2 text-sm text-gray-600">
            Revisit the reports saved to your account. Results are never
            filled with example images or scores.
          </p>
        </div>
        <Link href="/journey/start" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white">
          New preparation <ArrowRight aria-hidden="true" className="h-4 w-4"/>
        </Link>
      </header>

      {state.status === 'loading' ? (
        <div role="status" className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">
          Loading saved plans…
        </div>
      ) : state.status === 'error' ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          Your plans could not be loaded. Please check your connection and try again.
        </div>
      ) : state.plans.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
          <ClipboardList aria-hidden="true" className="h-9 w-9 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-950">No saved plans yet</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
            Successfully generated plans will appear here with their actual
            creation dates. Until then, you can explore your wardrobe or
            start an event preparation.
          </p>
          <Link href="/wardrobe" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Open wardrobe <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <ul className="space-y-3">
          {state.plans.map(plan => (
            <li key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">
                    {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'Date unavailable'}
                  </p>
                  <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-950">
                    <FileText aria-hidden="true" className="h-5 w-5 text-primary" />
                    Saved Presence Plan
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    View the report for this preparation. Historic scores may
                    predate the verified analysis system.
                  </p>
                </div>
                <Link href={'/journey/' + plan.journey_id} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  Open report <ArrowRight aria-hidden="true" className="h-4 w-4"/>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
