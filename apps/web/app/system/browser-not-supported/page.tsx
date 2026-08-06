'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Monitor, Compass, Globe } from 'lucide-react';

export default function BrowserNotSupportedPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Brand Header */}
      <div className="text-[24px] font-bold font-sans text-red-650 tracking-tight pb-6">
        PersonaIQ
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-lg w-full space-y-6 text-center">
        
        {/* Warning Icon & Title */}
        <div className="space-y-2">
          <span className="text-[12px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center justify-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Unsupported Browser Detected</span>
          </span>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed max-w-md mx-auto">
            To ensure the highest fidelity experience during your Presence Journey, PersonaIQ requires a modern browser. The advanced AI components and real-time visualizations engineered for this platform are not supported in your current environment.
          </p>
        </div>

        {/* Recommended Alternatives Grid */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            RECOMMENDED ALTERNATIVES
          </span>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
              <Monitor className="w-6 h-6 text-gray-700" />
              <span className="text-[11.5px] font-bold text-gray-950 font-sans block">Google Chrome</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
              <Compass className="w-6 h-6 text-gray-700" />
              <span className="text-[11.5px] font-bold text-gray-950 font-sans block">Apple Safari</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3.5 text-center flex flex-col items-center justify-center space-y-1.5">
              <Globe className="w-6 h-6 text-gray-700" />
              <span className="text-[11.5px] font-bold text-gray-950 font-sans block">Mozilla Firefox</span>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="text-[12px] font-mono text-gray-500 hover:text-gray-900 underline"
          >
            Return to Previous Page
          </Link>
        </div>

      </div>

    </div>
  );
}
