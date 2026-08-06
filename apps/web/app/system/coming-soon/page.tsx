'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function ModuleInReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center space-x-2 pb-6 border-b border-gray-200">
        <Link href="/dashboard" className="text-[13px] font-sans text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Context Header</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-md w-full space-y-6 mt-6 flex flex-col items-center">
        
        {/* Academic / Review Compass Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-650">
          <Compass className="w-7 h-7 text-red-650 animate-spin-slow" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold text-gray-950 font-sans">
            Module in Review
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            This integration is currently undergoing academic review for methodology validation and security compliance. It will be available in a forthcoming intelligence update.
          </p>
        </div>

        {/* Return Button */}
        <div className="pt-2 w-full">
          <Link
            href="/dashboard"
            className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[12px] font-mono uppercase tracking-wider rounded-[10px] flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 shrink-0" />
            <span>RETURN TO DASHBOARD</span>
          </Link>
        </div>

        {/* Status Code */}
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pt-2">
          STATUS CODE: 202-ACCEPTED
        </span>

      </div>

    </div>
  );
}
