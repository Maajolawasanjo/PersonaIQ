'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, Lock } from 'lucide-react';

export default function CameraAccessRequiredPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center space-x-2 pb-6 border-b border-gray-200">
        <Link href="/dashboard" className="text-[13px] font-sans text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Context Header</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-md w-full space-y-5 mt-6">
        
        {/* Camera Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
          <Video className="w-7 h-7 text-red-650" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold text-gray-950 font-sans">
            Camera Access
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            PersonaIQ requires access to your camera to initiate the Presence Scan. This allows our AI to analyze real-time micro-expressions and postural data.
          </p>
        </div>

        {/* Privacy Guarantee Box */}
        <div className="bg-gray-50 border border-gray-150 rounded-[14px] p-4 text-left space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>PRIVACY GUARANTEE</span>
          </span>
          <p className="text-[11.5px] text-gray-600 font-normal leading-relaxed">
            All analysis is performed locally where possible. Video feeds are never stored, recorded, or transmitted to external servers without explicit consent.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all"
          >
            Grant Permission
          </button>
          <button
            type="button"
            className="w-full h-11 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors"
          >
            Upload Video Instead
          </button>
        </div>

      </div>

    </div>
  );
}
