'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, Compass, Clock, FileText, ArrowLeft, RotateCcw } from 'lucide-react';

export default function OfflineModePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 sm:p-10 shadow-xs max-w-lg w-full space-y-6 flex flex-col items-center">
        
        {/* System Offline Tag */}
        <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 border border-gray-250 px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
          <WifiOff className="w-3.5 h-3.5 text-gray-500" />
          <span>SYSTEM OFFLINE</span>
        </span>

        {/* Title & Description */}
        <div className="space-y-2 max-w-md">
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
            Connection Lost
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            PersonaIQ is currently operating in offline mode. New analyses are paused, but your securely cached presence data remains accessible.
          </p>
        </div>

        {/* Central Wireframe Graphic Box */}
        <div className="w-48 h-48 rounded-[20px] bg-gray-50 border border-gray-200 flex items-center justify-center relative">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            <Compass className="w-10 h-10 stroke-[1.5]" />
          </div>
        </div>

        {/* 2 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
          <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-4 space-y-1">
            <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Cached Analyses</span>
            </span>
            <p className="text-[11.5px] text-gray-500 font-normal leading-tight">
              Review your most recent Presence Journey reports stored locally.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-4 space-y-1">
            <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-gray-600" />
              <span>Saved Drafts</span>
            </span>
            <p className="text-[11.5px] text-gray-500 font-normal leading-tight">
              Access and edit your pending configuration plans offline.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 w-full pt-2">
          <Link
            href="/dashboard"
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm flex items-center justify-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-[12px] font-mono text-gray-500 hover:text-gray-900 mx-auto flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Reconnecting</span>
          </button>
        </div>

      </div>

    </div>
  );
}
