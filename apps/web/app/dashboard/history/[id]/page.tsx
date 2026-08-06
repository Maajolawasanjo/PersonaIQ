'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Thermometer, 
  Users, 
  Clock, 
  Shirt, 
  ArrowLeft 
} from 'lucide-react';

export default function JourneyDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* 1. Header */}
      <div className="space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            ARCHIVAL RECORD • Oct 24, 2023
          </span>
          <Link href="/dashboard/history" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Archive</span>
          </Link>
        </div>
        <h1 className="text-[34px] font-bold text-gray-950 font-sans leading-tight">
          Executive Board Presentation
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          A highly formal, high-stakes presentation requiring authoritative yet approachable presence. The selected ensemble prioritized structural tailoring and profound clarity.
        </p>
      </div>

      {/* 2. Main Grid: Left Hero Outfit vs Right Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Hero Card: Selected Ensemble */}
        <div className="md:col-span-7 bg-white border border-gray-200 rounded-[22px] overflow-hidden shadow-xs relative group">
          <div className="aspect-[3/4] w-full bg-gray-900 relative">
            <img
              src="/images/brown-peaked-lapel-suit.jpg"
              alt="Charcoal Structural Suit"
              className="w-full h-full object-cover"
            />
            {/* Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent p-6 text-white space-y-1">
              <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider block">
                SELECTED ENSEMBLE
              </span>
              <h3 className="text-[20px] font-bold font-sans leading-tight">
                Charcoal Structural Suit
              </h3>
              <p className="text-[12px] font-mono text-gray-300">
                Tom Ford tailoring • Egyptian cotton poplin
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Presence Index Gauge & Contextual Variables */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Presence Index Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              PRESENCE INDEX™
            </span>

            <div className="flex flex-col items-center justify-center my-2">
              <div className="w-32 h-32 rounded-full border-[6px] border-gray-150 border-t-red-600 border-r-red-600 border-b-red-600 flex flex-col items-center justify-center">
                <span className="text-[36px] font-extrabold text-gray-950 font-sans leading-none">
                  91
                </span>
                <span className="text-[10px] font-mono text-gray-500 mt-1">
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Contextual Variables Card */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-3.5">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              CONTEXTUAL VARIABLES
            </span>

            <div className="space-y-2.5 text-[12.5px] font-mono text-gray-700">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-gray-500">
                  <Thermometer className="w-3.5 h-3.5 text-gray-400" />
                  <span>Climate</span>
                </span>
                <span className="font-bold text-gray-950">68°F • Indoor</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-gray-500">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>Audience</span>
                </span>
                <span className="font-bold text-gray-950">C-Suite (12)</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-1.5 text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Duration</span>
                </span>
                <span className="font-bold text-gray-950">2.5 Hours</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Section: Strategic Alignment Rationale */}
      <div className="bg-gray-50/70 border border-gray-200 rounded-[22px] p-6 space-y-3">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
          ANALYSIS
        </span>
        <h3 className="text-[20px] font-bold text-gray-950 font-sans">
          Strategic Alignment Rationale
        </h3>
        <div className="space-y-3 text-[13px] text-gray-700 font-normal leading-relaxed">
          <p>
            The selected charcoal ensemble was recommended due to its high congruence with the &quot;Authoritative Trust&quot; persona required for board-level interactions. The structural integrity of the tailoring signals precision and control, while the subdued color palette minimizes cognitive distraction for the audience, directing focus to verbal communication.
          </p>
          <p>
            The Presence Index of 91 indicates near-perfect alignment between environmental constraints (indoor, climate-controlled board room) and the projected psychological intent. Minor deduction (9 pts) resulted from a slight over-indexing on formality given the prevailing corporate culture, though this was deemed an acceptable margin for this specific event type.
          </p>
        </div>
      </div>

      {/* 4. Section: Archived Alternatives */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[20px] font-bold text-gray-950 font-sans">
          Archived Alternatives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-[18px] p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[10px] bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-mono">
                <Shirt className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                  Navy Pinstripe
                </h4>
                <span className="text-[11px] font-mono text-gray-500">Index Match</span>
              </div>
            </div>
            <span className="text-[18px] font-bold font-sans text-gray-950">86</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-[18px] p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[10px] bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-mono">
                <Shirt className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-gray-950 font-sans">
                  Grey Flannel Soft-Tailored
                </h4>
                <span className="text-[11px] font-mono text-gray-500">Index Match</span>
              </div>
            </div>
            <span className="text-[18px] font-bold font-sans text-gray-950">82</span>
          </div>
        </div>
      </div>

    </div>
  );
}
