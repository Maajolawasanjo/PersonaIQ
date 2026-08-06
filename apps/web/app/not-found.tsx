'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center space-y-6">
      
      {/* Brand Header */}
      <div className="text-[24px] font-bold font-sans text-red-600 tracking-tight">
        PersonaIQ
      </div>

      <div className="space-y-3 max-w-md bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
          EXCEPTION CAUGHT
        </span>

        <h1 className="text-[54px] font-extrabold text-red-600 font-sans leading-none">
          404
        </h1>

        <h2 className="text-[22px] font-bold text-gray-950 font-sans">
          Index Not Found
        </h2>

        <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
          The presence vector you are seeking does not exist within the current semantic space. It may have been relocated or successfully expunged.
        </p>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all space-x-2"
          >
            <span>← Return to Dashboard</span>
          </Link>
        </div>

        {/* Monospace Footer Trace */}
        <div className="pt-6 border-t border-gray-150 flex justify-between text-[11px] font-mono text-gray-400">
          <span>Trace ID: <strong className="text-gray-600">0x7A9B2F</strong></span>
          <span>Status: <strong className="text-gray-600">ERR_VOID</strong></span>
        </div>

      </div>

    </div>
  );
}
