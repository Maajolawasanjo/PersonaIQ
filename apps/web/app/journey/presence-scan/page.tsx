'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PresenceScanPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-advance to Skin Intelligence analysis screen after 3.5 seconds
    const timer = setTimeout(() => {
      router.push('/journey/skin-intelligence');
    }, 3500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 animate-fadeIn text-center py-10 max-w-xl mx-auto">
      {/* Concentric Pulsing Radar Animation */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Outer Ring 1 */}
        <div className="absolute inset-0 rounded-full border border-red-200 animate-ping opacity-75" />
        {/* Outer Ring 2 */}
        <div className="absolute inset-3 rounded-full border border-red-300 animate-pulse" />
        
        {/* Centered AI Icon Circle */}
        <div className="w-20 h-20 rounded-full bg-red-50 text-primary border border-red-200 flex items-center justify-center shadow-xs z-10">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2 max-w-md">
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Analyzing Your Presence...
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium leading-relaxed">
          Please wait while our algorithms process your data. Estimated time: 8-12 seconds.
        </p>
      </div>

      {/* Progress Stepper Card */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs w-full max-w-md">
        <div className="flex items-center justify-between px-2">
          
          {/* Step 1: Preparing Image */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[12px] font-bold">
              ✓
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-600">Preparing image</span>
          </div>

          <div className="flex-1 h-[2px] bg-red-200 mx-2" />

          {/* Step 2: Analyzing Skin (Active) */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-red-50 text-primary border-2 border-primary flex items-center justify-center text-[12px] font-bold animate-pulse">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span className="text-[11px] font-mono font-extrabold text-primary">Analyzing skin</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-200 mx-2" />

          {/* Step 3: Context */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[12px]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </div>
            <span className="text-[11px] font-mono text-gray-400">Context</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-200 mx-2" />

          {/* Step 4: Profile */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[12px]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="text-[11px] font-mono text-gray-400">Profile</span>
          </div>

        </div>
      </div>
    </div>
  );
}
