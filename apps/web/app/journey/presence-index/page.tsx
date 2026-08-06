'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function PresenceIndexPage() {
  const [doneActions, setDoneActions] = useState<number[]>([]);

  const toggleDone = (id: number) => {
    if (doneActions.includes(id)) {
      setDoneActions(doneActions.filter((item) => item !== id));
    } else {
      setDoneActions([...doneActions, id]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-4">
      
      {/* 1. PRESENCE INDEX™ Hero Card (Matching Screenshot 4) */}
      <div className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-xs text-center space-y-6">
        <span className="text-[11px] font-mono font-bold text-gray-500 tracking-wider uppercase block">
          PRESENCE INDEX™
        </span>

        {/* Circular Glowing Ring Gauge */}
        <div className="inline-flex flex-col items-center justify-center relative my-2">
          <div className="w-44 h-44 rounded-full border-[10px] border-primary/20 border-t-primary border-r-primary flex flex-col items-center justify-center bg-white shadow-lg relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary/40 animate-pulse pointer-events-none" />
            <span className="text-[48px] font-extrabold text-gray-950 font-sans leading-none">
              92
            </span>
            <span className="text-[11px] font-mono font-bold text-red-600 tracking-wider uppercase mt-1">
              EXCELLENT
            </span>
          </div>
        </div>

        <p className="text-[13.5px] text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
          Your overall presence score is exceptionally high, indicating strong readiness for critical engagements.
        </p>
      </div>

      {/* 2. Presence Recommendations Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-[24px] font-bold text-gray-950 font-sans">
            Presence Recommendations
          </h2>
          <span className="text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 uppercase">
            2 ACTIONS
          </span>
        </div>

        {/* Card 1: Iron your blazer */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs relative overflow-hidden space-y-4 border-l-4 border-l-red-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold text-white bg-[#5c0612] px-2.5 py-0.5 rounded uppercase tracking-wider">
                HIGH IMPACT
              </span>
              <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-gray-400" />
                <span>94% Confidence</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>TIME REQ ~15 mins</span>
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-[20px] font-bold text-gray-950 font-sans">
              Iron your blazer before tomorrow&apos;s interview
            </h3>
            
            {/* Inner Sub-Card Analysis */}
            <div className="bg-gray-50 border border-gray-150 rounded-[14px] p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                ANALYSIS
              </span>
              <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
                Wrinkle-free clothing improves perceived professionalism and attention to detail, crucial for first impressions in corporate environments.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => toggleDone(1)}
              className={`h-9 px-5 text-[12.5px] font-bold rounded-[8px] border transition-colors ${
                doneActions.includes(1)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {doneActions.includes(1) ? '✓ Completed' : 'Mark Done'}
            </button>
          </div>
        </div>

        {/* Card 2: Polish your shoes */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                EASY WIN
              </span>
              <span className="text-[10.5px] font-mono font-bold text-red-600">
                +3 Points
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>TIME REQ ~5 mins</span>
            </span>
          </div>

          <h3 className="text-[18px] font-bold text-gray-950 font-sans">
            Polish your shoes
          </h3>
        </div>

      </div>

      {/* 3. Bottom Next CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/journey/compare-looks"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Final Evaluation</span>
        </Link>
        <Link
          href="/journey/presence-plan"
          className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>View Best Presence Plan™</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
