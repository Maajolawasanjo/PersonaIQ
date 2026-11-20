'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, History, Shirt, Sparkles, ScanFace } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { dashboardApi } from '@/lib/api/services';
import type { DashboardOverview } from '@/lib/api/types';

type LoadState = 'loading' | 'ready' | 'error';

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [resumeHref, setResumeHref] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await dashboardApi.getOverview();
        if (!mounted) return;
        setOverview(response);
        setState('ready');
        if (response.active_journey) {
          const activeId = localStorage.getItem('personaiq_active_journey_id');
          const savedStep = localStorage.getItem('personaiq_active_draft_step');
          setResumeHref(activeId === response.active_journey.id && savedStep?.startsWith('/journey/')
            ? savedStep : `/journey/${response.active_journey.id}`);
        }
      } catch {
        if (mounted) setState('error');
      }
    };
    void load();
    return () => { mounted = false; };
  }, []);

  const name = user?.first_name || user?.full_name || 'there';
  const completed = overview?.completed_journeys_count ?? 0;
  const total = overview?.total_journeys_count ?? 0;
  const average = completed > 0 && typeof overview?.presence_index_avg === 'number'
    && Number.isFinite(overview.presence_index_avg) ? Math.round(overview.presence_index_avg) : null;
  const plans = overview?.recent_plans ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">PERSONAIQ Workspace</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">Welcome, {name}.</h1>
          <p className="text-sm sm:text-base text-gray-600">Get ready for your next important moment.</p>
        </div>
        <Link href="/journey/start" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
          <Sparkles className="h-4 w-4" /> Start a Journey
        </Link>
      </div>

      {state === 'loading' && (
        <div role="status" className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">
          Loading your workspace...
        </div>
      )}

      {state === 'error' && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Your workspace could not be loaded</h2>
          <p className="mt-2 text-sm text-red-800">We could not reach your saved data. Please refresh or try again. No sample scores are being shown.</p>
        </div>
      )}

      {state === 'ready' && overview && (
        <>
          {overview.active_journey ? (
            <section className="rounded-3xl border border-red-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-700">In progress</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950">{overview.active_journey.title}</h2>
                  <p className="text-sm text-gray-600">You have an unfinished preparation. Continue from where you stopped.</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                  {overview.active_journey.status}
                </span>
              </div>
              <Link href={resumeHref ?? `/journey/${overview.active_journey.id}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                Continue preparation <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ) : total === 0 ? (
            <section className="rounded-3xl border border-gray-200 bg-white px-6 py-10 sm:px-10 shadow-sm">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <ScanFace className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-950">Your first look starts here</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">Choose an upcoming occasion, explore suitable outfits, and receive practical preparation advice. You can save your work as you go.</p>
              <Link href="/journey/start" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                Begin your first journey <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ) : (
            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950">Ready for another occasion?</h2>
              <p className="mt-2 text-sm text-gray-600">Start a new preparation or revisit previous work.</p>
              <Link href="/journey/start" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                Create a new journey <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          )}

          <section aria-labelledby="quick-actions-heading" className="space-y-4">
            <h2 id="quick-actions-heading" className="text-lg font-bold text-gray-950">What would you like to do?</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: 'My Presence', description: 'Prepare and review personal assessments.', href: '/journey/start', Icon: ScanFace },
                { title: 'My Wardrobe', description: 'Organize and explore your saved clothing.', href: '/wardrobe', Icon: Shirt },
                { title: 'AI Stylist', description: 'Discover outfit combinations for your occasion.', href: '/wardrobe/style-me', Icon: Sparkles },
              ].map(({ title, description, href, Icon }) => (
                <Link key={href} href={href} className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-red-300 hover:shadow-sm">
                  <Icon className="h-6 w-6 text-red-700" />
                  <h3 className="mt-4 font-semibold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-5 text-gray-600">{description}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-red-700 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
                <ClipboardCheck className="h-5 w-5 text-red-700" /> Your progress
              </h2>
              {completed > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-950">{completed}</p>
                    <p className="mt-1 text-xs text-gray-600">Completed journeys</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-950">{average ?? '—'}</p>
                    <p className="mt-1 text-xs text-gray-600">Average Presence Index</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-600">No completed assessments yet. Real progress metrics will appear after your first completed journey.</p>
              )}
              <Link href="/dashboard/progress" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-700">View progress <ArrowRight className="h-4 w-4"/></Link>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
                <History className="h-5 w-5 text-red-700" /> Recent plans
              </h2>
              {plans.length ? (
                <ul className="mt-4 space-y-3">
                  {plans.slice(0, 3).map((plan) => (
                    <li key={plan.id}>
                      <Link href={`/journey/${plan.journey_id}`} className="block rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800 hover:bg-red-50">
                        <span className="block font-semibold">{plan.executive_summary?.slice(0, 70) || 'Saved preparation plan'}</span>
                        <span className="mt-1 block text-xs text-gray-500">{new Date(plan.created_at).toLocaleDateString()}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm text-gray-600">Saved Presence Plans will appear here after a successful assessment.</p>}
              <Link href="/dashboard/history" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-700">View activity <ArrowRight className="h-4 w-4"/></Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
