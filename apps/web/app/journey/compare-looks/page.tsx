'use client';

import React from 'react';
import Link from 'next/link';

export default function CompareLooksPage() {
  const items = [
    {
      id: 1,
      rank: 'RANK #1',
      confidence: '96%',
      status: '✔ Excellent Match',
      isWinner: true,
      image: '/images/563018699011466.jpeg',
      summary:
        'Outfit 1 aligns perfectly with the expected dress code for an academic keynote. The structured silhouette conveys intellectual authority, while the subtle tonal contrast maintains approachability without distracting from the content.',
    },
    {
      id: 2,
      rank: 'RANK #2',
      confidence: '84%',
      status: '✔ Strong Match',
      isWinner: false,
      image: '/images/casual-dress.jpg',
      summary:
        'Outfit 2 presents a highly acceptable alternative. The layering adds a dimension of modern tech-industry aesthetics, suitable for panel discussions, though it may read as slightly too informal for a primary keynote address.',
    },
    {
      id: 3,
      rank: 'RANK #3',
      confidence: '72%',
      status: '? Viable Option',
      isWinner: false,
      image: '/images/instagram-style.jpg',
      summary:
        'Outfit 3 leans heavily into avant-garde minimalism. While architecturally interesting and highly memorable, it departs slightly from traditional academic expectations and may draw undue attention away from the speaker\'s core message.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-4 text-center">
      
      {/* Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-gray-950 font-sans leading-tight">
          Final Evaluation
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Side-by-side analysis of your generated visual presence profiles. Review technical rankings and suitability for your target academic environment.
        </p>
      </div>

      {/* 3 Outfit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-[22px] p-4 shadow-xs space-y-4 hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.rank}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-gray-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded border border-gray-200">
                @ ANALYSIS
              </span>
            </div>

            {/* Rank & Confidence Row */}
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">
                    {item.rank}
                  </span>
                  <span className="text-[24px] font-black text-gray-950 font-sans leading-none">
                    #{item.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wider">
                    CONFIDENCE
                  </span>
                  <span className="text-[20px] font-bold text-gray-950 font-sans leading-none">
                    {item.confidence}
                  </span>
                </div>
              </div>

              {/* Status Header */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-[15px] text-gray-950 font-sans">
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
          className="h-12 px-9 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-[14px] rounded-[10px] shadow-md transition-all flex items-center space-x-2"
        >
          <span>Generate My Presence Plan</span>
          <span>→</span>
        </Link>
      </div>

    </div>
  );
}
