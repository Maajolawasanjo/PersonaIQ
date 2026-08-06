'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DressCodePage() {
  const [selectedCode, setSelectedCode] = useState('formal');

  const dressCodes = [
    {
      id: 'formal',
      title: 'Business Formal',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      ),
    },
    {
      id: 'casual',
      title: 'Business Casual',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      ),
    },
    {
      id: 'smart',
      title: 'Smart Casual',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
      ),
    },
    {
      id: 'cocktail',
      title: 'Cocktail',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 22h8M12 11v11M19 3l-7 8-7-8h14z"/></svg>
      ),
    },
    {
      id: 'traditional',
      title: 'Traditional',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="21" x2="21" y2="21"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 3 2 10 22 10 12 3"/></svg>
      ),
    },
    {
      id: 'blacktie',
      title: 'Black Tie',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3 5-3 5-3-5 3-5z"/><path d="M12 12l4 10H8l4-10z"/></svg>
      ),
    },
    {
      id: 'casual_free',
      title: 'Casual',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
      ),
    },
    {
      id: 'notsure',
      title: 'Not Sure',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-center py-6">
      {/* 1. Top Badge */}
      <span className="text-[11px] font-mono font-extrabold text-primary tracking-widest uppercase block">
        PRESENCE JOURNEY
      </span>

      {/* 2. Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          What is the dress code?
        </h1>
        <p className="text-[15px] text-gray-600 font-medium">
          Select the attire standard that best matches the environment you are preparing for.
        </p>
      </div>

      {/* 3. 8 Card Grid (4x2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
        {dressCodes.map((code) => {
          const isSelected = selectedCode === code.id;
          return (
            <button
              key={code.id}
              type="button"
              onClick={() => setSelectedCode(code.id)}
              className={`bg-white rounded-[20px] p-6 text-center space-y-3 transition-all flex flex-col items-center justify-center min-h-[140px] shadow-xs ${
                isSelected
                  ? 'border-2 border-primary shadow-sm'
                  : 'border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100/80 flex items-center justify-center text-gray-800 shrink-0">
                {code.icon}
              </div>
              <span className="text-[14px] font-bold text-gray-950 block font-sans">
                {code.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Bottom Primary CTA */}
      <div className="pt-6">
        <Link
          href="/journey/capture-look"
          className="inline-flex items-center justify-center space-x-2 h-12 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[14px] rounded-[12px] shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Continue to Capture Your Look</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
