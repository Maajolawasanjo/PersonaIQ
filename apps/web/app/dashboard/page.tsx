'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CalendarDays, ClipboardList, Clock3, Layers3,
  Plus, Shirt, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { dashboardApi } from '@/lib/api/services';
import type { DashboardOverview } from '@/lib/api/types';
import { WorkspaceEmpty, WorkspaceError, WorkspaceLoading } from '@/components/dashboard/WorkspaceFeedback';
import { displayJourneyStatus, formatWorkspaceDate } from '@/lib/workspace/journeys';

type OverviewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; overview: DashboardOverview };

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [state, setState] = useState<OverviewState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void dashboardApi.getOverview()
      .then(overview => {
        if (active) setState({ status: 'ready', overview });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });
    return () => { active = false; };
  }, [retry]);

  const greeting = user?.first_name?.trim() || 'Welcome';

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">Your workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {greeting === 'Welcome' ? 'Welcome to PersonaIQ' : 'Welcome back, ' + greeting}
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Plan your next outfit, organize your wardrobe and pick up where you left off.
          </p>
        </div>
        <Link href="/journey/start" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800">
          <Plus aria-hidden="true" className="h-4 w-4" /> New preparation
        </Link>
      </header>

      {state.status === 'loading' ? <WorkspaceLoading label="Loading dashboard" /> :
        state.status === 'error' ? (
          <WorkspaceError title="Your dashboard is temporarily unavailable"
            description="We couldn't load your saved activity. Your records have not been replaced with example information."
            onRetry={() => { setState({ status: 'loading' }); setRetry(n => n + 1); }} />
        ) : (
          <>
            {state.overview.active_journey ? (
              <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-xl">
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-red-700">
                      <Clock3 aria-hidden="true" className="h-4 w-4" /> Continue your preparation
                    </p>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                      {state.overview.active_journey.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      Review this saved journey and continue from its available steps. Nothing new is created until you choose to start another preparation.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                    {displayJourneyStatus(state.overview.active_journey.status)}
                  </span>
                </div>
                <Link href={'/journey/' + state.overview.active_journey.id}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-red-800">
                  Open saved journey <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </section>
            ) : state.overview.total_journeys_count === 0 ? (
              <WorkspaceEmpty title="Let's prepare your first look"
                description="Start with an occasion, explore outfit options and save a preparation that you can return to later."
                href="/journey/start" action="Start my first preparation"
                icon={<CalendarDays aria-hidden="true" className="h-6 w-6" />} />
            ) : (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-red-700">Next up</p>
                <h2 className="mt-3 text-xl font-bold text-gray-950">Preparing for another occasion?</h2>
                <p className="mt-2 text-sm text-gray-600">Your earlier journeys remain available in Activity.</p>
                <Link href="/journey/start" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-700">
                  Start a new preparation <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </section>
            )}

            <section aria-label="Your saved activity numbers" className="grid gap-3 sm:grid-cols-3">
              {[
                { title: 'Total preparations', count: state.overview.total_journeys_count ?? 0, detail: 'Including drafts and archived journeys' },
                { title: 'Completed journeys', count: state.overview.completed_journeys_count ?? 0, detail: 'Recorded as complete in your account' },
                { title: 'Open preparation', count: state.overview.active_journey ? 1 : 0, detail: 'Most recently active saved journey' },
              ].map(stat => (
                <div key={stat.title} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                  <p className="text-xs font-semibold text-gray-600">{stat.title}</p>
                  <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-gray-950">{stat.count}</p>
                  <p className="mt-1.5 text-xs leading-5 text-gray-500">{stat.detail}</p>
                </div>
              ))}
            </section>

            <section className="space-y-4" aria-labelledby="workspace-actions">
              <div className="flex items-center justify-between gap-4">
                <h2 id="workspace-actions" className="text-lg font-bold text-gray-950">Your tools</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { href: '/wardrobe', title: 'My Wardrobe', description: 'Add and organize the clothes you own.', Icon: Shirt },
                  { href: '/wardrobe/style-me', title: 'Outfit ideas', description: 'Explore outfit planning tools. AI features depend on provider availability.', Icon: Sparkles },
                ].map(({ href, title, description, Icon }) => (
                  <Link key={href} href={href} className="group flex min-h-32 items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-red-200 hover:bg-red-50/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-gray-950">{title}</span>
                      <span className="mt-1 block text-sm leading-6 text-gray-600">{description}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-red-700 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
                    <ClipboardList aria-hidden="true" className="h-5 w-5 text-red-700" /> Recent activity
                  </h2>
                  <Link href="/dashboard/history" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-red-700">
                    View all <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
                {!state.overview.recent_journeys?.length ? (
                  <p className="mt-5 text-sm leading-6 text-gray-600">No saved journeys yet. Your recent activity will appear here.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100">
                    {state.overview.recent_journeys.map(journey => (
                      <li key={journey.id}>
                        <Link href={'/journey/' + journey.id} className="flex min-h-18 items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-gray-50">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-gray-950">{journey.title}</span>
                            <span className="mt-1 block text-xs text-gray-500">
                              {formatWorkspaceDate(journey.updated_at)} · {displayJourneyStatus(journey.status)}
                            </span>
                          </span>
                          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
                  <Layers3 aria-hidden="true" className="h-5 w-5 text-red-700" /> Saved plans
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {state.overview.recent_plans?.length
                    ? 'Revisit the reports associated with your saved event preparations.'
                    : 'Completed, saved reports will appear here when they are available. No estimated scores are displayed.'}
                </p>
                <Link href="/dashboard/plans" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-700">
                  Open saved plans <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </>
        )}
    </div>
  );
}
