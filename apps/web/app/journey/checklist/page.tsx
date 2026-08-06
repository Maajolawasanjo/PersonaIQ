'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PreparationChecklistPage() {
  const [checkedIds, setCheckedIds] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const items = [
    { id: 1, title: 'Steam blazer', desc: 'Ensure absolute crispness for visual authority.' },
    { id: 2, title: 'Polish shoes', desc: 'Details convey precision and competence.' },
    { id: 3, title: 'Review executive summary', desc: 'Internalize core metrics before engagement.' },
    { id: 4, title: 'Confirm equipment configuration', desc: 'Verify neural link and visual aids.' },
    { id: 5, title: 'Hydration protocol', desc: 'Consume 500ml water for vocal clarity.' },
    { id: 6, title: 'Vocal resonance calibration', desc: 'Complete the 2-minute pitch exercise.' },
    { id: 7, title: 'Final postural check', desc: 'Align spine and engage core mechanics.' },
    { id: 8, title: 'Sleep before 11 PM', desc: 'Critical for cognitive restoration cycle.' },
  ];

  const toggleCheck = (id: number) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const count = checkedIds.length;
  const progressPercent = (count / items.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-4">
      {/* Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-gray-950 font-sans leading-tight">
          Final Preparation
        </h1>
        <p className="text-[13.5px] text-gray-600 font-medium">
          Review these final parameters to ensure optimal presence synthesis.
        </p>
      </div>

      {/* Progress Card (Matching Screenshot 4) */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            READINESS INDEX
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-[22px] font-bold text-gray-950 font-sans leading-none">
              {count}
            </span>
            <span className="text-[13px] font-mono text-gray-500">/ 8</span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 8 Square Checkbox Cards */}
      <div className="space-y-3">
        {items.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`bg-white border rounded-[16px] p-4 shadow-xs flex items-center space-x-4 cursor-pointer transition-all ${
                isChecked
                  ? 'border-gray-200 text-gray-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-gray-300 text-transparent bg-white'
                }`}
              >
                ✓
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-bold text-gray-950 font-sans">
                  {item.title}
                </h3>
                <p className="text-[12px] text-gray-500 font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-end pt-4">
        <Link
          href="/journey/complete"
          className="h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[8px] shadow-sm transition-all flex items-center space-x-2"
        >
          <span>Complete Journey</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
