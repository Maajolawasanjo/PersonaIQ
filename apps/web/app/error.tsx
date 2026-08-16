'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CloudLightning, RotateCw, ArrowLeft } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showHash, setShowHash] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 sm:p-10 shadow-xs max-w-lg w-full space-y-5">
        
        {/* System Error Tag */}
        <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-flex items-center space-x-1.5 mx-auto">
          <CloudLightning className="w-3.5 h-3.5 text-red-650 shrink-0" />
          <span>SYSTEM ERROR</span>
        </span>

        {/* Big 500 Number */}
        <h1 className="text-[64px] font-extrabold text-gray-950 font-sans leading-none tracking-tight">
          500
        </h1>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-[24px] font-bold text-gray-950 font-sans">
            Internal Server Anomaly
          </h2>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            Our cognitive engines have encountered an unexpected interruption. We are currently stabilizing the environment. Please allow a moment before attempting to proceed.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <RotateCw className="w-4 h-4 text-white shrink-0" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 shrink-0" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Diagnostic Hash Accordion */}
        <div className="pt-4 border-t border-gray-150">
          <button
            type="button"
            onClick={() => setShowHash(!showHash)}
            className="text-[12px] font-mono text-gray-500 hover:text-gray-900 inline-flex items-center space-x-1"
          >
            <span>View Diagnostic Hash</span>
            <span>{showHash ? '˄' : '˅'}</span>
          </button>

          {showHash && (
            <div className="mt-2 p-3 bg-gray-950 text-emerald-400 font-mono text-[11px] rounded-[8px] text-left overflow-x-auto space-y-1">
              <code className="block text-gray-400"># digest: {error?.digest || '0x98A1F_ERR_500'}</code>
              <code className="block text-red-400 whitespace-pre-wrap break-all">{error?.message || 'ERR_NEURAL_PIPELINE_TIMEOUT'}</code>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
