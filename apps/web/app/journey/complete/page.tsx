'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  Target, 
  FileText, 
  CheckSquare, 
  Download, 
  Share2, 
  HelpCircle, 
  LayoutDashboard, 
  Play,
  ArrowRight,
  Check
} from 'lucide-react';
import { VTO_MODELS } from '@/lib/catalog/vtoCatalog';

export default function JourneyCompletePage() {
  const [userPhoto, setUserPhoto] = useState<string>('/vto/models/male/black/male_black_base.jpg');
  const [score, setScore] = useState<number>(95);
  const [occasion, setOccasion] = useState<string>('Job Interview');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('personaiq_user_outfit_preview') || localStorage.getItem('personaiq_user_selfie_preview');
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');
      const savedScore = localStorage.getItem('personaiq_active_presence_score');
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';

      if (savedPhoto && savedPhoto.length > 10) {
        setUserPhoto(savedPhoto);
      } else if (savedAvatarId) {
        const found = VTO_MODELS.find((m) => m.id === savedAvatarId);
        if (found) setUserPhoto(found.image_url);
      }

      if (savedScore) setScore(parseInt(savedScore, 10));
      setOccasion(savedOccasion.toUpperCase());
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-6 text-center">
      
      {/* Top Red Checkmark Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 border border-red-200 shadow-xs mx-auto">
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[16px] font-bold">
          <Check className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-[36px] sm:text-[42px] font-bold text-gray-950 font-sans leading-tight">
          You&apos;re Ready.
        </h1>
        <p className="text-[14px] text-gray-600 font-medium">
          Your Presence Plan for <strong className="text-gray-950">{occasion}</strong> is saved and active.
        </p>
      </div>

      {/* Middle Milestone Card */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-xs text-left max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-5 h-44 rounded-[18px] overflow-hidden bg-gray-950 border border-gray-200">
          <img
            src={userPhoto}
            alt="Validated Preparation Milestone"
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="sm:col-span-7 space-y-2">
          <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 uppercase tracking-wider inline-flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-red-600" />
            <span>AI MILESTONE LOCKED</span>
          </span>
          <h2 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
            Professional Preparedness
          </h2>
          <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
            You have completed all presence modules for {occasion}. Visual, rhetorical, and skin telemetry baselines are optimal for executive authority.
          </p>
        </div>
      </div>

      {/* Bottom Score Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto text-left">
        {/* Presence Index Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            PRESENCE INDEX™
          </span>
          <div className="w-20 h-20 rounded-full border-4 border-red-600 border-t-red-200 flex items-center justify-center text-[26px] font-bold text-gray-950 font-sans shadow-inner">
            {score}
          </div>
          <span className="text-[11px] font-mono font-bold text-red-600">
            {score >= 95 ? 'Excellent Readiness' : 'High Authority'}
          </span>
        </div>

        {/* AI Confidence Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-gray-400" />
            <span>AI CONFIDENCE</span>
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-[32px] font-bold text-gray-950 font-sans leading-none">
              96
            </span>
            <span className="text-[13px] font-mono text-gray-500">%</span>
          </div>
        </div>

        {/* Telemetry Status Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>STATUS</span>
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-[20px] font-bold text-emerald-600 font-sans leading-tight">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Completion Launchpad Grid */}
      <div className="max-w-3xl mx-auto pt-6 border-t border-gray-200 space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-950 font-sans">
            Analysis Launchpad
          </h3>
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
            EXPLORE DETAILS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <Link
            href="/journey/presence-plan"
            className="p-4 bg-white border border-gray-200 hover:border-red-600/40 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-4.5 h-4.5 text-red-600" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">View Presence Plan</span>
              <span className="text-[11px] text-gray-500 font-normal">Command center view</span>
            </div>
          </Link>

          <Link
            href="/journey/checklist"
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4.5 h-4.5 text-gray-700" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">Preparation Checklist</span>
              <span className="text-[11px] text-gray-500 font-normal">Tasks & offsets</span>
            </div>
          </Link>

          <Link
            href="/journey/export"
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Download className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">Export PDF</span>
              <span className="text-[11px] text-gray-500 font-normal">Download report</span>
            </div>
          </Link>

          <Link
            href="/journey/share"
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Share2 className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">Share Result</span>
              <span className="text-[11px] text-gray-500 font-normal">Generate link</span>
            </div>
          </Link>

          <Link
            href="/journey/explanation"
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">View AI Explanation</span>
              <span className="text-[11px] text-gray-500 font-normal">Diagnostic breakdown</span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[16px] shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-4.5 h-4.5 text-gray-700" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-gray-950 block leading-tight">Go to Dashboard</span>
              <span className="text-[11px] text-gray-500 font-normal">Return to workspace</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/journey/start"
          className="w-full sm:w-auto h-12 px-7 bg-white hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] border border-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4 text-gray-500" />
          <span>Start New Journey</span>
        </Link>
      </div>

    </div>
  );
}
