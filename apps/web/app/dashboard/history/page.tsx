'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Archive, ArrowLeft, ArrowRight, CalendarDays, ChevronLeft,
  ChevronRight, History, Search,
} from 'lucide-react';
import { journeyApi } from '@/lib/api/services';
import type { Journey, PaginationMeta } from '@/lib/api/types';
import { WorkspaceEmpty, WorkspaceError, WorkspaceLoading } from '@/components/dashboard/WorkspaceFeedback';
import { displayJourneyStatus, formatWorkspaceDate } from '@/lib/workspace/journeys';

const PAGE_SIZE = 12;
type StatusFilter = 'ALL' | 'DRAFT' | 'IN_PROGRESS' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
type PageState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; journeys: Journey[]; pagination: PaginationMeta };
const filters: StatusFilter[] = ['ALL', 'DRAFT', 'IN_PROGRESS', 'ANALYZING', 'COMPLETED', 'FAILED', 'ARCHIVED'];

export default function JourneyHistoryPage() {
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [archiving, setArchiving] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    void journeyApi.getJourneyPage(page, PAGE_SIZE, filter)
      .then(({ items, pagination }) => {
        if (!active) return;
        if (page > 1 && pagination.total_pages > 0 && page > pagination.total_pages) {
          setPage(pagination.total_pages);
          return;
        }
        setState({ status: 'ready', journeys: items, pagination });
      })
      .catch(() => { if (active) setState({ status: 'error' }); });
    return () => { active = false; };
  }, [page, filter, reload]);

  const visible = useMemo(() => {
    if (state.status !== 'ready') return [];
    const query = search.trim().toLowerCase();
    return query
      ? state.journeys.filter(journey =>
          [journey.title, journey.event?.name || '', journey.event?.dress_code || '', journey.status]
            .join(' ').toLowerCase().includes(query)
        )
      : state.journeys;
  }, [search, state]);

  const changeFilter = (next: StatusFilter) => {
    if (next === filter) return;
    setState({ status: 'loading' });
    setFilter(next);
    setPage(1);
    setSearch('');
    setNotice('');
  };

  const archive = async (journeyId: string) => {
    if (archiving) return;
    setArchiving(journeyId);
    setNotice('');
    try {
      const saved = await journeyApi.archiveJourney(journeyId);
      if (saved.status !== 'ARCHIVED') throw new Error('Archive was not confirmed.');
      setNotice('Journey archived. Your activity list has been refreshed.');
      setReload(value => value + 1);
    } catch {
      setNotice('The journey could not be archived. It has not been changed.');
    } finally {
      setArchiving(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">Your records</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">Activity</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Find your saved preparations, including drafts, completed journeys and archived work.
          </p>
        </div>
        <Link href="/journey/start" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white">
          New preparation <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      <section aria-label="Filter activity" className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {filters.map(option => (
            <button key={option} type="button" aria-pressed={filter === option}
              onClick={() => changeFilter(option)}
              className={'min-h-10 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ' +
                (filter === option ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400')}>
              {option === 'ALL' ? 'All' : displayJourneyStatus(option)}
            </button>
          ))}
        </div>
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-200 px-4">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-500" />
          <span className="sr-only">Search journeys on the current page</span>
          <input type="search" value={search} onChange={event => setSearch(event.target.value)}
            placeholder="Search this page" className="min-w-0 w-full bg-transparent text-sm text-gray-950 outline-none" />
        </label>
        <p className="text-xs text-gray-500">
          Filters use your saved account records. Search only checks the journeys on the current page.
        </p>
      </section>

      {notice && (
        <p role="status" className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          {notice}
        </p>
      )}

      {state.status === 'loading' ? <WorkspaceLoading label="Loading saved activity" /> :
        state.status === 'error' ? <WorkspaceError
          title="Activity is unavailable"
          description="We couldn't load this page of your saved journeys. Your records remain unchanged."
          onRetry={() => { setState({ status: 'loading' }); setReload(n => n + 1); }} /> :
        state.pagination.total_items === 0 && filter === 'ALL' ? (
          <WorkspaceEmpty title="No journeys saved yet"
            description="Your saved activity will appear here once you begin an event preparation."
            href="/journey/start" action="Start your first preparation"
            icon={<History aria-hidden="true" className="h-6 w-6" />} />
        ) : state.pagination.total_items === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-7 sm:p-9">
            <h2 className="text-lg font-semibold text-gray-950">No {displayJourneyStatus(filter).toLowerCase()} journeys</h2>
            <p className="mt-2 text-sm text-gray-600">Try another status to find your saved activity.</p>
          </section>
        ) : (
          <section className="space-y-4" aria-label="Journey results">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-950">Saved journeys</h2>
              <p className="text-xs tabular-nums text-gray-500">
                {Math.min((page - 1) * PAGE_SIZE + 1, state.pagination.total_items)}
                {'–'}
                {Math.min(page * PAGE_SIZE, state.pagination.total_items)}
                {' of '}
                {state.pagination.total_items}
              </p>
            </div>
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-7">
                <p className="text-sm text-gray-600">No results on this page match your search.</p>
                <button type="button" onClick={() => setSearch('')} className="mt-4 min-h-11 text-sm font-semibold text-red-700">Clear search</button>
              </div>
            ) : (
              <ul className="grid gap-3">
                {visible.map(journey => (
                  <li key={journey.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="inline-flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                          {formatWorkspaceDate(journey.updated_at)}
                        </p>
                        <h3 className="mt-2 break-words text-lg font-semibold text-gray-950">{journey.title}</h3>
                        {journey.event?.dress_code && <p className="mt-1 text-xs text-gray-600">Dress code: {journey.event.dress_code}</p>}
                      </div>
                      <span className={'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ' +
                        (journey.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800' :
                          journey.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600' :
                            'bg-amber-50 text-amber-900')}>
                        {displayJourneyStatus(journey.status)}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link href={'/journey/' + journey.id}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white">
                        Open details <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                      {journey.status !== 'ARCHIVED' && (
                        <button type="button" disabled={Boolean(archiving)}
                          onClick={() => { void archive(journey.id); }}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                          <Archive aria-hidden="true" className="h-4 w-4" />
                          {archiving === journey.id ? 'Archiving…' : 'Archive'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <nav aria-label="Activity pages" className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-3 sm:px-5">
              <button type="button" disabled={page <= 1 || Boolean(archiving)}
                onClick={() => { setSearch(''); setState({ status: 'loading' }); setPage(x => Math.max(1, x - 1)); }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft aria-hidden="true" className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs font-medium tabular-nums text-gray-600">
                Page {page} of {Math.max(1, state.pagination.total_pages)}
              </span>
              <button type="button" disabled={page >= state.pagination.total_pages || Boolean(archiving)}
                onClick={() => { setSearch(''); setState({ status: 'loading' }); setPage(x => x + 1); }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
                Next <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </nav>
          </section>
        )}
      <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to overview
      </Link>
    </div>
  );
}
