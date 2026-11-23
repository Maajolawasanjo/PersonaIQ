'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, FileText } from 'lucide-react';
import { plansApi } from '@/lib/api/services';
import type { SavedPlanSummary } from '@/lib/api/types';
import { WorkspaceEmpty, WorkspaceError, WorkspaceLoading } from '@/components/dashboard/WorkspaceFeedback';
import { displayJourneyStatus, formatWorkspaceDate } from '@/lib/workspace/journeys';

type PlansState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; plans: SavedPlanSummary[] };

export default function SavedPlansPage() {
  const [state, setState] = useState<PlansState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void plansApi.listPlans()
      .then(plans => { if (active) setState({ status: 'ready', plans }); })
      .catch(() => { if (active) setState({ status: 'error' }); });
    return () => { active = false; };
  }, [retry]);

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">Your records</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">Saved plans</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
            Open reports actually saved to your account. Unverified historical ratings are not displayed.
          </p>
        </div>
        <Link href="/journey/start" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white">
          New preparation <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      {state.status === 'loading' ? <WorkspaceLoading label="Loading saved plans" /> :
        state.status === 'error' ? <WorkspaceError title="Saved plans are unavailable"
          onRetry={() => { setState({ status: 'loading' }); setRetry(x => x + 1); }} /> :
        state.plans.length === 0 ? (
          <WorkspaceEmpty title="No saved reports yet"
            description="Your saved preparation reports will appear when a report is actually available. You can still organize outfits in your wardrobe."
            href="/wardrobe" action="Open my wardrobe"
            icon={<ClipboardList aria-hidden="true" className="h-6 w-6" />} />
        ) : (
          <ul className="space-y-3">
            {state.plans.map(plan => (
              <li key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">{formatWorkspaceDate(plan.created_at)}</p>
                    <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-950">
                      <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-red-700" />
                      <span className="truncate">{plan.journey_title || 'Saved preparation'}</span>
                    </h2>
                    <p className="mt-2 text-xs text-gray-600">
                      {displayJourneyStatus(plan.journey_status)} · Historical report
                    </p>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
                      Review this saved record. Historical scores and generated descriptions may predate provider verification.
                    </p>
                  </div>
                  <Link href={'/journey/' + plan.journey_id}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                    Open record <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
    </main>
  );
}
