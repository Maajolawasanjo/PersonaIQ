'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col w-full py-20 bg-pattern-geom min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-[44px] sm:text-[56px] font-bold tracking-tight text-gray-950 leading-[1.1] font-sans">
            The Intelligence Behind Presence
          </h1>
          <p className="text-[17px] text-gray-500 leading-relaxed max-w-[700px] mx-auto">
            Discover the sophisticated toolkit designed to analyze, refine, and elevate your professional presence through rigorous data analysis and actionable insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Card 1: Presence Scan™ (2/3 width) */}
          <div className="md:col-span-8 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[340px] text-left">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Presence Scan™</h3>
                <p className="text-[15.5px] text-gray-500 leading-relaxed max-w-2xl">
                  A comprehensive, multimodal analysis of your digital footprint, processing text, sentiment, and visual cues to establish your baseline presence vector.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-[#FAF9F6] border border-gray-150 rounded-[12px] p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-9 h-9 rounded-full bg-gray-200/60 flex items-center justify-center text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[11.5px] font-bold text-gray-400 uppercase tracking-wider font-mono">ANALYSIS STATUS</p>
                  <p className="text-[14px] font-bold text-gray-800">1,024 Data Points Processed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[12.5px] font-bold text-emerald-600 font-mono uppercase tracking-wide">Complete</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Card 2: Presence Index™ (1/3 width) */}
          <div className="md:col-span-4 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[340px] text-left">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Presence Index™</h3>
                <p className="text-[15.5px] text-gray-500 leading-relaxed">
                  Your holistic presence score, distilled into a single metric based on clarity, authority, and engagement.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center py-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="6.5" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#A31F34" strokeWidth="6.5" fill="transparent" strokeDasharray="251" strokeDashoffset="55" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[26px] font-black text-gray-950 tracking-tight font-sans">78</span>
              </div>
            </div>
          </div>

          {/* Card 3: Style Compare™ (1/3 width) */}
          <div className="md:col-span-4 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[280px] text-left">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Style Compare™</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  Benchmark your communication metrics against industry leaders and tailored archetypes.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-800 h-full w-[45%]" />
                </div>
                <span className="text-[11.5px] font-bold text-gray-500 w-10 text-right font-mono">You</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#A31F34] h-full w-[92%]" />
                </div>
                <span className="text-[11.5px] font-bold text-primary w-10 text-right font-mono">Target</span>
              </div>
            </div>
          </div>

          {/* Card 4: Presence Boost™ (1/3 width) */}
          <div className="md:col-span-4 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[280px] text-left">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Presence Boost™</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  Actionable, high-impact recommendations to rapidly elevate specific aspects of your presence.
                </p>
              </div>
            </div>

            <div className="mt-8 flex space-x-2.5">
              <span className="px-3.5 py-1.5 bg-slate-50 border border-gray-150 rounded-[6px] text-[12.5px] font-bold text-gray-600 font-sans">Clarity Focus</span>
              <span className="px-3.5 py-1.5 bg-slate-50 border border-gray-150 rounded-[6px] text-[12.5px] font-bold text-gray-600 font-sans">Tone Shift</span>
            </div>
          </div>

          {/* Card 5: Best Presence Plan™ (1/3 width) */}
          <div className="md:col-span-4 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[280px] text-left">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Best Presence Plan™</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  A generated, multi-week curriculum designed to seamlessly integrate new presence habits.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-[10px] p-3.5 text-[12.5px]">
              <span className="font-bold text-gray-800 uppercase tracking-wider font-mono">Week 2 / 4</span>
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>

          {/* Card 6: Journey History™ (Full width) */}
          <div className="md:col-span-12 col-span-12 bg-white border border-gray-150 rounded-[20px] p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[360px] text-left">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-[8px] bg-red-50 text-primary flex items-center justify-center border border-red-100/50">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="text-[21px] font-bold text-gray-950 font-sans">Journey History™</h3>
                <p className="text-[15.5px] text-gray-500 leading-relaxed max-w-4xl">
                  Track the longitudinal evolution of your presence vectors. Our granular historical data visualization allows you to correlate specific interventions with measurable index improvements over time.
                </p>
              </div>
            </div>

            <div className="relative mt-10 bg-slate-50/30 border border-gray-150 rounded-[20px] p-6 overflow-hidden w-full">
              {/* Gridlines */}
              <div className="absolute inset-x-6 inset-y-12 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-gray-150/60 w-full h-0" />
                <div className="border-b border-dashed border-gray-150/60 w-full h-0" />
                <div className="border-b border-dashed border-gray-150/60 w-full h-0" />
                <div className="border-b border-dashed border-gray-150/60 w-full h-0" />
              </div>

              {/* Chart Container */}
              <div className="relative z-10 flex items-end justify-between h-48 w-full">
                {[35, 42, 38, 50, 48, 55, 62, 60, 68, 85].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center w-[8%] h-full justify-end group">
                    {/* Hover Value Popover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-950 text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded-[4px] absolute mb-2 translate-y-[-24px] pointer-events-none shadow-sm z-20">
                      {val}%
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full rounded-t-[6px] transition-all duration-500 cursor-pointer ${
                        idx === 9 
                          ? 'bg-gradient-to-t from-[#7e1727] to-[#A31F34] shadow-[0_4px_16px_rgba(163,31,52,0.35)] hover:brightness-110' 
                          : 'bg-gradient-to-t from-gray-200 to-gray-250 hover:from-gray-300 hover:to-gray-350'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-5 text-[11.5px] font-bold text-gray-400 font-mono tracking-wider px-1">
                {['SCAN 01', 'SCAN 02', 'SCAN 03', 'SCAN 04', 'SCAN 05', 'SCAN 06', 'SCAN 07', 'SCAN 08', 'SCAN 09', 'CURRENT'].map((lbl, idx) => (
                  <span key={idx} className={`w-[8%] text-center ${idx === 9 ? 'text-primary' : ''}`}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Explainability Engine Block */}
        <div className="bg-white border border-gray-150 rounded-[24px] p-8 md:p-12 shadow-sm text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[12.5px] font-bold text-primary uppercase tracking-widest font-mono">Explainability Panels</span>
              <h2 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 leading-[1.1] font-sans">
                Transparent AI Analysis
              </h2>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                We believe intelligence shouldn't be a black box. Our explainability panels deconstruct exactly how your Presence Index is calculated, citing specific data vectors and behavioral markers.
              </p>
              <div className="pt-2">
                <Link href="/demo">
                  <Button variant="outline" className="h-11 px-6 border-gray-250 hover:bg-gray-50 text-gray-950 font-bold text-[14px] rounded-md transition-all active:scale-[0.98]">
                    View Sample Report →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side interactive mock */}
            <div className="lg:col-span-7 bg-[#FAF9F6] border border-gray-150 rounded-[16px] p-6 space-y-5">
              <div className="bg-white border border-gray-150 rounded-[12px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.005)] space-y-4">
                <div className="flex justify-between items-center text-[12.5px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                  <span>SYSTEM SCENARIO</span>
                  <span className="text-[#A31F34]">Live Analysis</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#A31F34] h-full w-[80%]" />
                    </div>
                    <span className="text-[12px] font-bold text-gray-500 w-10 text-right font-mono">80%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gray-800 h-full w-[45%]" />
                    </div>
                    <span className="text-[12px] font-bold text-gray-500 w-10 text-right font-mono">45%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-150 rounded-[12px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.005)] text-[14.5px] leading-relaxed text-gray-700 flex items-start space-x-4">
                <svg className="w-5 h-5 text-[#A31F34] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 font-sans uppercase text-[12px] tracking-wider font-mono">System Analysis</p>
                  <p className="text-[14.5px] text-gray-550 leading-relaxed">
                    Negative tone detected in section 2. Visual analysis indicates low backlight. Action: adjust webcam to 45 degree angle.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Bottom Section */}
        <div className="text-center space-y-6 pt-12 border-t border-gray-150/40">
          <h2 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-gray-950 font-sans leading-[1.1]">
            Ready to elevate your presence?
          </h2>
          <p className="text-[16px] text-gray-500 leading-relaxed max-w-[550px] mx-auto">
            Begin your journey with an initial scan and discover your baseline index.
          </p>
          <div className="pt-2">
            <Link href="/demo">
              <Button className="h-12 px-10 bg-primary hover:bg-primary/95 text-white font-bold text-[14.5px] rounded-md transition-all active:scale-[0.98] shadow-sm">
                Start Free Analysis →
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
