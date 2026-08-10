'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Monitor, Brain, Calendar, Check, Sparkles } from 'lucide-react';
import { generateGeminiStylistReasoning } from '@/lib/catalog/vtoCatalog';

export default function JourneySummaryPage() {
  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [outfitTitle, setOutfitTitle] = useState<string>('Executive Tailored Suit');
  const [outfitImage, setOutfitImage] = useState<string>('/vto/clothing/professional/01_navy_suit.jpg');
  const [score, setScore] = useState<number>(95);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';
      const savedTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Executive Tailored Suit';
      const savedPhoto = localStorage.getItem('personaiq_user_outfit_preview') || '/vto/clothing/professional/01_navy_suit.jpg';
      const savedScore = localStorage.getItem('personaiq_active_presence_score') || '95';

      setOccasion(savedOccasion);
      setOutfitTitle(savedTitle);
      setOutfitImage(savedPhoto);
      setScore(parseInt(savedScore, 10));

      const analysis = generateGeminiStylistReasoning(savedOccasion);
      setAiAnalysis(analysis);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* 1. Header with Title & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL JOURNEY TELEMETRY SUMMARY</span>
          </span>
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight capitalize">
            {occasion} Engagement Strategy
          </h1>
          <div className="flex items-center space-x-4 text-[12.5px] font-mono text-gray-500 pt-1">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Target Event: {occasion.toUpperCase()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telemetry Locked</span>
            </span>
          </div>
        </div>

        {/* Top Right CTAs */}
        <div className="flex items-center space-x-3">
          <Link
            href="/journey/export"
            className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all flex items-center justify-center"
          >
            Export Briefing PDF
          </Link>
          <button
            type="button"
            className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[8px] border border-gray-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-gray-500" />
            <span>Save Journey</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Presence Index Card */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-6">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            AI COMPOSURE SCAN
          </span>

          <h2 className="text-[20px] font-bold text-gray-950 font-sans">
            Presence Index™
          </h2>

          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="w-40 h-40 rounded-full border-[8px] border-red-100 border-t-red-600 border-r-red-600 flex items-center justify-center relative shadow-inner">
              <span className="text-[44px] font-extrabold text-gray-950 font-sans leading-none">
                {score}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100 text-[13px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">AI Confidence</span>
              <span className="font-bold text-gray-950">96%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                Executive Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Winning Outfit & Key Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Winning Outfit Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Left Outfit Image */}
            <div className="sm:col-span-5 relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-gray-950 border border-gray-200">
              <img
                src={outfitImage}
                alt="Winning Outfit"
                className="w-full h-full object-contain p-2"
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-gray-900 bg-white/90 px-2.5 py-1 rounded border border-gray-200">
                {score}% Match
              </span>
            </div>

            {/* Right Details */}
            <div className="sm:col-span-7 space-y-4">
              <h3 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
                {outfitTitle}
              </h3>

              <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
                {aiAnalysis?.reasoning?.summary || `This ensemble projects authority and composure customized for ${occasion.toUpperCase()}.`}
              </p>

              <div className="space-y-2 text-[12.5px] font-sans text-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>{outfitTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Coordinated Footwear & Accessories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Verified T-Zone Edge Grooming</span>
                </div>
              </div>
            </div>

          </div>

          {/* Key Recommendations Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              GEMINI AI DIRECTIVES
            </span>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">
              Key Recommendations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-150 rounded-[16px] p-4 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Monitor className="w-4 h-4 text-red-600" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                    Recommended Protocol
                  </h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">
                    {aiAnalysis?.reasoning?.recommended_protocol || 'Maintain clean collar framing and structured shoulder alignment.'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-150 rounded-[16px] p-4 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                    Avoid Protocol
                  </h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">
                    {aiAnalysis?.reasoning?.avoid_protocol || 'Avoid uncoordinated footwear or unbuttoned collars without jacket structure.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Centered Home Action */}
      <div className="pt-4 flex justify-center">
        <Link
          href="/dashboard"
          className="h-10 px-6 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all"
        >
          Return to Dashboard
        </Link>
      </div>

    </div>
  );
}
