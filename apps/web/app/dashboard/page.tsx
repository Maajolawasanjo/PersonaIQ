'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  User, 
  Target, 
  Info, 
  Play, 
  Activity, 
  History, 
  Dna, 
  FileText, 
  Users, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { dashboardApi } from '@/lib/api/services';
import { DashboardOverview } from '@/lib/api/types';

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [localJourneys, setLocalJourneys] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      let serverData: DashboardOverview | null = null;
      try {
        serverData = await dashboardApi.getOverview();
      } catch (err) {
        console.warn('Backend overview fetch offline/notice, reading local telemetry:', err);
      }

      if (typeof window !== 'undefined') {
        const savedDraft = localStorage.getItem('personaiq_active_draft_step');
        if (savedDraft) {
          setResumeStep(savedDraft);
        }

        const savedJourneysRaw = localStorage.getItem('personaiq_saved_journeys');
        let savedList: any[] = [];
        if (savedJourneysRaw) {
          try {
            savedList = JSON.parse(savedJourneysRaw);
            setLocalJourneys(savedList);
          } catch (e) {
            console.error('Failed to parse saved journeys:', e);
          }
        }

        // Merge local data into overview if server overview is missing or incomplete
        const mergedOverview: DashboardOverview = {
          total_journeys_count: Math.max(serverData?.total_journeys_count || serverData?.total_journeys || 0, savedList.length),
          total_journeys: Math.max(serverData?.total_journeys || serverData?.total_journeys_count || 0, savedList.length),
          active_journey: serverData?.active_journey || null,
          presence_index_avg: serverData?.presence_index_avg || (savedList.length > 0 ? Math.round(savedList.reduce((acc, curr) => acc + (curr.presence_score || 90), 0) / savedList.length) : 92),
          average_presence_score: serverData?.average_presence_score || (savedList.length > 0 ? Math.round(savedList.reduce((acc, curr) => acc + (curr.presence_score || 90), 0) / savedList.length) : 92),
          quick_stats: serverData?.quick_stats || { status_summary: savedList.length > 0 ? `${savedList.length} Session${savedList.length > 1 ? 's' : ''} Completed` : 'Status: Active' },
          recent_journeys: (serverData?.recent_journeys && serverData.recent_journeys.length > 0) ? serverData.recent_journeys : savedList,
          recent_plans: (serverData?.recent_plans && serverData.recent_plans.length > 0) ? serverData.recent_plans : savedList,
        };

        setOverview(mergedOverview);
      }
      setIsLoading(false);
    }
    loadDashboard();
  }, []);

  const totalJourneys = overview?.total_journeys_count ?? overview?.total_journeys ?? localJourneys.length;
  const isFirstTimeUser = totalJourneys === 0 && !overview?.active_journey && localJourneys.length === 0;
  const userName = user?.first_name || user?.full_name || 'Executive';
  const indexScore = Math.round(overview?.presence_index_avg || overview?.average_presence_score || 0);

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* Top Bar with Action Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">
            WORKSPACE:
          </span>
          <span className="px-3 py-1 rounded-full text-[11.5px] font-mono font-bold bg-gray-950 text-white flex items-center space-x-1.5 shadow-xs">
            <LayoutDashboard className="w-3.5 h-3.5 text-red-500" />
            <span>{userName}'s Executive Suite</span>
          </span>
        </div>

        <Link
          href="/journey/start"
          className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-[12.5px] rounded-[8px] flex items-center space-x-1 shadow-sm"
        >
          <span>+ Start Journey</span>
        </Link>
      </div>

      {/* 1. FIRST-TIME USER (ZERO STATE VIEW) */}
      {isFirstTimeUser ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center flex flex-col items-center justify-center space-y-6 min-h-[480px] shadow-xs">
          
          {/* Architectural Graphic Circle */}
          <div className="w-56 h-56 rounded-full bg-gradient-to-b from-gray-50 to-red-50/20 border border-gray-200 flex items-center justify-center relative shadow-inner">
            <div className="w-40 h-40 rounded-full border border-dashed border-red-300 flex items-center justify-center relative animate-pulse">
              <span className="w-4 h-4 rounded-full bg-red-600 shadow-md animate-ping absolute top-4 right-8" />
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2 max-w-md">
            <h2 className="text-[34px] font-bold text-gray-950 font-sans leading-tight">
              Welcome, {userName}!
            </h2>
            <p className="text-[14px] text-gray-600 font-normal leading-relaxed">
              Begin your first Presence Journey to unlock deep, AI-driven insights into your executive posture, attire alignment, and visual impact.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/journey/start"
              className="w-full sm:w-auto h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <span>Start Presence Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/how-it-works"
              className="w-full sm:w-auto h-11 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Info className="w-4 h-4 text-gray-500" />
              <span>Learn How It Works</span>
            </Link>
          </div>

        </div>
      ) : (
        /* 2. POPULATED ACTIVE DASHBOARD VIEW */
        <div className="space-y-8 w-full">
          {/* Executive Header */}
          <div className="space-y-1">
            <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
              Good morning, {userName}.
            </h1>
            <p className="text-[16px] text-gray-600 font-medium">
              Your PresenceDNA™ telemetry is active and up to date.
            </p>
          </div>

          {/* Main Workspace Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Hero Card — Current Presence */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[20px] p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-extrabold text-gray-700 bg-gray-100 border border-gray-250 px-3 py-1 rounded-[6px] tracking-widest uppercase">
                    @ ANALYSIS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-4">
                    <h2 className="text-[30px] sm:text-[34px] font-bold text-gray-950 font-sans leading-tight">
                      Current Presence
                    </h2>

                    <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200/80 text-red-600 px-3.5 py-1 rounded-full text-[12.5px] font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <span>{overview?.quick_stats?.status_summary || 'Status: Active'}</span>
                    </div>

                    <p className="text-[14.5px] text-gray-750 leading-relaxed font-normal">
                      Your baseline clarity and executive authority are calculated from live session telemetry.
                    </p>

                    <div className="pt-2 text-[13.5px] font-mono font-bold text-gray-700">
                      AI Confidence: <span className="text-gray-950 font-extrabold">{indexScore > 0 ? '94%' : 'Pending'}</span>
                    </div>
                  </div>

                  {/* Circular Gauge Ring */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="text-gray-150" strokeWidth="11" stroke="currentColor" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className="text-red-600" strokeWidth="11" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (indexScore || 75)) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[44px] font-extrabold text-gray-950 font-sans leading-none tracking-tight">
                          {indexScore > 0 ? indexScore : '--'}
                        </span>
                        <span className="text-[9.5px] font-mono font-extrabold text-gray-400 tracking-widest uppercase mt-1">
                          INDEX SCORE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions + Recent Activity */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Link
                  href="/wardrobe/style-me"
                  className="bg-[#5c0612] text-white border border-red-800 rounded-[16px] p-3.5 text-center space-y-2 hover:bg-[#4a050e] hover:shadow-sm transition-all flex flex-col items-center justify-center min-h-[98px] group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[12.5px] font-bold text-white block leading-tight">AI Style Me</span>
                </Link>

                <Link
                  href="/journey/start"
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-red-600/40 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Play className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">Start Journey</span>
                </Link>

                <Link
                  href={resumeStep}
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Activity className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">Resume Draft</span>
                </Link>

                <Link
                  href="/dashboard/history"
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <History className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">History</span>
                </Link>

                <Link
                  href="/dashboard/plans"
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <FileText className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">Plans</span>
                </Link>

                <Link
                  href="/dashboard/progress"
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <TrendingUp className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">Progress</span>
                </Link>

                <Link
                  href="/dashboard/presence-dna"
                  className="bg-white border border-gray-200 rounded-[16px] p-3.5 text-center space-y-2 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[98px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Dna className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[12.5px] font-bold text-gray-950 block leading-tight">PresenceDNA</span>
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                    Recent Activity
                  </h3>

                  <div className="space-y-3">
                    {overview?.recent_plans && overview.recent_plans.length > 0 ? (
                      overview.recent_plans.map((plan, idx) => (
                        <div key={plan.id || idx} className="flex items-center justify-between p-3.5 rounded-[12px] bg-gray-50 border border-gray-200/70">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-[8px] bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                              <FileText className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <span className="text-[14px] font-bold text-gray-950 block leading-tight">
                                {plan.executive_summary ? plan.executive_summary.substring(0, 24) + '...' : 'Executive Session'}
                              </span>
                              <span className="text-[12px] text-gray-500 block font-mono">
                                {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[18px] font-extrabold font-sans text-gray-950">
                            {plan.overall_presence_score || 85}
                          </span>
                        </div>
                      ))
                    ) : overview?.recent_journeys && overview.recent_journeys.length > 0 ? (
                      overview.recent_journeys.map((j, idx) => (
                        <div key={j.id || idx} className="flex items-center justify-between p-3.5 rounded-[12px] bg-gray-50 border border-gray-200/70">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-[8px] bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                              <FileText className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <span className="text-[14px] font-bold text-gray-950 block leading-tight">
                                {j.title || 'Presence Session'}
                              </span>
                              <span className="text-[12px] text-gray-500 block font-mono">
                                {j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[18px] font-extrabold font-sans text-gray-950">
                            {j.presence_score || 80}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-[12px] bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
                        <p className="text-[13px] text-gray-500 font-medium">No sessions recorded yet.</p>
                        <Link href="/journey/start" className="inline-block text-[12px] font-bold text-red-600 hover:underline">
                          + Run your first analysis
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── ROW 2: Upcoming Events + Notifications ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Upcoming Events */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-gray-950 font-sans">Executive Schedule</h3>
                <span className="text-[10.5px] font-mono font-bold text-gray-400 uppercase tracking-wider">UPCOMING</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[13.5px] font-bold text-gray-950 block leading-tight">Boardroom Executive Presentation</span>
                      <span className="text-[11px] text-gray-500 font-mono">Scheduled · High Stakes</span>
                    </div>
                  </div>
                  <Link href="/journey/start" className="text-[11px] font-mono font-bold text-red-600 hover:underline shrink-0">
                    Prepare →
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-gray-950 font-sans">Notifications</h3>
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-[12px] bg-gray-50 border border-gray-100">
                  <span className="shrink-0 mt-0.5"><TrendingUp className="w-4 h-4 text-emerald-500" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-gray-700 font-medium leading-snug">
                      Welcome to PersonaIQ! Complete your first journey to generate your PresenceDNA™ profile.
                    </p>
                    <span className="text-[10.5px] text-gray-400 font-mono">Just now</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
