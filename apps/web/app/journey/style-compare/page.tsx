'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Pencil, Trash2 } from 'lucide-react';

export default function StyleComparePage() {
  const [selectedOutfit, setSelectedOutfit] = useState<number>(1);
  const outfits = [
    {
      id: 1,
      name: 'Executive Charcoal Ensemble',
      image: '/images/brown-peaked-lapel-suit.jpg',
      matchScore: '92% Match',
      desc: 'High-contrast, authoritative look suitable for keynotes and executive board meetings.',
    },
    {
      id: 2,
      name: 'Smart Casual Navy',
      image: '/images/ascot-knit-polo-tan.jpg',
      matchScore: '78% Match',
      desc: 'Approachable yet sharp. Ideal for workshops and less formal networking events.',
    },
    {
      id: 3,
      name: 'Formal Academic',
      image: '/images/563018699011466.jpeg',
      matchScore: '85% Match',
      desc: 'Traditional and distinguished. Perfect for panel discussions or guest lectures.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* 1. Header with Back Arrow & Title */}
      <div className="flex items-start space-x-4 border-b border-gray-100 pb-4">
        <Link
          href="/journey/choose-outfit"
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors mt-1 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>
        <div className="space-y-0.5">
          <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
            Style Compare™
          </h1>
          <p className="text-[13.5px] text-gray-500 font-medium">
            Compare how each outfit fits your event before making a decision.
          </p>
        </div>
      </div>

      {/* 2. Stepper Pill Bar */}
      <div className="bg-gray-50 border border-gray-150 rounded-[12px] p-3 flex items-center space-x-6 text-[11.5px] font-mono font-bold text-gray-500">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
            1
          </span>
          <span>UPLOAD</span>
        </div>
        <span>&gt;</span>
        <div className="flex items-center space-x-2 bg-primary text-white px-3 py-1 rounded-full shadow-xs">
          <span className="w-4 h-4 rounded-full bg-white text-primary flex items-center justify-center text-[9px]">
            2
          </span>
          <span>COMPARE</span>
        </div>
        <span>&gt;</span>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
            3
          </span>
          <span>VIRTUAL TRY-ON</span>
        </div>
      </div>

      {/* 3. Main 3 Cards Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {outfits.map((outfit) => {
          const isSelected = selectedOutfit === outfit.id;
          return (
            <div
              key={outfit.id}
              onClick={() => setSelectedOutfit(outfit.id)}
              className={`bg-white border rounded-[22px] overflow-hidden p-4 shadow-xs cursor-pointer transition-all relative space-y-3.5 ${
                isSelected
                  ? 'border-2 border-primary ring-2 ring-primary/10 scale-[1.01]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Top Card Image Area */}
              <div className="relative h-64 w-full rounded-[16px] overflow-hidden bg-gray-100">
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  className="w-full h-full object-cover"
                />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Edit / Delete Icons */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  <button type="button" className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-750 hover:bg-white shadow-xs transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-650 hover:bg-white shadow-xs transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Meta & Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 tracking-wider uppercase">
                    ANALYSIS
                  </span>
                  <span className="text-[11px] font-mono font-bold text-gray-500">
                    {outfit.matchScore}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-gray-950 font-sans leading-tight">
                  {outfit.name}
                </h3>
                
                <p className="text-[12.5px] text-gray-500 font-normal leading-relaxed">
                  {outfit.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom CTAs Bar */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          className="h-11 px-6 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-[13px] rounded-[10px] border border-gray-200 transition-colors"
        >
          Add Another Outfit
        </button>
        <Link
          href="/journey/virtual-try-on"
          className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center"
        >
          Start Virtual Try-On
        </Link>
      </div>

    </div>
  );
}
