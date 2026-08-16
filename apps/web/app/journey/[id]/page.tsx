'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Award,
  Clock,
  Target,
  Check,
  Sparkles,
  FileText,
  CheckSquare,
  Download,
  Share2,
  Zap,
  HelpCircle,
  Shirt,
  ArrowLeft,
  Trash2,
  Copy,
  UserCheck,
  Calendar,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { journeyApi } from '@/lib/api/services';
import { Journey } from '@/lib/api/types';

// ─── Skeleton loader ────────────────────────────────────────────────────────
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded-lg ${className ?? ''}`} />;
}

export default function JourneyDetailsHubPage() {
  const params = useParams();
  const journeyId = (params?.id as string) || '';

  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!journeyId) return;

    async function loadJourney() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await journeyApi.getJourney(journeyId);
        setJourney(data);
      } catch (err: any) {
        // Attempt local fallback (saved_journeys in localStorage)
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('personaiq_saved_journeys');
          if (raw) {
            try {
              const local: any[] = JSON.parse(raw);
              const found = local.find((j) => j.id === journeyId);
              if (found) {
                // Map local shape to Journey interface
                setJourney({
                  id: found.id,
                  user_id: '',
                  title: found.title || 'Presence Session',
                  status: found.status || 'COMPLETED',
                  presence_score: found.presence_score,
                  event: found.dress_code
                    ? {
                        id: '',
                        journey_id: found.id,
                        event_type: found.occasion || '',
                        dress_code: found.dress_code || '',
                        target_vibe: found.target_vibe || '',
                        created_at: found.created_at || '',
                      }
                    : undefined,
                  created_at: found.created_at || new Date().toISOString(),
                  updated_at: found.created_at || new Date().toISOString(),
                });
                return;
              }
            } catch {/* ignore */}
          }
        }
        setError(err?.message || 'Failed to load journey details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadJourney();
  }, [journeyId]);

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-4 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-5">
          <SkeletonBlock className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          <SkeletonBlock className="sm:col-span-4 h-36 rounded-[20px]" />
          <SkeletonBlock className="sm:col-span-8 h-36 rounded-[20px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <SkeletonBlock className="lg:col-span-7 h-64 rounded-[20px]" />
          <SkeletonBlock className="lg:col-span-5 h-64 rounded-[20px]" />
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-4">
        <div className="bg-white border border-red-200 rounded-[24px] p-10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-[22px] font-bold text-gray-950">Journey Not Found</h2>
          <p className="text-[14px] text-gray-600 max-w-sm mx-auto">{error}</p>
          <Link
            href="/dashboard/history"
            className="inline-flex items-center space-x-2 h-10 px-6 bg-gray-950 text-white font-bold text-[13px] rounded-[10px] hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!journey) return null;

  const score = journey.presence_score ?? 0;
  const eventType = journey.event?.event_type || 'Presence Session';
  const dressCode = journey.event?.dress_code || 'Professional';
  const targetVibe = journey.event?.target_vibe || '—';
  const eventDate = journey.created_at
    ? new Date(journey.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-4 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard/history"
            className="text-[12px] font-mono font-bold text-gray-500 hover:text-gray-900 inline-flex items-center space-x-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journey Archive</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-red-650 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 uppercase">
              JOURNEY DETAILS HUB #{journeyId.slice(0, 8).toUpperCase()}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                journey.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : journey.status === 'ANALYZING'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {journey.status}
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-950 font-sans leading-tight">
            {journey.title}
          </h1>
          <p className="text-[13.5px] text-gray-500 font-medium">
            Evaluated on {eventDate} · {eventType}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/journey/export"
            className="h-10 px-4 bg-gray-950 hover:bg-gray-800 text-white font-bold text-[12.5px] rounded-[10px] flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </Link>
          <Link
            href="/journey/share"
            className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-[12.5px] rounded-[10px] border border-gray-250 flex items-center space-x-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
            <span>Share</span>
          </Link>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">

        {/* Presence Index Badge */}
        <div className="sm:col-span-4 bg-gray-950 text-white rounded-[20px] p-6 shadow-md flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
            OVERALL PRESENCE INDEX™
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-[52px] font-black text-white font-sans leading-none">
              {score > 0 ? score : '—'}
            </span>
            <span className="text-[16px] font-mono text-gray-400">/ 100</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11.5px] font-mono text-gray-300">
            <span>Executive Vibe: {journey.executive_vibe_score ?? '—'}</span>
            <span>Visual Impact: {journey.visual_impact_score ?? '—'}</span>
          </div>
        </div>

        {/* Event Context Info */}
        <div className="sm:col-span-8 bg-gray-50 border border-gray-200 rounded-[20px] p-6 space-y-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            EVENT CONTEXT & AUDIENCE PROFILE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>EVENT TYPE</span>
              </span>
              <span className="text-[14px] font-bold text-gray-950 font-sans block">
                {eventType || '—'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-gray-400" />
                <span>TARGET VIBE</span>
              </span>
              <span className="text-[14px] font-bold text-gray-950 font-sans block">
                {targetVibe}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>DRESS CODE</span>
              </span>
              <span className="text-[14px] font-bold text-gray-950 font-sans block">
                {dressCode}
              </span>
            </div>
          </div>

          {journey.event?.location && (
            <p className="text-[12.5px] text-gray-600 font-normal border-t border-gray-200/80 pt-3">
              📍 {journey.event.location}
              {journey.event.event_date && ` · ${new Date(journey.event.event_date).toLocaleDateString()}`}
            </p>
          )}
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

        {/* Left Column: Sub-scores */}
        <div className="lg:col-span-7 space-y-6">

          {/* Score Breakdown */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
              SCORE BREAKDOWN
            </span>

            <div className="space-y-3">
              {[
                { label: 'Executive Vibe', value: journey.executive_vibe_score, color: 'bg-red-600' },
                { label: 'Visual Impact', value: journey.visual_impact_score, color: 'bg-purple-600' },
                { label: 'Outfit Alignment', value: journey.outfit_alignment_score, color: 'bg-blue-600' },
                { label: 'Grooming Score', value: journey.grooming_score, color: 'bg-emerald-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-bold text-gray-950 font-mono">
                      {value != null ? `${value}/100` : '—'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all`}
                      style={{ width: value != null ? `${value}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Metadata */}
          <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-600 bg-white px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
              JOURNEY METADATA
            </span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-[12px] border border-gray-200">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">Created</span>
                <span className="text-[13px] font-bold text-gray-950 font-sans">
                  {new Date(journey.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-white p-3 rounded-[12px] border border-gray-200">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">Status</span>
                <span className="text-[13px] font-bold text-gray-950 font-sans">{journey.status}</span>
              </div>
              <div className="bg-white p-3 rounded-[12px] border border-gray-200">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">Journey ID</span>
                <span className="text-[11px] font-mono font-bold text-gray-700 truncate block">
                  {journey.id.slice(0, 18)}…
                </span>
              </div>
              <div className="bg-white p-3 rounded-[12px] border border-gray-200">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">Last Updated</span>
                <span className="text-[13px] font-bold text-gray-950 font-sans">
                  {new Date(journey.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Navigation Matrix */}
        <div className="lg:col-span-5 space-y-5">

          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-4">
            <h3 className="text-[18px] font-bold text-gray-950 font-sans border-b border-gray-100 pb-3">
              Journey Navigation Hub
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/journey/presence-plan"
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[12px] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span className="text-[13px] font-bold text-gray-950">Presence Plan Command Center</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-900 font-bold">Open →</span>
              </Link>

              <Link
                href="/journey/checklist"
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[12px] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <CheckSquare className="w-4 h-4 text-gray-700" />
                  <span className="text-[13px] font-bold text-gray-950">Preparation Checklist</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-900 font-bold">Open →</span>
              </Link>

              <Link
                href="/journey/presence-boosts"
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[12px] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-[13px] font-bold text-gray-950">Presence Boosters</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-900 font-bold">Open →</span>
              </Link>

              <Link
                href="/journey/explanation"
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[12px] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-[13px] font-bold text-gray-950">AI Explanation</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-900 font-bold">Open →</span>
              </Link>

              <Link
                href="/journey/compare-looks"
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[12px] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Shirt className="w-4 h-4 text-gray-700" />
                  <span className="text-[13px] font-bold text-gray-950">Compare Outfits</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-gray-900 font-bold">Open →</span>
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                href="/journey/start"
                className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[10px] shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4 text-white" />
                <span>Duplicate Journey</span>
              </Link>
              <Link
                href="/dashboard/history"
                className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[10px] border border-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Return to History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
