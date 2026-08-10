'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { generateGeminiStylistReasoning } from '@/lib/catalog/vtoCatalog';

export default function AIRecommendationsPage() {
  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [outfitTitle, setOutfitTitle] = useState<string>('Executive Tailored Suit');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';
      const savedTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Executive Tailored Suit';
      const skinUndertone = localStorage.getItem('personaiq_skin_undertone') || 'Warm';

      setOccasion(savedOccasion);
      setOutfitTitle(savedTitle);

      const dynamicAnalysis = generateGeminiStylistReasoning(savedOccasion);

      setRecommendations([
        {
          id: 1,
          priority: 'HIGH PRIORITY',
          title: `Press & Structure ${savedTitle}`,
          impact: 'High Impact',
          confidence: '96% AI Alignment',
          time: '5 mins',
          reason: dynamicAnalysis.reasoning.summary,
        },
        {
          id: 2,
          priority: 'RECOMMENDED PROTOCOL',
          title: 'Grooming & Lighting Alignment',
          impact: 'High Impact',
          confidence: '94% AI Alignment',
          time: '3 mins',
          reason: dynamicAnalysis.reasoning.recommended_protocol,
        },
        {
          id: 3,
          priority: 'AVOID PROTOCOL',
          title: 'Color & Contrast Guardrail',
          impact: 'Critical Guardrail',
          confidence: '98% AI Alignment',
          time: '2 mins',
          reason: dynamicAnalysis.reasoning.avoid_protocol,
        },
      ]);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>AI REASONING ENGINE</span>
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
          Targeted presence protocols for <span className="uppercase text-red-600">{occasion}</span>.
        </h2>
        <p className="text-[13.5px] text-gray-600 font-medium">
          These explainable AI recommendations yield the highest impact on your overall composure index.
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
              <span className="text-[10.5px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
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
              <span>Reasoning Model: Gemini Stylist Llama-3 Vision</span>
              <span className="font-bold text-gray-900">{item.confidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/journey/choose-outfit"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
          <span>Back to Outfit Selection</span>
        </Link>
        <Link
          href="/journey/presence-index"
          className="h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>View Presence Index</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
