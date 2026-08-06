'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function EventDetailsPage() {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedStakes, setSelectedStakes] = useState<'routine' | 'strategic' | 'critical'>('strategic');

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn py-6">
      {/* 1. Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Define Your Event Context
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium leading-relaxed">
          Provide the parameters of your upcoming engagement. This allows PersonaIQ to tailor your Presence Journey recommendations to the specific environment and audience.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 sm:p-8 shadow-xs space-y-7">
        
        {/* Section 1: The Event */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>The Event</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                EVENT NAME
              </label>
              <input
                type="text"
                placeholder="e.g., Annual Tech Symposium Keynote"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  DATE
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  TIME
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                LOCATION / VENUE
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Moscone Center, San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] pl-10 pr-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
                />
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Environment */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            <span>The Environment</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              INDUSTRY CONTEXT
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
            >
              <option value="">Select an Industry...</option>
              <option value="tech">Technology & AI</option>
              <option value="finance">Venture Capital & Finance</option>
              <option value="corporate">Executive Corporate</option>
              <option value="academic">Academic & Research</option>
            </select>
          </div>
        </div>

        {/* Section 3: The Stakes */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>The Stakes</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              PERCEIVED IMPORTANCE
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* Routine */}
              <button
                type="button"
                onClick={() => setSelectedStakes('routine')}
                className={`p-4 rounded-[14px] border text-center space-y-1.5 transition-all ${
                  selectedStakes === 'routine'
                    ? 'bg-red-50/50 border-primary shadow-xs'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-gray-700">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-950 block">Routine</span>
                <span className="text-[11px] text-gray-500 block">Standard update</span>
              </button>

              {/* Strategic (Active) */}
              <button
                type="button"
                onClick={() => setSelectedStakes('strategic')}
                className={`p-4 rounded-[14px] border text-center space-y-1.5 transition-all ${
                  selectedStakes === 'strategic'
                    ? 'bg-red-50/50 border-primary shadow-xs'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-950 block">Strategic</span>
                <span className="text-[11px] text-gray-500 block">Key milestone</span>
              </button>

              {/* Critical */}
              <button
                type="button"
                onClick={() => setSelectedStakes('critical')}
                className={`p-4 rounded-[14px] border text-center space-y-1.5 transition-all ${
                  selectedStakes === 'critical'
                    ? 'bg-red-50/50 border-primary shadow-xs'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-gray-700">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <span className="text-[13px] font-bold text-gray-950 block">Critical</span>
                <span className="text-[11px] text-gray-500 block">High impact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
          <Link
            href="/journey/event-type"
            className="h-11 px-6 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13.5px] rounded-[10px] transition-all flex items-center justify-center"
          >
            Cancel
          </Link>
          <Link
            href="/journey/dress-code"
            className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
