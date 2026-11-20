'use client';

import React from 'react';
import Link from 'next/link';
import { dashboardApi, presenceDnaApi } from '@/lib/api/services';

type Metric = { label: string; value: string; description: string };

export default function PersonalProgressPage() {
  const [metrics, setMetrics] = React.useState<Metric[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function loadProgress() {
      try {
        const [overview, dna] = await Promise.all([
          dashboardApi.getOverview(),
          presenceDnaApi.getDna().catch(() => null),
        ]);
        if (!active) return;
        const completed = overview.completed_journeys_count ?? 0;
        const average = overview.presence_index_avg ?? null;
        const topStyle = typeof dna?.top_style === 'string' ? dna.top_style : null;
        setMetrics([
          { label: 'Completed Journeys', value: String(completed), description: 'Saved assessments' },
          { label: 'Average Presence Index', value: completed > 0 && typeof average === 'number' && Number.isFinite(average) ? String(Math.round(average)) : '—', description: 'Only measured results' },
          { label: 'Most Used Outfit Style', value: completed > 0 && topStyle ? topStyle : '—', description: 'From available wardrobe data' },
        ]);
      } catch {
        if (active) setError('Progress could not be loaded. Please retry when the service is available.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadProgress();
    return () => { active = false; };
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-2">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">My Presence</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Personal Progress</h1>
          <p className="mt-2 text-sm text-gray-600">Understand your progress using actual saved assessments.</p>
        </div>
        <Link href="/journey/start" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Start a Journey</Link>
      </div>

      {loading ? (
        <div role="status" className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Loading your progress...</div>
      ) : error ? (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-500">{m.label}</p>
                <p className="mt-3 text-3xl font-bold text-gray-950">{m.value}</p>
                <p className="mt-2 text-xs text-gray-500">{m.description}</p>
              </div>
            ))}
          </div>
          {metrics[0]?.value === '0' && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-950">Your progress starts with your first journey</h2>
              <p className="mt-2 text-sm text-gray-600">Complete a preparation assessment to begin building your history.</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
