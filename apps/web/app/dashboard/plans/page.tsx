'use client';

import React from 'react';

export default function SavedPlansPage() {
  const plans = [
    {
      id: 1,
      image: '/images/brown-peaked-lapel-suit.jpg',
      tag: 'INTERVIEW',
      score: '95% PRESENCE INDEX',
      title: 'VP Strategy Final Round',
      description: 'Charcoal tailored suit with a white poplin shirt. Authoritative yet...',
      requiredItems: [
        { name: 'Charcoal Wool Suit', checked: true },
        { name: 'Crisp White Poplin Shirt', checked: true },
      ],
    },
    {
      id: 2,
      image: '/images/ascot-knit-polo-tan.jpg',
      tag: 'KEYNOTE',
      score: '94% PRESENCE INDEX',
      title: 'MIT AI Summit',
      description: 'Elevated casual. Navy structured blazer over pristine crew neck...',
      requiredItems: [
        { name: 'Navy Unstructured Blazer', checked: true },
        { name: 'Minimalist Leather Sneakers', checked: false },
      ],
    },
    {
      id: 3,
      image: '/images/kaftan-3piece.jpg',
      tag: 'GALA',
      score: '99% PRESENCE INDEX',
      title: 'Industry Awards Dinner',
      description: 'Midnight blue formalwear with subtle contrasting lapels. Optimize...',
      requiredItems: [
        { name: 'Midnight Blue Tuxedo', checked: false },
        { name: 'Black Silk Bowtie', checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-[34px] sm:text-[40px] font-bold tracking-tight text-gray-950 font-sans">
          Saved Journeys
        </h1>
        <p className="text-[15px] text-gray-600 font-medium max-w-2xl">
          Your curated presence strategies and analytical recommendations. Review and refine your professional presentation.
        </p>
      </div>

      {/* 2. Three Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Image Banner + Red Bookmark Badge */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-primary">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                {/* Tag & Score */}
                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className="font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-[5px]">
                    {plan.tag}
                  </span>
                  <span className="font-extrabold text-primary">
                    {plan.score}
                  </span>
                </div>

                <h3 className="text-[20px] font-bold text-gray-950 font-sans leading-tight">
                  {plan.title}
                </h3>
                <p className="text-[13px] text-gray-600 font-normal leading-relaxed line-clamp-2">
                  {plan.description}
                </p>

                {/* Required Items Box */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-[12px] p-3.5 space-y-2 mt-4">
                  <span className="text-[10px] font-mono font-extrabold text-gray-700 tracking-wider uppercase block">
                    ⇆ REQUIRED ITEMS
                  </span>
                  <div className="space-y-1.5 text-[12px]">
                    {plan.requiredItems.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        {item.checked ? (
                          <div className="w-4 h-4 rounded-full bg-red-50 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                            ✓
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                        )}
                        <span className={item.checked ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
