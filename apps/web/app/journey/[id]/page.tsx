'use client';

import React from 'react';
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
  Briefcase
} from 'lucide-react';

export default function JourneyDetailsHubPage() {
  const params = useParams();
  const journeyId = params?.id || 'j1';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-4 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Top Header Row with Navigation & Actions */}
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
              JOURNEY DETAILS HUB #{journeyId}
            </span>
          </div>
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
            Venture Capital Pitch Analysis
          </h1>
          <p className="text-[13.5px] text-gray-500 font-medium">
            Evaluated on October 24, 2026 for Tech Investors engagement context.
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

      {/* Top Index & Event Context Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        
        {/* Presence Index Badge */}
        <div className="sm:col-span-4 bg-gray-950 text-white rounded-[20px] p-6 shadow-md flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
            OVERALL PRESENCE INDEX™
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-[52px] font-black text-white font-sans leading-none">
              94
            </span>
            <span className="text-[16px] font-mono text-gray-400">/ 100</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11.5px] font-mono text-gray-300">
            <span>Perceived Authority: High</span>
            <span>Approachability: 91%</span>
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
              <span className="text-[14px] font-bold text-gray-950 font-sans block">Venture Pitch</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>TARGET AUDIENCE</span>
              </span>
              <span className="text-[14px] font-bold text-gray-950 font-sans block">Tech Investors</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>DRESS CODE</span>
              </span>
              <span className="text-[14px] font-bold text-gray-950 font-sans block">Executive Casual</span>
            </div>
          </div>

          <p className="text-[12.5px] text-gray-600 font-normal border-t border-gray-200/80 pt-3">
            Simulated evaluation targeting high-stakes capital partner reviews. Tailored for maximum visual trust and calm leadership tone.
          </p>
        </div>

      </div>

      {/* Main 2-Column Content: Winning Look & Skin Diagnostics vs Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Left Column: Uploaded Assets & Outfit Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Selected Outfit Flatlay */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                SELECTED WINNING LOOK
              </span>
              <span className="text-[11px] font-mono font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                ALIGNMENT SCORE: 96%
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src="/images/brown-peaked-lapel-suit.jpg"
                alt="Navy Unstructured Blazer & Grey Trousers"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                Navy Unstructured Blazer & Grey Trousers
              </h3>
              <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
                This combination balances executive authority with approachable modern design. High color contrast highlights facial features while reducing perceived tension during presentation rounds.
              </p>
            </div>
          </div>

          {/* Skin Intelligence Diagnostics */}
          <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-600 bg-white px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
              SKIN INTELLIGENCE METRICS
            </span>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-[12px] border border-gray-200 text-center">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">HYDRATION</span>
                <span className="text-[18px] font-bold text-gray-950 font-sans">92%</span>
              </div>
              <div className="bg-white p-3 rounded-[12px] border border-gray-200 text-center">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">FATIGUE INDEX</span>
                <span className="text-[18px] font-bold text-gray-950 font-sans">Low (12%)</span>
              </div>
              <div className="bg-white p-3 rounded-[12px] border border-gray-200 text-center">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase block">POSTURE SYMMETRY</span>
                <span className="text-[18px] font-bold text-gray-950 font-sans">98%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Complete Action Navigation Matrix */}
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
