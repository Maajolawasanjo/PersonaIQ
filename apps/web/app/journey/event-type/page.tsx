'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventTypePage() {
  const [selectedType, setSelectedType] = useState('interview');

  const eventTypes = [
    {
      id: 'interview',
      title: 'Job Interview',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      ),
    },
    {
      id: 'meeting',
      title: 'Business Meeting',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 17a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1h-2a1 1 0 00-1 1v3z"/><path d="M17 11a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/><path d="M5 13a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
      ),
    },
    {
      id: 'networking',
      title: 'Networking',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      ),
    },
    {
      id: 'keynote',
      title: 'Keynote',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      ),
    },
    {
      id: 'presentation',
      title: 'Presentation',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      ),
    },
    {
      id: 'wedding',
      title: 'Wedding Guest',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/></svg>
      ),
    },
    {
      id: 'graduation',
      title: 'Graduation',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      ),
    },
    {
      id: 'date',
      title: 'Date Night',
      icon: (
        <svg width="22" height="22" fill="currentColor" className="text-gray-700" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      ),
    },
    {
      id: 'traditional',
      title: 'Traditional Ceremony',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="21" x2="21" y2="21"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 3 2 10 22 10 12 3"/></svg>
      ),
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion');
      if (savedOccasion) {
        setSelectedType(savedOccasion);
      }
    }
  }, []);

  const handleSelectEvent = (id: string) => {
    setSelectedType(id);
    const eventObj = eventTypes.find((e) => e.id === id);
    const title = eventObj ? eventObj.title : id;
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_occasion', id);
      localStorage.setItem('personaiq_event_type', title);
      localStorage.setItem('personaiq_event_title', title);
    }
  };

  const handleContinue = () => {
    const eventObj = eventTypes.find((e) => e.id === selectedType);
    const title = eventObj ? eventObj.title : selectedType;
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_occasion', selectedType);
      localStorage.setItem('personaiq_event_type', title);
      localStorage.setItem('personaiq_event_title', title);
      localStorage.setItem('personaiq_active_draft_step', '/journey/dress-code');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-center py-6">
      {/* 1. Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          What moment are you preparing for?
        </h1>
        <p className="text-[15px] text-gray-600 font-medium">
          Select the type of event to tailor your Presence Journey analysis.
        </p>
      </div>

      {/* 2. 9 Card Grid (3x3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
        {eventTypes.map((event) => {
          const isSelected = selectedType === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => handleSelectEvent(event.id)}
              className={`bg-white rounded-[20px] p-6 text-center space-y-3 transition-all flex flex-col items-center justify-center min-h-[140px] shadow-xs relative cursor-pointer ${
                isSelected
                  ? 'border-2 border-red-600 shadow-sm'
                  : 'border border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Checkmark Badge for Active Card */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
              )}

              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                {event.icon}
              </div>
              <span className="text-[14px] font-bold text-gray-950 block font-sans">
                {event.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Bottom Primary CTA */}
      <div className="pt-6">
        <Link
          href="/journey/dress-code"
          onClick={handleContinue}
          className="inline-flex items-center justify-center space-x-2 h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-[12px] shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Continue to Dress Code</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
