'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Archive, Search, History } from 'lucide-react';
import { journeyApi } from '@/lib/api/services';
import type { Journey } from '@/lib/api/types';

type StatusFilter = 'ALL' | 'DRAFT' | 'COMPLETED' | 'ARCHIVED';

export default function JourneyArchivePage() {
  const [journeys, setJourneys] = React.useState<Journey[]>([]);
  const [filter, setFilter] = React.useState<StatusFilter>('ALL');
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [archivingId, setArchivingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function load() {
      try {
        const items = await journeyApi.listJourneys(1, 50);
        if (active) setJourneys(items);
      } catch {
        if (active) setError('Your saved journeys could not be loaded. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  const archive = async (id: string) => {
    if (archivingId) return;
    setError(null);
    setArchivingId(id);
    try {
      const saved = await journeyApi.archiveJourney(id);
      setJourneys(previous => previous.map(j => j.id === id ? { ...j, status: saved.status } : j));
    } catch {
      setError('This journey could not be archived. No change was made.');
    } finally {
      setArchivingId(null);
    }
  };

  const visible = journeys.filter(j => {
    const label = [j.title, j.event?.event_type ?? '', j.status].join(' ').toLowerCase();
    return (filter === 'ALL' || j.status === filter) && label.includes(search.trim().toLowerCase());
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-2">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">My Activity</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Journey History</h1>
          <p className="mt-2 text-sm text-gray-600">Your saved preparations, drafts, and completed journeys.</p>
        </div>
        <Link href="/journey/start" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">New journey <ArrowRight className="h-4 w-4" /></Link>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <p role="status" className="text-sm text-gray-600">Loading history...</p> : journeys.length === 0 && !error ? (
        <section className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <History className="mx-auto h-9 w-9 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-950">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">Start a Presence Journey to create your first saved preparation.</p>
          <Link href="/journey/start" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-700">Start a journey <ArrowRight className="h-4 w-4"/></Link>
        </section>
      ) : !loading && journeys.length > 0 ? (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
              <Search className="h-4 w-4 text-gray-500"/>
              <span className="sr-only">Search journey history</span>
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search journeys..." className="w-full bg-transparent text-sm text-gray-900 outline-none"/>
            </label>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'DRAFT', 'COMPLETED', 'ARCHIVED'] as const).map(status => (
                <button type="button" key={status} onClick={() => setFilter(status)}
                  aria-pressed={filter === status}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold ${filter === status ? 'bg-gray-950 border-gray-950 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">No journeys match those filters.</p>
          ) : (
            <ul className="space-y-3">
              {visible.map(journey => (
                <li key={journey.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">{new Date(journey.created_at).toLocaleDateString()}</p>
                      <h2 className="mt-1 text-lg font-semibold text-gray-950">{journey.title}</h2>
                      <span className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{journey.status}</span>
                    </div>
                    {typeof journey.presence_score === 'number' && journey.status === 'COMPLETED' && (
                      <p className="text-xl font-bold text-gray-950">{journey.presence_score}<span className="ml-1 text-xs font-normal text-gray-500">Presence Index</span></p>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link href={`/journey/${journey.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                      Open journey <ArrowRight className="h-4 w-4"/>
                    </Link>
                    {journey.status !== 'ARCHIVED' && (
                      <button type="button" disabled={archivingId === journey.id} onClick={() => archive(journey.id)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50">
                        <Archive className="h-4 w-4"/>{archivingId === journey.id ? 'Archiving...' : 'Archive'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
