'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Save, FileText, Sparkles } from 'lucide-react';

export default function BestPresencePlanPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Steam blazer & trousers', done: true },
    { id: 2, text: 'Polish oxford shoes', done: true },
    { id: 3, text: 'Charge primary mobile device', done: true },
    { id: 4, text: 'Review briefing documents', done: true },
    { id: 5, text: 'Confirm travel itinerary', done: true },
    { id: 6, text: 'Prepare concise intro statement', done: true },
    { id: 7, text: 'Hydrate (500ml water)', done: false, time: 'Estimated time: 5 mins' },
    { id: 8, text: 'Final mirror check', done: false, time: 'Estimated time: 2 mins' },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const doneCount = checklist.filter((item) => item.done).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Top Header & Right Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start border-b border-gray-100 pb-6">
        
        {/* Left Title & Subtitle */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-red-650 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ANALYSIS COMPLETE</span>
            </span>
          </div>
          <h1 className="text-[34px] font-bold text-gray-950 font-sans leading-tight">
            Best Presence Plan™
          </h1>
          <p className="text-[14px] text-gray-600 font-medium">
            Your optimal preparation strategy for today&apos;s executive review.
          </p>
        </div>

        {/* Right Metrics Box */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-[18px] p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
              PRESENCE INDEX™
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-[28px] font-black text-gray-950 font-sans leading-none">
                92
              </span>
              <span className="text-[12px] font-mono text-gray-500">/ 100</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full border-4 border-red-500 border-t-red-200 flex items-center justify-center text-red-600">
            <Check className="w-4 h-4 text-red-600" />
          </div>

          <div className="border-l border-gray-200 pl-4 space-y-1 text-right">
            <div>
              <span className="text-[9.5px] font-mono text-gray-500 uppercase block">RECOMMENDED ARRIVAL</span>
              <span className="text-[13px] font-bold text-gray-950 font-sans">8:45 AM</span>
            </div>
            <div>
              <span className="text-[9.5px] font-mono text-gray-500 uppercase block">PREP WINDOW</span>
              <span className="text-[13px] font-bold text-gray-950 font-sans">45 mins</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main 2-Column Content: Winning Outfit Flatlay (Left) vs Preparation Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Left Column: The Winning Outfit & Analysis Card */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Winning Outfit Flatlay Image */}
          <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
            <img
              src="/images/brown-peaked-lapel-suit.jpg"
              alt="The Winning Outfit"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-4 left-4 text-[11px] font-mono font-bold text-gray-900 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm uppercase tracking-wider">
              THE WINNING OUTFIT
            </span>
          </div>

          {/* Analysis Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-600 bg-white px-2.5 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
              ANALYSIS
            </span>

            <h3 className="text-[20px] font-bold text-gray-950 font-sans">
              Why This Look Succeeds
            </h3>

            <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
              The selected charcoal suit paired with a crisp white shirt provides a high-contrast, authoritative baseline suitable for executive engagements. The subtle integration of the MIT Red pocket square introduces a calculated element of dynamism and confidence without overpowering the core academic aesthetic.
            </p>

            <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
              Predictive modeling indicates this specific combination optimizes perceived competence and approachability, aligning perfectly with the room&apos;s projected psychometric profile.
            </p>
          </div>

        </div>

        {/* Right Column: Preparation Checklist */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-4">
            
            {/* Checklist Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                Preparation
              </h3>
              <span className="text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
                {doneCount}/{checklist.length} Done
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between ${
                    item.done
                      ? 'bg-red-50/20 border-red-100 text-red-900 line-through'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.done
                          ? 'bg-red-600 text-white'
                          : 'border border-gray-300 text-transparent'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className="text-[13px] font-sans block">{item.text}</span>
                      {item.time && (
                        <span className="text-[10px] font-mono text-gray-400 block font-sans">
                          {item.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 space-y-2">
              <Link
                href="/journey/complete"
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Presence Plan</span>
              </Link>
              <button
                type="button"
                className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[10px] border border-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Export PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
