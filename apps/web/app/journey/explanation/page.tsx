'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Eye, 
  HelpCircle, 
  MapPin, 
  Calendar, 
  Search, 
  Shirt, 
  Circle 
} from 'lucide-react';

export default function DetailedAIExplanationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* 1. Header with Back Arrow */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <Link
          href="/journey/summary"
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors text-[14px]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
          Analysis Transparency
        </h1>
      </div>

      {/* 2. Main Title & Top Logic Trace Badge */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>● AI LOGIC TRACE</span>
        </span>
        <h2 className="text-[34px] font-bold text-gray-950 font-sans leading-tight">
          Decision Pipeline
        </h2>
        <p className="text-[13.5px] text-gray-600 font-normal">
          A transparent breakdown of how the PersonaIQ engine evaluated your upcoming executive briefing presence.
        </p>
      </div>

      {/* 3. Top 2 Cards: Observation & Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Observation Card */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-[20px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>OBSERVATION</span>
            </span>
            <p className="text-[13px] text-gray-700 font-normal leading-relaxed">
              The selected navy blazer exhibits a high-contrast structural lapel, while the base shirt tone (#FAFAFA) closely matches ambient office lighting presets.
            </p>
          </div>
          <span className="text-[9.5px] font-mono text-gray-400 uppercase tracking-wider block">
            DATA CONFIDENCE
          </span>
        </div>

        {/* Interpretation Card */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-[20px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
              <span>INTERPRETATION</span>
            </span>
            <p className="text-[13px] text-gray-700 font-normal leading-relaxed">
              Structural contrast projects authority (Authority Index: 88). However, identical shirt-to-environment luminosity may cause visual flattening on standard 1080p webcams.
            </p>
          </div>
          <span className="text-[9.5px] font-mono text-gray-400 uppercase tracking-wider block">
            MODEL CERTAINTY
          </span>
        </div>

      </div>

      {/* 4. Middle Recommendation Card (Red Border & Accent) */}
      <div className="bg-white border-2 border-red-200 rounded-[22px] p-6 shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-650" />
            <span>RECOMMENDATION</span>
          </span>
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">EXPECTED LIFT</span>
            <span className="text-[24px] font-extrabold text-red-600 font-sans leading-none">
              +12
            </span>
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-gray-950 font-sans">
          Swap to Light Blue Oxford
        </h3>

        <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
          Introducing a subtle chromatic shift (Light Blue) separates the subject from the white ambient background, improving dimensional perception by 42% on standard optical sensors.
        </p>
      </div>

      {/* 5. Section: Evaluation Sequence */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[20px] font-bold text-gray-950 font-sans">
          Evaluation Sequence
        </h3>

        <div className="space-y-4 pl-2">
          
          {/* Step 1 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Event Context Parsed
              </h4>
              <p className="text-[12.5px] text-gray-500 font-normal">
                Identified &quot;Q3 Board Review&quot;. Extracted formality baseline: Formal/Authoritative.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Skin Analysis
              </h4>
              <p className="text-[12.5px] text-gray-500 font-normal">
                Detected warm undertones. Generated complementary color palette constraints.
              </p>
            </div>
          </div>

          {/* Step 3 (Active Red Node) */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
              <Shirt className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Outfit Comparison
              </h4>
              <p className="text-[12.5px] text-gray-600 font-normal">
                Simulated 4 combinations against context and skin tone. Identified primary conflict in contrast ratios.
              </p>
              
              {/* Shirt Comparison Box */}
              <div className="bg-gray-100 border border-gray-200 rounded-[12px] p-3 inline-flex items-center space-x-4">
                <div className="w-8 h-8 rounded bg-indigo-900 text-white flex items-center justify-center">
                  <Shirt className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-400 font-mono text-[12px]">→</span>
                <div className="w-8 h-8 rounded bg-indigo-900 text-white flex items-center justify-center">
                  <Shirt className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Circle className="w-3 h-3 text-gray-300 fill-gray-300" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-400 font-sans">
                Presence Modeling
              </h4>
              <p className="text-[12.5px] text-gray-400 font-normal">
                Pending selection update to re-run full spatial simulation.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
