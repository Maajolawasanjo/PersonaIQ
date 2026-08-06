'use client';

import React from 'react';

export default function GlobalLoadingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex items-center space-x-2">
        <span className="text-[22px] font-bold font-sans text-white tracking-tight">PersonaIQ</span>
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
      </div>
      <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/10">
        <div className="h-full bg-primary animate-pulse w-2/3 rounded-full" />
      </div>
      <p className="text-[12.5px] font-mono text-gray-400">
        Preparing your Presence Plan...
      </p>
    </div>
  );
}
