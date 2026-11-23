'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardList, AlertCircle, FileText } from 'lucide-react';
import { journeyApi, presenceApi } from '@/lib/api/services';
import type { Journey, PresencePlan } from '@/lib/api/types';

type CompletionState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'incomplete'; journey: Journey }
  | { status: 'complete'; journey: Journey; plan: PresencePlan };

export default function JourneyCompletePage() {
  const [result, setResult] = useState<CompletionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    async function load() {
      const journeyId = localStorage.getItem('personaiq_active_journey_id');
      if (!journeyId) {
        if (active) setResult({ status: 'missing' });
        return;
      }

      try {
        const journey = await journeyApi.getJourney(journeyId);
        if (journey.status !== 'COMPLETED') {
          if (active) setResult({ status: 'incomplete', journey });
          return;
        }

        const plan = await presenceApi.getPresencePlan(journeyId);
        if (!plan || plan.journey_id !== journeyId) {
          throw new Error('Report does not match this journey.');
        }

        if (active) {
          localStorage.removeItem('personaiq_active_draft_step');
          setResult({ status: 'complete', journey, plan });
        }
      } catch (error) {
        console.error('Could not verify journey completion:', error);
        if (active) setResult({ status: 'error' });
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  if (result.status === 'loading') {
    return <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">Verifying your saved preparation...</div>;
  }

  if (result.status === 'missing' || result.status === 'error') {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center sm:p-10">
        <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-950">{result.status === 'missing' ? 'No active journey found' : 'Unable to verify completion'}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {result.status === 'missing'
            ? 'Choose a saved journey or start a new preparation to continue.'
            : 'We could not load a verified report. Your journey has not been marked complete on this screen.'}
        </p>
        <Link href="/dashboard/history" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">View your journeys <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  if (result.status === 'incomplete') {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center sm:p-10">
        <ClipboardList className="mx-auto h-10 w-10 text-red-700" />
        <h1 className="mt-4 text-2xl font-bold text-gray-950">Your preparation is not finished yet</h1>
        <p className="mt-3 text-sm text-gray-600">Your journey is saved as {result.journey.status.toLowerCase()}. The completion page will only show results after the backend has produced a report.</p>
        <Link href={`/journey/${result.journey.id}`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">View your journey <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  const { journey, plan } = result;
  const score = plan.overall_presence_index ?? plan.overall_presence_score ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-5">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-red-700">Preparation saved</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Your Presence Plan is ready</h1>
        <p className="mt-3 text-sm text-gray-600">Your report for <strong>{journey.event?.name ?? journey.title}</strong> is now available in your account.</p>
        {typeof score === 'number' && (
          <div className="mx-auto mt-6 w-fit rounded-2xl border border-gray-200 bg-gray-50 px-8 py-5">
            <p className="text-xs font-medium text-gray-500">Presence Index</p>
            <p className="mt-1 text-4xl font-bold text-gray-950">{score}</p>
          </div>
        )}
        {plan.summary_narrative && <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-600">{plan.summary_narrative}</p>}
        <Link href={`/journey/${journey.id}`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
          <FileText className="h-4 w-4" /> View saved report
        </Link>
      </section>
      {plan.recommendations?.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-950">Recommended next steps</h2>
          <ul className="mt-4 space-y-3">
            {plan.recommendations.slice(0, 3).map((recommendation) => (
              <li key={recommendation.id} className="rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-950">{recommendation.title}</h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">{recommendation.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <nav className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800">Back to Dashboard</Link>
        <Link href="/journey/start" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800">Prepare another event</Link>
      </nav>
    </div>
  );
}
