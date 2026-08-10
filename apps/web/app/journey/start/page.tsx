'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Hammer, Target } from 'lucide-react';
import { journeyApi } from '@/lib/api/services';

export default function JourneyStartPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const journey = await journeyApi.createJourney('Executive Presence Journey');
      if (typeof window !== 'undefined') {
        localStorage.setItem('personaiq_active_journey_id', journey.id);
        localStorage.setItem('personaiq_active_draft_step', '/journey/event-type');
      }
      router.push('/journey/event-type');
    } catch (err) {
      console.warn('Backend creation fallback, proceeding to event-type step:', err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('personaiq_active_draft_step', '/journey/event-type');
      }
      router.push('/journey/event-type');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-[28px] max-w-lg w-full p-8 sm:p-10 shadow-sm text-center space-y-8">
        
        {/* Gear Icon with Dotted Outline */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border border-dashed border-red-500 flex items-center justify-center bg-red-50/50">
            <svg
              className={`w-7 h-7 text-red-650 ${isCreating ? 'animate-spin' : 'animate-spin-slow'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-1.413m11.686-4.743l1.41-1.413M9.172 6.172L7.76 7.76m8.485-2.977l-1.414 1.414m0 8.484l1.414 1.414m-8.485-2.977l-1.414 1.414m0-8.484L6.346 6.346m8.485 8.485l1.413 1.41M9.172 17.828l-1.413-1.413"
              />
            </svg>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-950 font-sans leading-tight">
            Begin Your Journey
          </h1>
          <p className="text-[13.5px] text-gray-500 font-normal leading-relaxed max-w-sm mx-auto">
            The dashboard is currently clear. Initiate your first analysis to begin mapping your intellectual presence and cognitive pathways.
          </p>
        </div>

        {/* Start Button */}
        <div>
          <button
            type="button"
            onClick={handleStart}
            disabled={isCreating}
            className="inline-flex h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm items-center justify-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-75 cursor-pointer"
          >
            <span>{isCreating ? 'Creating Journey Session...' : 'Start First Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">
            WHAT TO EXPECT
          </span>

          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="space-y-1">
              <span className="text-[13px] font-bold text-gray-950 font-sans block flex items-center space-x-1.5">
                <Hammer className="w-4 h-4 text-gray-600" />
                <span>Data Aggregation</span>
              </span>
              <p className="text-[11.5px] text-gray-450 leading-relaxed">
                We compile your inputs into a structured cognitive model.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[13px] font-bold text-gray-950 font-sans block flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-red-650" />
                <span>Presence Index™</span>
              </span>
              <p className="text-[11.5px] text-gray-450 leading-relaxed">
                Receive a baseline score of your intellectual readiness.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
