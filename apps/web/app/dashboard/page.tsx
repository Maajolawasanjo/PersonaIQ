'use client';

import React, { useState } from 'react';
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

export default function DashboardHomePage() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      
      {/* State Switcher Bar (Preserves Both Views) */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">
            VIEW STATE:
          </span>
          <button
            onClick={() => setIsFirstTimeUser(false)}
            className={`px-3 py-1 rounded-full text-[11.5px] font-mono font-bold transition-all flex items-center space-x-1.5 ${
              !isFirstTimeUser
                ? 'bg-gray-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Active Dashboard</span>
          </button>
          <button
            onClick={() => setIsFirstTimeUser(true)}
            className={`px-3 py-1 rounded-full text-[11.5px] font-mono font-bold transition-all flex items-center space-x-1.5 ${
              isFirstTimeUser
                ? 'bg-gray-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>First-Time User (Zero State)</span>
          </button>
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
              Your first journey starts here
            </h2>
            <p className="text-[14px] text-gray-600 font-normal leading-relaxed">
              Begin your Presence Journey to unlock deep, AI-driven insights into your interactions and cognitive patterns.
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
        /* 2. POPULATED ACTIVE DASHBOARD VIEW (Dr. Eleanor Vance View) */
        <div className="space-y-8 w-full">
          {/* Executive Header */}
          <div className="space-y-1">
            <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
              Good morning, Dr. Chen.
            </h1>
            <p className="text-[16px] text-gray-600 font-medium">
              Your PresenceDNA™ is ready for review.
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
                      <span>Status: Excellent</span>
                    </div>

                    <p className="text-[14.5px] text-gray-750 leading-relaxed font-normal">
                      Your baseline clarity and executive authority are operating at peak levels today. Ideal time for high-stakes communication.
                    </p>

                    <div className="pt-2 text-[13.5px] font-mono font-bold text-gray-700">
                      AI Confidence: <span className="text-gray-950 font-extrabold">92%</span>
                    </div>
                  </div>

                  {/* Circular Gauge Ring */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="text-gray-150" strokeWidth="11" stroke="currentColor" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className="text-red-600" strokeWidth="11" strokeDasharray="251.2" strokeDashoffset="42" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[44px] font-extrabold text-gray-950 font-sans leading-none tracking-tight">
                          84
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
              <div className="grid grid-cols-2 gap-3.5">
                <Link
                  href="/journey/start"
                  className="bg-white border border-gray-200 rounded-[16px] p-4 text-center space-y-2.5 hover:border-red-600/40 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[105px] group"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Play className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-950 block leading-tight">Start New Journey</span>
                </Link>

                <Link
                  href="/journey/start"
                  className="bg-white border border-gray-200 rounded-[16px] p-4 text-center space-y-2.5 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[105px] group"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Activity className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-950 block leading-tight">Resume Journey</span>
                </Link>

                <Link
                  href="/dashboard/history"
                  className="bg-white border border-gray-200 rounded-[16px] p-4 text-center space-y-2.5 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[105px] group"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <History className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-950 block leading-tight">History</span>
                </Link>

                <Link
                  href="/dashboard/presence-dna"
                  className="bg-white border border-gray-200 rounded-[16px] p-4 text-center space-y-2.5 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col items-center justify-center min-h-[105px] group"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Dna className="w-4 h-4 text-gray-750" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-950 block leading-tight">PresenceDNA</span>
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                    Recent Activity
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-gray-50 border border-gray-200/70">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-[8px] bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="text-[14px] font-bold text-gray-950 block leading-tight">Q3 Executive Briefing</span>
                          <span className="text-[12px] text-gray-500 block font-mono">2 hours ago</span>
                        </div>
                      </div>
                      <span className="text-[18px] font-extrabold font-sans text-gray-950">88</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-gray-50 border border-gray-200/70">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-[8px] bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                          <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="text-[14px] font-bold text-gray-950 block leading-tight">Team Sync</span>
                          <span className="text-[12px] text-gray-500 block font-mono">Yesterday</span>
                        </div>
                      </div>
                      <span className="text-[18px] font-extrabold font-sans text-gray-950">76</span>
                    </div>
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
                <h3 className="text-[18px] font-bold text-gray-950 font-sans">Upcoming Events</h3>
                <span className="text-[10.5px] font-mono font-bold text-gray-400 uppercase tracking-wider">THIS WEEK</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Q4 Strategy Keynote', date: 'Tomorrow, 9:00 AM', type: 'Keynote', score: null },
                  { name: 'Board Review Session', date: 'Thu, Aug 8 · 2:00 PM', type: 'Boardroom', score: 91 },
                  { name: 'Investor Pitch — Series C', date: 'Fri, Aug 9 · 10:30 AM', type: 'Pitch', score: null },
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-[12px] bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
                      <div>
                        <span className="text-[13.5px] font-bold text-gray-950 block leading-tight">{event.name}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{event.date} · {event.type}</span>
                      </div>
                    </div>
                    {event.score ? (
                      <span className="text-[13px] font-extrabold font-sans text-gray-950 shrink-0">{event.score}</span>
                    ) : (
                      <Link href="/journey/start" className="text-[11px] font-mono font-bold text-primary hover:underline shrink-0">Prepare →</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-gray-950 font-sans">Notifications</h3>
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">3</span>
              </div>
              <div className="space-y-3">
                {[
                  { msg: 'Your Presence Index™ increased by 4 points this week.', time: '2h ago', read: false, icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
                  { msg: 'Board Review Session is tomorrow. Run a quick analysis now.', time: '5h ago', read: false, icon: <Bell className="w-4 h-4 text-amber-500" /> },
                  { msg: 'New skin hydration recommendation available in your plan.', time: '1d ago', read: false, icon: <Dna className="w-4 h-4 text-primary" /> },
                  { msg: 'Q3 Executive Briefing report exported successfully.', time: '2d ago', read: true, icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                ].map((n, i) => (
                  <div key={i} className={`flex items-start space-x-3 p-3 rounded-[12px] transition-colors ${n.read ? 'opacity-50' : 'bg-gray-50 border border-gray-100'}`}>
                    <span className="shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] text-gray-700 font-medium leading-snug">{n.msg}</p>
                      <span className="text-[10.5px] text-gray-400 font-mono">{n.time}</span>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
