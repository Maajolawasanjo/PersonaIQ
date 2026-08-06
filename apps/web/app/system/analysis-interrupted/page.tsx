'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function AnalysisInterruptedPage() {
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-md w-full space-y-6 flex flex-col items-center">
        
        {/* Warning Triangle Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-650" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold text-gray-950 font-sans">
            Analysis Interrupted
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            We encountered an unexpected issue while processing your data. This is typically a temporary connection problem and no data has been lost.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 w-full pt-1">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <RotateCw className="w-4 h-4 text-white shrink-0" />
            <span>Retry Analysis</span>
          </button>

          <Link
            href="/support"
            className="flex-1 h-11 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center"
          >
            Contact Support
          </Link>
        </div>

        {/* Technical Details Accordion */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] flex items-center justify-between text-[11px] font-mono text-gray-600 font-bold"
          >
            <span>TECHNICAL DETAILS</span>
            <span>{showTechDetails ? '˅' : '˃'}</span>
          </button>

          {showTechDetails && (
            <div className="p-3 mt-1 bg-gray-950 text-red-400 font-mono text-[11px] rounded-[8px] text-left overflow-x-auto">
              <code>ERR_PIPELINE_INTERRUPT: Timeout during skin tone reflectance matrix generation.</code>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
