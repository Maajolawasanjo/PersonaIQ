'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, FileText, AlertCircle } from 'lucide-react';
import { journeyApi, presenceApi } from '@/lib/api/services';
import type { Journey, PresencePlan } from '@/lib/api/types';

type JourneyView = { status: 'loading' } | { status: 'error'; message?: string } | { status: 'ready'; journey: Journey; plan: PresencePlan | null };

export default function JourneyDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [view, setView] = useState<JourneyView>({ status: 'loading' });
  const [resumeHref, setResumeHref] = useState('/journey/event-type');

  useEffect(() => {
    if (!id) {
      setView({ status: 'error', message: 'No journey was specified.' });
      return;
    }

    let active = true;
    async function load() {
      try {
        const journey = await journeyApi.getJourney(id);
        let plan: PresencePlan | null = null;
        if (journey.status === 'COMPLETED') {
          plan = await presenceApi.getPresencePlan(id);
        }
        if (!active) return;

        const previousJourneyId = localStorage.getItem('personaiq_active_journey_id');
        const lastStep = localStorage.getItem('personaiq_active_draft_step');
        setResumeHref(previousJourneyId === id && lastStep?.startsWith('/journey/') ? lastStep : '/journey/event-type');
        setView({ status: 'ready', journey, plan });
      } catch (error) {
        console.error('Could not load saved journey:', error);
        if (active) setView({ status: 'error', message: 'This journey or its report could not be loaded. Please try again from your activity.' });
      }
    }
    void load();
    return () => { active = false; };
  }, [id]);

  if (view.status === 'loading') {
    return <div role="status" className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">Loading your saved journey...</div>;
  }
  if (view.status === 'error') {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-950">Journey unavailable</h1>
        <p className="mt-2 text-sm text-gray-600">{view.message}</p>
        <Link href="/dashboard/history" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"><ArrowLeft className="h-4 w-4"/> Back to activity</Link>
      </section>
    );
  }

  const { journey, plan } = view;
  const score = plan?.overall_presence_index ?? journey.active_presence_index ?? null;
  const eventName = journey.event?.name ?? journey.title;
  const complete = journey.status === 'COMPLETED' && plan !== null;
  const dateLabel = journey.event?.event_date || null;

  return (
    <main className="mx-auto max-w-5xl space-y-6 py-4">
      <Link href="/dashboard/history" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950"><ArrowLeft className="h-4 w-4"/> Back to activity</Link>
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-700">Presence Journey</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">{eventName}</h1>
            <p className="mt-2 text-sm text-gray-600">Created {new Date(journey.created_at).toLocaleDateString()}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700">{journey.status}</span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Dress code</p>
            <p className="mt-1 font-semibold text-gray-900">{journey.event?.dress_code || 'Not yet selected'}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="flex items-center gap-1 text-xs text-gray-500"><CalendarDays className="h-3.5 w-3.5" /> Event date</p>
            <p className="mt-1 font-semibold text-gray-900">{dateLabel || 'Not provided'}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Presence Index</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{typeof score === 'number' && complete ? score : '—'}</p>
          </div>
        </div>
        {!complete && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="flex items-center gap-2 font-semibold text-amber-950"><ClipboardList className="h-5 w-5"/> This journey is not complete</h2>
            <p className="mt-2 text-sm text-amber-900">A verified Presence Plan has not been saved for this journey. No assessment scores are being estimated.</p>
            <Link href={resumeHref} onClick={() => localStorage.setItem('personaiq_active_journey_id', id)}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
              Continue preparation <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
        )}
      </section>

      {complete && plan && (
        <>
          <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-950"><CheckCircle2 className="h-6 w-6 text-emerald-600"/> Saved Presence Plan</h2>
            <p className="mt-4 text-sm leading-7 text-gray-700">{plan.summary_narrative || 'The assessment report was saved successfully.'}</p>
            <p className="mt-3 text-xs text-gray-500">Completed {new Date(plan.created_at).toLocaleDateString()}</p>
          </section>
          {plan.recommendations?.length > 0 && (
            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-950">Recommendations</h2>
              <ul className="mt-4 space-y-3">
                {plan.recommendations.map((rec) => (
                  <li key={rec.id} className="rounded-xl bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-950">{rec.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{rec.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {plan.checklist?.length > 0 && (
            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950"><ClipboardList className="h-5 w-5 text-red-700"/> Preparation checklist</h2>
              <ul className="mt-4 space-y-3">
                {plan.checklist.map((item) => <li key={item.id} className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700">{item.task}</li>)}
              </ul>
            </section>
          )}
        </>
      )}
      <nav className="flex flex-wrap gap-3">
        <Link href="/dashboard/history" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800"><FileText className="h-4 w-4"/> All journeys</Link>
        <Link href="/journey/start" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800">Prepare another event <ArrowRight className="h-4 w-4"/></Link>
      </nav>
    </main>
  );
}
