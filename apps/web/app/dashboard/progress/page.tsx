'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, ClipboardCheck, Clock3 } from 'lucide-react';
import { dashboardApi } from '@/lib/api/services';
import type { DashboardOverview } from '@/lib/api/types';
import { WorkspaceEmpty, WorkspaceError, WorkspaceLoading } from '@/components/dashboard/WorkspaceFeedback';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; overview: DashboardOverview };

export default function ProgressPage() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void dashboardApi.getOverview()
      .then(data => { if (active) setState({ status: 'ready', overview: data }); })
      .catch(() => { if (active) setState({ status: 'error' }); });
    return () => { active = false; };
  }, [retry]);

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">Your records</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">Progress</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
            A simple view of the preparations you have saved, without estimated appearance ratings or unverified improvement claims.
          </p>
        </div>
        <Link href="/dashboard/history" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800">
          View activity <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      {state.status === 'loading' ? <WorkspaceLoading label="Loading your progress" /> :
        state.status === 'error' ? <WorkspaceError
          title="Progress could not be loaded"
          onRetry={() => { setState({ status: 'loading' }); setRetry(x => x + 1); }} /> :
        state.overview.total_journeys_count === 0 ? (
          <WorkspaceEmpty title="Your progress begins with your first preparation"
            description="Create a saved journey for an upcoming occasion. Real activity counts will appear after your first saved preparation."
            href="/journey/start" action="Start a preparation"
            icon={<BarChart3 aria-hidden="true" className="h-6 w-6" />} />
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-3" aria-label="Saved journey counts">
              {[
                { label: 'Total saved journeys', value: state.overview.total_journeys_count ?? 0, detail: 'Includes archived preparations', Icon: BarChart3 },
                { label: 'Completed journeys', value: state.overview.completed_journeys_count ?? 0, detail: 'Completion recorded by your account', Icon: ClipboardCheck },
                { label: 'Current preparation', value: state.overview.active_journey ? 1 : 0, detail: 'Most recent active draft', Icon: Clock3 },
              ].map(metric => (
                <div key={metric.label} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <metric.Icon aria-hidden="true" className="h-5 w-5 text-red-700" />
                  <p className="mt-4 text-sm font-semibold text-gray-700">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-gray-950">{metric.value}</p>
                  <p className="mt-1.5 text-xs leading-5 text-gray-500">{metric.detail}</p>
                </div>
              ))}
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-950">About your progress</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                These counts are based on saved records. Personal presence scores, confidence ratings,
                appearance diagnostics and percentage improvements are not currently verified and
                are deliberately not presented as measured results.
              </p>
              <Link href="/dashboard/history" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-700">
                Review your saved journeys <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </>
        )}
    </main>
  );
}
