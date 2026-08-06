'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Save, Copy, LayoutDashboard } from 'lucide-react';

export default function ShareSuccessPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText('PersonaIQ Analysis Complete: Presence Index 92/100 • Executive Preparedness Complete');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="space-y-6 max-w-xl w-full">
        
        {/* Red Circle Checkmark Icon */}
        <div className="w-14 h-14 rounded-full bg-red-650 text-white flex items-center justify-center mx-auto shadow-md">
          <Check className="w-6 h-6 text-white" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-[38px] sm:text-[44px] font-bold text-gray-950 font-sans leading-tight">
            You&apos;re Ready.
          </h1>
          <p className="text-[14px] text-gray-600 font-normal">
            Your Presence Journey analysis is complete.
          </p>
        </div>

        {/* Analysis Card */}
        <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-xs space-y-4 text-left">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            ANALYSIS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left Box: Presence Index 92 Ring Gauge */}
            <div className="bg-gray-50/70 border border-gray-150 rounded-[18px] p-5 flex flex-col items-center justify-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                Presence Index™
              </span>
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-red-600 border-r-red-600 flex items-center justify-center">
                <span className="text-[28px] font-extrabold text-gray-950 font-sans">
                  92
                </span>
              </div>
            </div>

            {/* Right Box: Confidence High */}
            <div className="bg-gray-50/70 border border-gray-150 rounded-[18px] p-5 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                Confidence
              </span>
              <span className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
                High
              </span>
              <p className="text-[11px] text-gray-500 font-normal leading-tight">
                Based on verbal pacing and structural clarity.
              </p>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            className="w-full sm:w-auto h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4 text-white shrink-0" />
            <span>Save Image</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto h-11 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center space-x-2"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500 shrink-0" />
            )}
            <span>{copied ? 'Summary Copied' : 'Copy Summary'}</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto h-11 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center space-x-2"
          >
            <LayoutDashboard className="w-4 h-4 text-gray-500 shrink-0" />
            <span>Dashboard</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
