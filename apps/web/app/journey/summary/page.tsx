'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Monitor, Brain, Calendar, Check } from 'lucide-react';

export default function JourneySummaryPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* 1. Header with Title & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            JOURNEY SUMMARY
          </span>
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
            Software Engineering Interview
          </h1>
          <div className="flex items-center space-x-4 text-[12.5px] font-mono text-gray-500 pt-1">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Tomorrow • 9:00 AM</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completed August 14, 2026</span>
            </span>
          </div>
        </div>

        {/* Top Right CTAs */}
        <div className="flex items-center space-x-3">
          <Link
            href="/journey/export"
            className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all flex items-center justify-center"
          >
            Export Presence Plan
          </Link>
          <button
            type="button"
            className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[8px] border border-gray-300 transition-colors flex items-center space-x-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-gray-500" />
            <span>Save Journey</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Presence Index Card */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-6">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            ANALYSIS
          </span>

          <h2 className="text-[20px] font-bold text-gray-950 font-sans">
            Presence Index™
          </h2>

          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="w-40 h-40 rounded-full border-[8px] border-gray-150 border-b-red-600 border-l-red-600 flex items-center justify-center relative">
              <span className="text-[44px] font-extrabold text-gray-950 font-sans leading-none">
                92
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100 text-[13px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Confidence</span>
              <span className="font-bold text-gray-950">96%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Winning Outfit & Key Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Winning Outfit Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Left Outfit Image */}
            <div className="sm:col-span-5 relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src="/images/brown-peaked-lapel-suit.jpg"
                alt="Winning Outfit"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-gray-900 bg-white/90 px-2.5 py-1 rounded border border-gray-200">
                96% Match
              </span>
            </div>

            {/* Right Details */}
            <div className="sm:col-span-7 space-y-4">
              <h3 className="text-[24px] font-bold text-gray-950 font-sans leading-tight">
                Business Formal
              </h3>

              <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
                This ensemble projects authority and attention to detail, aligning perfectly with the corporate culture of the target organization.
              </p>

              <div className="space-y-2 text-[12.5px] font-sans text-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-650 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Charcoal tailored blazer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-650 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Crisp white dress shirt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-650 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Subtle pattern silk tie</span>
                </div>
              </div>
            </div>

          </div>

          {/* Key Recommendations Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              ANALYSIS
            </span>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">
              Key Recommendations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-150 rounded-[16px] p-4 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Monitor className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                    Communication Focus
                  </h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">
                    Emphasize collaborative problem-solving over individual achievements.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-150 rounded-[16px] p-4 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                    Mindset Preparation
                  </h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">
                    Review complex technical challenges you&apos;ve recently overcome.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Centered Home Action */}
      <div className="pt-4 flex justify-center">
        <Link
          href="/dashboard"
          className="h-10 px-6 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[13px] rounded-[8px] border border-gray-300 transition-colors"
        >
          Return Home
        </Link>
      </div>

    </div>
  );
}
