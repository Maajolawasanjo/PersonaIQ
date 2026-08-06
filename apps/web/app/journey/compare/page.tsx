'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, ArrowUp } from 'lucide-react';

export default function ComparePreviousJourneysPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header with Back Arrow */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors text-[14px]"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>
        <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
          Compare Previous Journeys
        </h1>
      </div>

      {/* Top Banner Card with Red Vertical Bar */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex items-center space-x-4 border-l-4 border-l-red-600">
        <div className="w-10 h-10 rounded-full bg-red-50 text-red-650 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-red-650" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            ANALYSIS
          </span>
          <p className="text-[15px] font-sans text-gray-900 leading-snug">
            Your professional presence has improved by <strong className="text-red-600 font-bold">11 points</strong> over your last four journeys.
          </p>
        </div>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        
        {/* Column 1: Initial Screen (Oct 12, 2023) */}
        <div className="bg-white border border-gray-200 rounded-[22px] p-5 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-[17px] font-bold text-gray-950 font-sans">
              Initial Screen
            </h3>
            <span className="text-[11px] font-mono text-gray-500">
              Oct 12, 2023
            </span>
          </div>

          {/* Circle Gauge Score 68 */}
          <div className="flex justify-center my-2">
            <div className="w-28 h-28 rounded-full border-4 border-gray-200 flex items-center justify-center">
              <span className="text-[32px] font-bold text-gray-950 font-sans">
                68
              </span>
            </div>
          </div>

          {/* Grey Metrics Progress Bars */}
          <div className="space-y-3.5 text-[12px] font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-700 font-sans">
                <span>Style</span>
                <span>72/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 w-[72%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-700 font-sans">
                <span>Preparation</span>
                <span>65/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 w-[65%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-700 font-sans">
                <span>Lighting</span>
                <span>80/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 w-[80%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-700 font-sans">
                <span>Confidence</span>
                <span>60/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 w-[60%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Final Panel (Nov 05, 2023) - Highlighted with Red */}
        <div className="bg-white border border-gray-200 rounded-[22px] p-5 shadow-xs space-y-5 flex flex-col justify-between relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-[17px] font-bold text-gray-950 font-sans">
              Final Panel
            </h3>
            <span className="text-[11px] font-mono text-gray-500">
              Nov 05, 2023
            </span>
          </div>

          {/* Circle Gauge Score 79 with Red Arc */}
          <div className="flex justify-center my-2">
            <div className="w-28 h-28 rounded-full border-4 border-gray-200 border-t-red-600 border-r-red-600 flex items-center justify-center relative">
              <span className="text-[32px] font-bold text-red-600 font-sans">
                79
              </span>
            </div>
          </div>

          {/* Red Progress Bars */}
          <div className="space-y-3.5 text-[12px] font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-900 font-sans">
                <span>Style</span>
                <span className="text-red-600 font-bold flex items-center space-x-0.5">
                  <span>85/100</span>
                  <ArrowUp className="w-3 h-3 text-red-600" />
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-[85%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-900 font-sans">
                <span>Preparation</span>
                <span className="text-red-600 font-bold flex items-center space-x-0.5">
                  <span>82/100</span>
                  <ArrowUp className="w-3 h-3 text-red-600" />
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-[82%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-700 font-sans">
                <span>Lighting</span>
                <span>80/100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-700 w-[80%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-900 font-sans">
                <span>Confidence</span>
                <span className="text-red-600 font-bold flex items-center space-x-0.5">
                  <span>75/100</span>
                  <ArrowUp className="w-3 h-3 text-red-600" />
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-[75%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Journey Trends */}
        <div className="bg-white border border-gray-200 rounded-[22px] p-5 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-[17px] font-bold text-gray-950 font-sans">
              Journey Trends
            </h3>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-40 flex items-end justify-between px-4 pt-4 border-b border-gray-150 pb-2 relative">
            <div className="w-8 bg-gray-200 rounded-t h-[50%]" />
            <div className="w-8 bg-gray-200 rounded-t h-[70%]" />
            <div className="w-8 bg-red-600 rounded-t h-[90%]" />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-gray-500 px-4">
            <span>Sep</span>
            <span>Oct</span>
            <span className="font-bold text-gray-950">Nov</span>
          </div>

          {/* Notable Metric Card */}
          <div className="bg-gray-50 border border-gray-150 rounded-[14px] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              NOTABLE METRIC
            </span>
            <p className="text-[12.5px] font-sans text-gray-900">
              Highest growth recorded in <strong className="font-bold text-gray-950">Confidence (+15 pts)</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
