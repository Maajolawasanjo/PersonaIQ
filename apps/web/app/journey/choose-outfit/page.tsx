'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ChooseOutfitPage() {
  const [selectedOutfit, setSelectedOutfit] = useState('charcoal');

  const outfits = [
    {
      id: 'charcoal',
      title: 'Executive Brown Peaked Ensemble',
      fit: 'Presence Index™ Fit: High',
      image: '/images/brown-peaked-lapel-suit.jpg',
      isHero: true,
    },
    {
      id: 'tan_ascot',
      title: 'Smart Casual Tan Ascot Knit',
      fit: 'Presence Index™ Fit: Moderate',
      image: '/images/ascot-knit-polo-tan.jpg',
      isHero: false,
    },
    {
      id: 'senator',
      title: 'Formal Senator Suit',
      fit: 'Presence Index™ Fit: High',
      image: '/images/african-senator-suit.jpg',
      isHero: false,
    },
    {
      id: 'winter',
      title: 'Premium Winter Casual',
      fit: 'Presence Index™ Fit: High',
      image: '/images/premium-winter-casual.jpg',
      isHero: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-center py-6">
      {/* 1. Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Choose Your Outfit
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium">
          Final step of the Presence Journey. Select the attire that best aligns with your target persona for the upcoming engagement.
        </p>
      </div>

      {/* 2. Top Grid Row: Upload Card + Main Hero Card */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 max-w-3xl mx-auto items-stretch">
        
        {/* VTO Studio Launch Card */}
        <Link
          href="/wardrobe/style-me"
          className="sm:col-span-4 bg-red-50 border border-red-200 hover:border-red-300 rounded-[20px] p-6 text-center space-y-3 flex flex-col items-center justify-center min-h-[220px] shadow-xs cursor-pointer transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span className="text-[16px] font-bold text-red-950 block font-sans">VTO Studio</span>
          <span className="text-[12px] text-red-800/80 block font-medium">Virtual Try-On & AI Stylist</span>
        </Link>

        {/* Hero Current Selection Card */}
        <div
          onClick={() => setSelectedOutfit('charcoal')}
          className={`sm:col-span-8 bg-white rounded-[20px] overflow-hidden shadow-xs border-2 text-left cursor-pointer transition-all ${
            selectedOutfit === 'charcoal' ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
          }`}
        >
          <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
            <img src="/images/brown-peaked-lapel-suit.jpg" alt="Executive Brown Peaked Ensemble" className="w-full h-full object-cover object-top" />
            
            {/* Top Red Dot Tag Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[11px] font-mono font-bold text-gray-900 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>CURRENT SELECTION</span>
            </div>
          </div>

          <div className="p-5 space-y-1 bg-white">
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">
              Executive Brown Peaked Ensemble
            </h3>
            <div className="flex items-center space-x-1.5 text-[12px] font-mono text-gray-500">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
              <span>Presence Index™ Fit: High</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Bottom 3 Card Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
        {outfits.filter(o => !o.isHero).map((outfit) => {
          const isSelected = selectedOutfit === outfit.id;
          return (
            <div
              key={outfit.id}
              onClick={() => setSelectedOutfit(outfit.id)}
              className={`bg-white rounded-[20px] overflow-hidden shadow-xs border cursor-pointer transition-all ${
                isSelected ? 'border-2 border-primary shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-1 bg-white">
                <h4 className="text-[14.5px] font-bold text-gray-950 font-sans leading-tight">
                  {outfit.title}
                </h4>
                <div className="text-[11.5px] font-mono text-gray-500">
                  {outfit.fit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Primary CTA Button */}
      <div className="pt-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link
          href="/journey/image-validation"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center"
        >
          ← Validation
        </Link>
        <Link
          href="/journey/style-compare"
          className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <span>Continue to Style Compare</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
