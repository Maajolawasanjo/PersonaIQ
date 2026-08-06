'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

export default function SystemStatesSuitePage() {
  const [activeState, setActiveState] = useState<string>('53');

  const states = [
    { id: '53', name: '53 — Offline Mode', title: 'Offline Mode Active', desc: 'Cached journey data is accessible. Syncing will resume when connection restores.' },
    { id: '54', name: '54 — No Internet Connection', title: 'Connection Interrupted', desc: 'Please verify your network settings to run real-time neural fitting.' },
    { id: '55', name: '55 — Maintenance', title: 'Scheduled Platform Upgrade', desc: 'PersonaIQ intelligence models are upgrading. Estimated duration: 15 minutes.' },
    { id: '56', name: '56 — Empty Dashboard', title: 'No Active Journeys', desc: 'Start your first Presence Journey to generate tailored executive recommendations.' },
    { id: '57', name: '57 — No Journey History', title: 'Archive Empty', desc: 'Completed journeys will appear here as permanent immutable dossiers.' },
    { id: '58', name: '58 — Processing Error', title: 'AI Processing Issue', desc: 'The fit rendering engine timed out. You may retry without re-uploading photos.' },
    { id: '59', name: '59 — Image Upload Failed', title: 'Upload Format Issue', desc: 'Please ensure your file is JPEG/PNG under 15MB.' },
    { id: '60', name: '60 — Camera Permission Required', title: 'Webcam Access Needed', desc: 'Allow camera permissions for live viewfinder posture scanning, or upload photos manually.' },
    { id: '62', name: '62 — Unsupported Browser', title: 'Browser Update Recommended', desc: 'PersonaIQ recommends Chrome, Safari, or Arc for optimal WebGL apparel rendering.' },
    { id: '63', name: '63 — Feature Coming Soon', title: 'Voice Telemetry Engine', desc: 'Real-time pitch and posture acoustic analysis is coming in Q4 2026.' },
    { id: '64', name: '64 — Account Deleted', title: 'Account Permanently Erased', desc: 'All data and encrypted biometrics have been removed from our databases.' },
  ];

  const current = states.find((s) => s.id === activeState) || states[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-[11px] font-mono font-bold text-primary bg-red-50 border border-primary/20 px-2.5 py-0.5 rounded">
            FLOW 08 • SYSTEM STATES
          </span>
          <h1 className="text-[24px] font-bold text-gray-950 font-sans mt-1">
            System States & Exception Suite
          </h1>
        </div>
        <Link href="/dashboard" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* State Switcher Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {states.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveState(s.id)}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-mono font-bold shrink-0 transition-all ${
              activeState === s.id
                ? 'bg-gray-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* State Card Display */}
      <div className="bg-white border border-gray-200 rounded-[22px] p-8 shadow-xs text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
          <Settings className="w-8 h-8 text-red-650" />
        </div>
        <div className="space-y-1">
          <h2 className="text-[22px] font-bold text-gray-950 font-sans">{current.title}</h2>
          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">{current.desc}</p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-6 bg-primary text-white font-bold text-[13px] rounded-[10px] shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
