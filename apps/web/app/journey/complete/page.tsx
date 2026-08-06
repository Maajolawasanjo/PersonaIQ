'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Clock, Target } from 'lucide-react';

export default function JourneyCompletePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-6 text-center">
      
      {/* Top Red Checkmark Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 border border-red-200 shadow-xs mx-auto">
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[16px] font-bold">
          ✓
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-[36px] sm:text-[42px] font-bold text-gray-950 font-sans leading-tight">
          You&apos;re Ready.
        </h1>
        <p className="text-[14px] text-gray-600 font-medium">
          Your Presence Plan has been saved. Good luck with your interview.
        </p>
      </div>

      {/* Middle Milestone Card (Matching Screenshot 2) */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-xs text-left max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-5 h-44 rounded-[18px] overflow-hidden bg-gray-100 border border-gray-200">
          <img
            src="/images/563018699011466.jpeg"
            alt="Professional Preparedness Milestone"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="sm:col-span-7 space-y-2">
          <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider inline-flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-gray-500" />
            <span>MILESTONE REACHED</span>
          </span>
          <h2 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
            Professional Preparedness
          </h2>
          <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
            You have completed all modules and achieved a mastery level score. Your physiological and rhetorical baseline is optimal.
          </p>
        </div>
      </div>

      {/* Bottom Score Metrics Row (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto text-left">
        {/* Presence Index Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            PRESENCE INDEX™
          </span>
          <div className="w-20 h-20 rounded-full border-4 border-red-600 border-t-red-200 flex items-center justify-center text-[26px] font-bold text-gray-950 font-sans">
            92
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            Excellent Readiness
          </span>
        </div>

        {/* Duration Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>DURATION</span>
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-[32px] font-bold text-gray-950 font-sans leading-none">
              12
            </span>
            <span className="text-[13px] font-mono text-gray-500">mins</span>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-gray-400" />
            <span>CONFIDENCE</span>
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-[32px] font-bold text-gray-950 font-sans leading-none">
              98
            </span>
            <span className="text-[13px] font-mono text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-center space-x-4 pt-4">
        <Link
          href="/dashboard"
          className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/journey/start"
          className="h-12 px-6 bg-white hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] border border-gray-200 transition-colors flex items-center justify-center"
        >
          Start Another Journey
        </Link>
      </div>

    </div>
  );
}
