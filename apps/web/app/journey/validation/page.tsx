'use client';

import React from 'react';
import Link from 'next/link';

export default function ImageValidationPage() {
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
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-6">
      
      {/* Top Header Bar */}
      <div className="bg-gray-900 text-white px-5 py-3 rounded-t-[16px] flex items-center justify-between text-[12.5px] font-mono font-bold tracking-wide">
        <div className="flex items-center space-x-2">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
          <span>Image Validation | Presence Journey</span>
        </div>
      </div>

      {/* Main Validation Card */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b-[20px] p-6 sm:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-7 items-center">
        
        {/* Left Column: Portrait Viewfinder Feed */}
        <div className="sm:col-span-5 relative aspect-[3/4] bg-gray-950 rounded-[16px] overflow-hidden border border-gray-800 shadow-md">
          <img
            src={userPhoto}
            alt="Validated Capture"
            className="w-full h-full object-cover grayscale contrast-125 brightness-95"
          />

          {/* Scanner Grid Lines Overlay */}
          <div className="absolute inset-0 border-2 border-red-500/40 pointer-events-none" />
          <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-red-500 shadow-[0_0_8px_#A31F34]" />

          {/* Live Feed Badge */}
          <div className="absolute bottom-3 left-3 bg-gray-950/90 text-white px-3 py-1 rounded-full text-[10.5px] font-mono font-bold flex items-center space-x-2 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE FEED ANALYSIS</span>
          </div>
        </div>

        {/* Right Column: Pre-Analysis Check Checklist */}
        <div className="sm:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-primary font-bold">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
              <h2 className="text-[24px] font-bold text-gray-950 font-sans leading-tight">
                Pre-Analysis Check
              </h2>
            </div>
            <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed">
              We are validating your capture to ensure the highest fidelity for the Presence Journey processing.
            </p>
          </div>

          {/* Diagnostic Telemetry Meters */}
          <div className="space-y-4 pt-1">
            
            {/* Meter 1: Face Detection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span className="font-bold text-gray-950">Face Detection & Alignment</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">100% (Optimal)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-full" />
              </div>
            </div>

            {/* Meter 2: Lighting Quality */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span className="font-bold text-gray-950">Lighting & Lux Contrast</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">96% (Even)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[96%]" />
              </div>
            </div>

            {/* Meter 3: Resolution & Clarity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span className="font-bold text-gray-950">Resolution & Focal Sharpness</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">98% (Fidelity High)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[98%]" />
              </div>
            </div>

            {/* Alert Box: Camera Angle Acceptable */}
            <div className="bg-red-50/60 border border-red-200 rounded-[12px] p-3.5 flex items-start space-x-3 text-[12.5px] mt-2">
              <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                !
              </div>
              <div>
                <span className="font-bold text-gray-950 block">Camera Angle Acceptable</span>
                <span className="text-primary font-medium text-[12px] block">
                  Suggestion: Move slightly closer to the camera to optimize skin telemetry accuracy.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/journey/skin-intelligence"
              className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>
              <span>Begin Skin & Presence Analysis</span>
            </Link>

            <Link
              href="/journey/capture-look"
              className="w-full h-11 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-[13.3px] rounded-[10px] transition-all flex items-center justify-center space-x-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              <span>Recapture Photo</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
