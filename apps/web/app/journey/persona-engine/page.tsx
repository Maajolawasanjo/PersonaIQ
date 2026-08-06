'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';

export default function PersonaEngineProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/journey/presence-index');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-sm flex flex-col items-center">
        
        {/* Red Circular Icon with Brain */}
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-xs animate-pulse">
          <Brain className="w-6 h-6 text-red-650" />
        </div>

        {/* Brand Title */}
        <h1 className="text-[28px] font-bold text-gray-950 font-sans tracking-tight">
          PersonaIQ
        </h1>

        {/* Subtitle */}
        <p className="text-[13.5px] text-gray-500 font-mono">
          Plan Ready.
        </p>

        {/* Red Progress Bar Line */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-red-600 animate-pulse w-full rounded-full" />
        </div>

      </div>
    </div>
  );
}
