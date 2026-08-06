'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AIRecommendationsPage() {
  const recommendations = [
    {
      id: 1,
      priority: 'HIGH PRIORITY',
      title: 'Steam & Press Blazer Collar',
      impact: 'High Impact',
      confidence: '94% Confidence',
      time: '5 mins',
      reason: 'Wrinkle-free clothing significantly improves perceived executive composure and attention to detail.',
    },
    {
      id: 2,
      priority: 'MEDIUM PRIORITY',
      title: 'Adjust Key Light Angle to 45°',
      impact: 'Medium Impact',
      confidence: '91% Confidence',
      time: '2 mins',
      reason: 'Reduces harsh facial shadows under camera lighting, highlighting skin clarity.',
    },
    {
      id: 3,
      priority: 'MEDIUM PRIORITY',
      title: 'Polish Oxford Leather Shoes',
      impact: 'Medium Impact',
      confidence: '89% Confidence',
      time: '3 mins',
      reason: 'Ensures footwear aligns seamlessly with the formal dress code requirements.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold text-primary bg-red-50 border border-primary/20 px-2.5 py-0.5 rounded">
            STEP 14 OF 19
          </span>
          <h1 className="text-[20px] font-bold text-gray-950 font-sans">
            AI Recommendations™
          </h1>
        </div>
        <span className="text-[12px] font-mono text-gray-500">Explainable Coaching</span>
      </div>

      {/* Subtitle */}
      <div className="space-y-1">
        <h2 className="text-[28px] font-bold text-gray-950 font-sans leading-tight">
          Targeted presence enhancements.
        </h2>
        <p className="text-[13.5px] text-gray-600 font-medium">
          These explainable recommendations yield the highest impact on your overall composure index.
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-3 hover:border-gray-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold text-primary bg-red-50 border border-primary/20 px-2.5 py-0.5 rounded">
                {item.priority}
              </span>
              <div className="flex items-center space-x-3 text-[11.5px] font-mono text-gray-500">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.impact}
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{item.time}</span>
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-bold text-gray-950 font-sans">
                {item.title}
              </h3>
              <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed">
                {item.reason}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-mono text-gray-500">
              <span>Reasoning Model</span>
              <span className="font-bold text-gray-900">{item.confidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/journey/persona-engine"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Engine Timeline</span>
        </Link>
        <Link
          href="/journey/presence-index"
          className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>View Presence Index</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
