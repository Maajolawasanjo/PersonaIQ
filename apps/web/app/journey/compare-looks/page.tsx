'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { VTO_CATALOG, getRecommendedAssets, generateGeminiStylistReasoning } from '@/lib/catalog/vtoCatalog';

export default function CompareLooksPage() {
  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';
      const userSelectedPhoto = localStorage.getItem('personaiq_user_outfit_preview');
      const userSelectedTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Executive Tailored Suit';
      const userScore = localStorage.getItem('personaiq_active_presence_score') || '96';

      setOccasion(savedOccasion);

      const recommendedClothing = getRecommendedAssets(savedOccasion, 'clothing');
      const alt1 = recommendedClothing[1] || VTO_CATALOG[1];
      const alt2 = recommendedClothing[2] || VTO_CATALOG[2];

      const mainAnalysis = generateGeminiStylistReasoning(savedOccasion);

      setItems([
        {
          id: 1,
          rank: 'RANK #1 (PRIMARY SELECTION)',
          confidence: `${userScore}%`,
          status: '✔ Winner - Highest Alignment',
          isWinner: true,
          title: userSelectedTitle,
          image: userSelectedPhoto || recommendedClothing[0]?.image_url || '/vto/clothing/professional/01_navy_suit.jpg',
          summary: mainAnalysis.reasoning.summary,
        },
        {
          id: 2,
          rank: 'RANK #2 (ALTERNATIVE)',
          confidence: '88%',
          status: '✔ Strong Alternative',
          isWinner: false,
          title: alt1.name,
          image: alt1.image_url,
          summary: `Alternative look using ${alt1.name}. Maintains high formality for ${savedOccasion.toUpperCase()} while offering a slightly more approachable vibe.`,
        },
        {
          id: 3,
          rank: 'RANK #3 (ALTERNATIVE)',
          confidence: '78%',
          status: '✔ Smart Casual Option',
          isWinner: false,
          title: alt2.name,
          image: alt2.image_url,
          summary: `Leans into modern relaxed tailoring with ${alt2.name}. Suitable for secondary break-out sessions during ${savedOccasion.toUpperCase()}.`,
        },
      ]);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-4 text-center">
      
      {/* Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 uppercase inline-flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-TIME AI COMPARISON ENGINE</span>
        </span>
        <h1 className="text-[32px] sm:text-[38px] font-bold text-gray-950 font-sans leading-tight">
          Final Outfit Evaluation
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Side-by-side analysis of your primary choice vs catalog alternatives for <strong className="text-gray-950 uppercase">{occasion}</strong>.
        </p>
      </div>

      {/* 3 Outfit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-[22px] p-4 shadow-xs space-y-4 transition-all flex flex-col justify-between ${
              item.isWinner ? 'border-2 border-red-600 shadow-md ring-2 ring-red-500/10' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-gray-950 border border-gray-200">
              <img
                src={item.image}
                alt={item.rank}
                className="w-full h-full object-contain p-2"
              />
              <span className={`absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded border shadow-xs ${
                item.isWinner ? 'bg-red-600 text-white border-red-700' : 'bg-white/90 text-gray-800 border-gray-200'
              }`}>
                {item.isWinner ? '★ WINNER' : 'CATALOG OPTION'}
              </span>
            </div>

            {/* Rank & Confidence Row */}
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">
                    {item.rank}
                  </span>
                  <span className="text-[15px] font-bold text-gray-950 font-sans truncate block max-w-[140px]">
                    {item.title}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">
                    SCORE
                  </span>
                  <span className="text-[20px] font-extrabold text-red-600 font-sans leading-none">
                    {item.confidence}
                  </span>
                </div>
              </div>

              {/* Status Header */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-[14px] text-gray-950 font-sans">
                  <span className={item.isWinner ? 'text-red-600' : 'text-gray-600'}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 font-normal leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Centered Action CTA */}
      <div className="pt-4 flex justify-center">
        <Link
          href="/journey/presence-index"
          className="h-12 px-9 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-[10px] shadow-md transition-all flex items-center space-x-2"
        >
          <span>Proceed to Presence Index™</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
