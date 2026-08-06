'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function PresenceBoostsPage() {
  const boosts = [
    {
      id: 1,
      points: '+3.0',
      title: 'Master the strategic pause',
      desc: 'Pacing analysis indicates rushing during key transitions. Inserting deliberate 1.5-second pauses builds dramatic anticipation and authority.',
      difficulty: 'Medium',
      time: '5 Mins',
      confidence: '98%',
      isTop: true,
    },
    {
      id: 2,
      points: '+1.5',
      title: 'Optimize lighting for virtual calls',
      desc: 'Current camera feed shows heavy shadowing. Moving primary light source 45° to the right balances facial features.',
      difficulty: 'Easy',
      time: '2 Mins',
      confidence: '94%',
      isTop: false,
    },
    {
      id: 3,
      points: '+0.5',
      title: 'Standardize signature formatting',
      desc: 'Aligning email signature typography with organizational standards provides subtle visual discipline.',
      difficulty: 'Trivial',
      time: '1 Min',
      confidence: '88%',
      isTop: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-red-950 font-sans leading-tight">
          Presence Boosts™
        </h1>
        <p className="text-[14px] text-gray-600 font-medium max-w-xl leading-relaxed">
          High-impact, algorithmically sorted recommendations to elevate your professional presence immediately.
        </p>
      </div>

      {/* 3 Stacked Cards */}
      <div className="space-y-5">
        {boosts.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-[22px] p-6 shadow-xs relative overflow-hidden transition-all hover:border-gray-300 ${
              item.isTop ? 'border-l-4 border-l-red-600 border-gray-200' : 'border-gray-200'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              
              {/* Left Point Tag */}
              <div className="sm:col-span-3 space-y-0.5">
                <div className="flex items-baseline space-x-1 text-red-600">
                  <span className="text-[32px] font-extrabold font-sans leading-none">
                    {item.points}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                  PRESENCE PTS
                </span>
              </div>

              {/* Middle Title & Description */}
              <div className="sm:col-span-6 space-y-2">
                <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                  {item.title}
                </h3>
                <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
                  {item.desc}
                </p>
                <div className="flex items-center space-x-4 text-[11px] font-mono text-gray-500 pt-1">
                  <span>Difficulty: <strong className="text-gray-900">{item.difficulty}</strong></span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Time: <strong className="text-gray-900">{item.time}</strong></span>
                  </span>
                </div>
              </div>

              {/* Right Analysis Confidence Box */}
              <div className="sm:col-span-3 bg-gray-50 border border-gray-200 rounded-[16px] p-3 text-center space-y-0.5">
                <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-wider block">
                  ANALYSIS
                </span>
                <span className="text-[20px] font-bold text-gray-950 font-sans block">
                  {item.confidence}
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">
                  Confidence
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/journey/presence-index"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Presence Index</span>
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
