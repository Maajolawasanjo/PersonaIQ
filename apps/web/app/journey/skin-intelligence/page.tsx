'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function SkinIntelligencePage() {
  const [userPhoto, setUserPhoto] = React.useState<string>('/images/professional-female-headshot.jpg');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
      if (savedPhoto) {
        setUserPhoto(savedPhoto);
      }
    }
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto py-6">
      
      {/* 1. Header with Red Top Progress Accent Line */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest border-t-2 border-primary pt-3">
          <span>PRESENCE JOURNEY</span>
          <span>STEP 4 OF 5</span>
        </div>

        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Skin Intelligence Analysis
        </h1>
        <p className="text-[15px] text-gray-600 font-medium max-w-2xl">
          A non-medical evaluation of your visual presentation focusing on hydration, fatigue markers, and overall professional appearance.
        </p>
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Photo Card with Diagnostic Overlay Circles */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-xs relative">
          <div className="relative aspect-[4/5] bg-gray-100">
            <img
              src={userPhoto}
              alt="Skin Intelligence Model"
              className="w-full h-full object-cover"
            />
            
            {/* Target Ring 1: Forehead */}
            <div className="absolute top-[22%] left-[45%] w-7 h-7 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center animate-ping">
              <div className="w-2 h-2 rounded-full bg-red-600" />
            </div>

            {/* Target Ring 2: Cheek */}
            <div className="absolute top-[48%] left-[34%] w-6 h-6 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>

            {/* Target Ring 3: Chin */}
            <div className="absolute top-[68%] left-[51%] w-6 h-6 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>

            {/* Bottom Telemetry Overlay Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200/90 rounded-[12px] p-3 flex items-center justify-between text-[11.5px] font-mono font-bold text-gray-900 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span>SCAN COMPLETE</span>
              </div>
              <span className="text-gray-500">00:45s</span>
            </div>
          </div>
        </div>

        {/* Right Column: Score Gauge + Presentation Tip + Metrics */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Top Analysis Card */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                ANALYSIS
              </span>

              {/* Gauge Score Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="text-primary" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="48" strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[22px] font-black text-gray-950 font-sans leading-none">82</span>
                  <span className="text-[7.5px] font-mono font-bold text-gray-400 uppercase">INDEX</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
                Your skin appears well hydrated.
              </h2>
              <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
                The visual markers indicate a strong foundation for professional presence. The overall texture and light reflection are consistent with well-maintained hydration, supporting an energetic perception.
              </p>
            </div>

            {/* Embedded Quote Box — Presentation Tip */}
            <div className="bg-gray-50 border border-gray-200/80 rounded-[14px] p-4 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-gray-500" />
                <span>PRESENTATION TIP</span>
              </span>
              <p className="text-[12.5px] text-gray-700 italic font-medium leading-relaxed">
                &quot;Reducing under-eye fatigue may enhance your professional appearance, especially under harsh overhead lighting or during high-definition virtual meetings.&quot;
              </p>
            </div>
          </div>

          {/* Metrics Table Card */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-[13px] border-b border-gray-100 pb-2.5">
              <span className="font-semibold text-gray-700">Luminosity Variance</span>
              <span className="font-mono font-bold text-gray-950">Low (Ideal)</span>
            </div>
            <div className="flex items-center justify-between text-[13px] border-b border-gray-100 pb-2.5">
              <span className="font-semibold text-gray-700">Texture Uniformity</span>
              <span className="font-mono font-bold text-gray-950">88%</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-gray-700">Fatigue Indicators</span>
              <span className="font-mono font-bold text-primary">Elevated</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Grid Row: Strengths vs Focus Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Strengths */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-[18px] p-6 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950 font-sans">
            <svg width="18" height="18" fill="currentColor" className="text-primary" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
            <span>Strengths</span>
          </div>
          <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
            Excellent baseline hydration levels across the T-zone and cheeks, contributing to a healthy, alert baseline.
          </p>
        </div>

        {/* Focus Area */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-[18px] p-6 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950 font-sans">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span>Focus Area</span>
          </div>
          <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
            Slight shadow depth detected in the under-eye region, which may inadvertently project fatigue during video calls.
          </p>
        </div>
      </div>

      {/* 4. Bottom Action Buttons */}
      <div className="pt-6 flex items-center justify-end space-x-4 border-t border-gray-200">
        <button
          type="button"
          className="h-11 px-6 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13.5px] rounded-[10px] shadow-2xs transition-all"
        >
          Save Report
        </button>
        <Link
          href="/journey/choose-outfit"
          className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
