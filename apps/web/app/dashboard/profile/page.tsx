'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('e.vance@mit.edu');
  const [title, setTitle] = useState('Senior Researcher, Cognitive Systems');

  return (
    <div className="max-w-2xl mx-auto space-y-7 animate-fadeIn py-4">
      
      {/* 1. Header with Back Arrow */}
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-950 font-bold transition-colors">
          ←
        </Link>
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-gray-950 font-sans">
          Profile Settings
        </h1>
      </div>

      {/* 2. Executive Hero Profile Card */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs flex items-center space-x-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <img
            src="/images/professional-female-headshot.jpg"
            alt="Eleanor Vance"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-[24px] font-bold text-gray-950 font-sans leading-tight">
            Eleanor Vance
          </h2>
          <p className="text-[13.5px] text-gray-600 font-medium">
            Senior Researcher, Cognitive Systems
          </p>
          <div className="inline-flex items-center space-x-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Active Session</span>
          </div>
        </div>
      </div>

      {/* 3. Three Stat Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-gray-200 rounded-[18px] p-5 shadow-xs space-y-2">
          <div className="text-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2l3 5-3 5-3-5 3-5z"/><path d="M12 12l4 10H8l4-10z"/></svg>
          </div>
          <div className="text-[32px] font-black text-gray-950 font-sans leading-none">
            28
          </div>
          <div className="text-[11.5px] font-mono font-bold text-gray-500">
            Journeys
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-gray-200 rounded-[18px] p-5 shadow-xs space-y-2">
          <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <div className="text-[32px] font-black text-gray-950 font-sans leading-none">
            83<span className="text-[20px] font-bold">%</span>
          </div>
          <div className="text-[11.5px] font-mono font-bold text-gray-500">
            Recs Followed
          </div>
        </div>

        {/* Stat 3 (Red Top Accent Line + INDEX™ Badge) */}
        <div className="bg-white border border-gray-200 border-t-4 border-t-primary rounded-[18px] p-5 shadow-xs space-y-2 relative">
          <div className="absolute top-3 right-3 text-[9px] font-mono font-extrabold text-primary tracking-widest uppercase">
            INDEX™
          </div>
          <div className="text-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div className="text-[32px] font-black text-gray-950 font-sans leading-none">
            89
          </div>
          <div className="text-[11.5px] font-mono font-bold text-gray-500">
            Avg Presence
          </div>
        </div>
      </div>

      {/* 4. Personal Information Form */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-950 font-sans">
            Personal Information
          </h3>
          <button type="button" className="text-gray-400 hover:text-gray-700">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              FULL NAME
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              PROFESSIONAL TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <button
            type="button"
            className="h-10 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13px] rounded-[10px] shadow-2xs transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* 5. Connected Accounts */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 shadow-xs space-y-5">
        <div className="space-y-1">
          <h3 className="text-[20px] font-bold text-gray-950 font-sans">
            Connected Accounts
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">
            Manage external integrations and authentication methods.
          </p>
        </div>

        <div className="space-y-3">
          {/* Google */}
          <div className="flex items-center justify-between p-4 rounded-[14px] border border-gray-200/80 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-800 text-[15px]">
                G
              </div>
              <div>
                <span className="text-[14px] font-bold text-gray-950 block leading-tight">Google</span>
                <span className="text-[12px] text-gray-500 block font-mono">e.vance@mit.edu</span>
              </div>
            </div>
            <button
              type="button"
              className="h-9 px-4 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[12px] rounded-[8px] transition-all"
            >
              Disconnect
            </button>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center justify-between p-4 rounded-[14px] border border-gray-200/80 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center font-mono font-bold text-gray-800 text-[13px]">
                in
              </div>
              <div>
                <span className="text-[14px] font-bold text-gray-950 block leading-tight">LinkedIn</span>
                <span className="text-[12px] text-gray-500 block font-mono">Not connected</span>
              </div>
            </div>
            <button
              type="button"
              className="h-9 px-5 bg-gray-950 hover:bg-gray-900 text-white font-bold text-[12px] rounded-[8px] transition-all"
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* 6. Appearance Preferences */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 shadow-xs space-y-5">
        <h3 className="text-[20px] font-bold text-gray-950 font-sans">Appearance Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Preferred Style', value: 'Minimalist Corporate', options: ['Minimalist Corporate', 'Classic Executive', 'Modern Business', 'Casual Professional'] },
            { label: 'Default Dress Code', value: 'Formal', options: ['Formal', 'Business Casual', 'Casual', 'Keynote'] },
            { label: 'Colour Palette', value: 'Navy & Charcoal', options: ['Navy & Charcoal', 'All Black', 'Earth Tones', 'Monochrome'] },
          ].map((pref) => (
            <div key={pref.label} className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">{pref.label}</label>
              <select className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all">
                {pref.options.map((o) => (
                  <option key={o} selected={o === pref.value}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="pt-1 flex items-center space-x-3">
          <button type="button" className="h-10 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13px] rounded-[10px] transition-all">Cancel</button>
          <button type="button" className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all">Save Preferences</button>
        </div>
      </div>

      {/* 7. Professional Goals */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-950 font-sans">Professional Goals</h3>
          <button type="button" className="text-[12px] font-mono font-bold text-primary hover:underline">+ Add Goal</button>
        </div>
        <div className="space-y-3">
          {[
            { goal: 'Lead a global keynote at an academic conference', done: false },
            { goal: 'Consistently maintain Presence Index™ above 90', done: false },
            { goal: 'Build a distinct executive visual identity', done: true },
          ].map((g, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 rounded-[14px] border border-gray-200 bg-gray-50/50">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${g.done ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                {g.done && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className={`text-[14px] font-medium ${g.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{g.goal}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
