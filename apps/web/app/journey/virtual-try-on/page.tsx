'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ZoomIn, RotateCw, ArrowRight } from 'lucide-react';

export default function VirtualTryOnPage() {
  const [selectedOutfit, setSelectedOutfit] = useState<number>(1);

  const wardrobeOptions = [
    {
      id: 1,
      name: 'Executive Minimalist',
      tag: 'Charcoal / High Contrast',
      image: '/images/brown-peaked-lapel-suit.jpg',
    },
    {
      id: 2,
      name: 'Startup Approachable',
      tag: 'Navy / Soft Tonal',
      image: '/images/ascot-knit-polo-tan.jpg',
    },
    {
      id: 3,
      name: 'Architectural Form',
      tag: 'Burgundy / Structured',
      image: '/images/563018699011466.jpeg',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Main Grid: Control Panel (Left) + Futuristic Showroom Avatar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Control Card */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[24px] p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              ANALYSIS
            </span>
            <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
              Virtual Try-On™
            </h1>
            <p className="text-[13px] text-gray-600 font-medium">
              Select a look to evaluate its impact on your projected presence.
            </p>
          </div>

          {/* Generating Status Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-3.5 flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-red-650 animate-pulse shrink-0" />
            <span className="text-[12.5px] font-mono font-bold text-gray-900">
              Generating realistic fit...
            </span>
          </div>

          {/* Wardrobe Options List */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              WARDROBE OPTIONS
            </span>

            {wardrobeOptions.map((opt) => {
              const isSelected = selectedOutfit === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOutfit(opt.id)}
                  className={`p-3 rounded-[16px] border transition-all cursor-pointer flex items-center space-x-3.5 ${
                    isSelected
                      ? 'border-2 border-red-600 bg-red-50/10 ring-2 ring-red-100'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-gray-100 shrink-0">
                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">
                      {opt.name}
                    </h3>
                    <p className="text-[11.5px] text-gray-500 font-mono">
                      {opt.tag}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-2">
            <Link
              href="/journey/compare-looks"
              className="w-full h-12 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue to Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              className="w-full h-10 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[10px] border border-gray-200 transition-colors"
            >
              Save to Wardrobe
            </button>
          </div>
        </div>

        {/* Right Futuristic Showroom Avatar Room */}
        <div className="lg:col-span-7 bg-gray-100 border border-gray-200 rounded-[24px] overflow-hidden shadow-xs relative min-h-[560px] flex flex-col justify-between p-6">
          {/* Top Room Header */}
          <div className="flex items-center justify-between text-[13px] font-sans text-gray-700">
            <span className="font-bold">Presence Journey</span>
            <div className="flex items-center space-x-2 text-[14px]">
              <button type="button" className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-gray-900">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-gray-900">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Avatar Preview */}
          <div className="absolute inset-0 flex items-center justify-center pt-8 pb-16 pointer-events-none">
            <img
              src="/images/563018699011466.jpeg"
              alt="Avatar Virtual Fitting Room"
              className="max-h-[460px] object-contain drop-shadow-xl rounded-[20px]"
            />
          </div>

          {/* Bottom Telemetry Overlay */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-gray-200 p-3 rounded-[18px] shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-red-600 flex items-center justify-center text-[15px] font-bold text-gray-950 font-sans">
                92
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">
                  PRESENCE INDEX™
                </span>
                <span className="text-[12.5px] font-bold text-gray-900 font-sans">
                  High Authority
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-500 bg-gray-50 px-3 py-1.5 rounded-[10px] border border-gray-150">
              Garment Details: Charcoal Tailored Suit | Size: M (42) | Try-On Active: <span className="text-emerald-700 font-bold">ON</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
