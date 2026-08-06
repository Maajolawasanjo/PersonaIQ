'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RotateCcw, HardDriveDownload } from 'lucide-react';

export default function NoInternetConnectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 sm:p-10 shadow-xs max-w-md w-full space-y-6 flex flex-col items-center">
        
        {/* Wifi Disconnected Icon */}
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
          <WifiOff className="w-8 h-8" />
        </div>

        {/* System Status Tag */}
        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-0.5 rounded uppercase tracking-wider">
          SYSTEM STATUS
        </span>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
            Connection Lost
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            A network connection is required to process new journeys and sync telemetry data with PersonaIQ servers.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 w-full pt-1">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>

          <Link
            href="/system/offline"
            className="flex-1 h-11 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-colors flex items-center justify-center space-x-1.5"
          >
            <HardDriveDownload className="w-4 h-4 text-gray-600" />
            <span>Work Offline</span>
          </Link>
        </div>

        {/* Monospace Footer */}
        <div className="pt-4 border-t border-gray-150 w-full flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>ERR_NET_DISCONNECTED</span>
          <span>● Local Cache Active</span>
        </div>

      </div>

    </div>
  );
}
