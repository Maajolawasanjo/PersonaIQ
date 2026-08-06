'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function HowItWorksPage() {
  const steps = [
    {
      num: 'SET / 0.01',
      title: 'Tell us your event',
      desc: 'Provide the context. Is it a high-stakes board meeting, a tech conference keynote, or a casual networking dinner? The AI calibrates its expectations based on your environment.',
      icon: (
        <svg className="w-5 h-5 text-gray-650" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
        </svg>
      ),
      illustration: (
        <div className="bg-[#FAF9F6] border border-gray-150 rounded-[12px] p-4 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
          {/* Browser top-bar */}
          <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-150/40">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          {/* App layout */}
          <div className="grid grid-cols-12 gap-3 text-[11px]">
            {/* Left menu sidebar */}
            <div className="col-span-5 space-y-1.5 border-r border-gray-150/40 pr-2 text-left">
              <div className="bg-primary/5 text-primary font-bold px-1.5 py-0.5 rounded-[4px] border border-primary/10 text-[9.5px]">Investor Pitch</div>
              <div className="text-gray-455 px-1.5 py-0.5 text-[9.5px]">Job Interview</div>
              <div className="text-gray-455 px-1.5 py-0.5 text-[9.5px]">Keynote Talk</div>
            </div>
            {/* Right options list */}
            <div className="col-span-7 space-y-1.5 pl-1 text-left">
              <span className="text-[8.5px] font-bold text-gray-450 uppercase tracking-wider block font-mono">AUDIENCE CONFIG</span>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-700 bg-white border border-gray-150 p-1.5 rounded-[4px] text-[9.5px]">
                  <span>Tone Composure</span>
                  <span className="text-primary font-bold">Rigorous</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 bg-white/40 border border-dashed border-gray-150 p-1.5 rounded-[4px] text-[9.5px]">
                  <span>Dress Code</span>
                  <span>Formal Suit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 'SET / 0.02',
      title: 'Upload your look',
      desc: 'Snap a quick photo or upload an existing one. Our secure system processes the image locally before initiating the analysis, ensuring your privacy is maintained throughout the journey.',
      icon: (
        <svg className="w-5 h-5 text-gray-655" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      illustration: (
        <div className="bg-[#FAF9F6] border border-gray-150 rounded-[12px] p-4 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.005)] relative overflow-hidden">
          {/* Camera capture outline box */}
          <div className="border border-dashed border-gray-250 rounded-[8px] p-4 flex flex-col items-center justify-center space-y-2 bg-white relative">
            <div className="absolute inset-0 border border-dashed border-primary/20 rounded-[8px] animate-pulse pointer-events-none" />
            <svg className="w-7 h-7 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <div className="text-[10.5px] font-bold text-gray-700">Composure Frame Alignment</div>
            <div className="flex space-x-2 text-[9px] font-mono font-bold text-emerald-650">
              <span>✓ Centered</span>
              <span>✓ Contrast OK</span>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 'SET / 0.03',
      title: 'AI analyzes everything',
      desc: 'The intelligence engine cross-references your visual data against sociological benchmarks for the specified event type, calculating your baseline Presence Index™.',
      icon: (
        <svg className="w-5 h-5 text-gray-655" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M2 12h20"/>
        </svg>
      ),
      illustration: (
        <div className="bg-[#FAF9F6] border border-gray-150 rounded-[12px] p-4 flex flex-col items-center justify-center space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="7" fill="transparent" />
              <circle cx="50" cy="50" r="40" stroke="#A31F34" strokeWidth="7" fill="transparent" strokeDasharray="251" strokeDashoffset="45" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[18px] font-black text-gray-950 font-sans">82</span>
          </div>
          <div className="text-[9.5px] font-bold text-gray-450 uppercase tracking-widest font-mono">PRESENCE INDEX™</div>
        </div>
      )
    },
    {
      num: 'SET / 0.04',
      title: 'Receive your Presence Plan',
      desc: 'Instantly receive actionable, minor adjustments to optimize your impact. From posture cues to subtle wardrobe tweaks, aligned perfectly with your goal.',
      icon: (
        <svg className="w-5 h-5 text-gray-655" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      illustration: (
        <div className="bg-[#FAF9F6] border border-gray-150 rounded-[12px] p-4 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.005)] text-left">
          <div className="flex justify-between items-center pb-1.5 border-b border-gray-150/40 text-[10px] font-bold text-gray-450 uppercase tracking-wider font-mono">
            <span>Task Roadmap</span>
            <span className="text-emerald-600">Ready</span>
          </div>
          <div className="space-y-1.5 text-[10.5px]">
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Adjust lens to eye level (+3°)</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Add secondary key light at 45°</span>
            </div>
          </div>
        </div>
      ),
      isLast: true
    }
  ];

  return (
    <div className="flex flex-col w-full py-24 bg-pattern-waves min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* Top Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="flex justify-center">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200/50 border border-gray-150/40 px-3.5 py-1.5 rounded-full font-mono">
              THE PROCESS
            </span>
          </div>
          <h1 className="text-[44px] sm:text-[56px] font-bold tracking-tight text-gray-950 leading-[1.08] font-sans">
            Your Presence Journey.
          </h1>
          <p className="text-[17px] text-gray-550 leading-relaxed max-w-[620px] mx-auto">
            A structured, data-driven approach to elevating your personal brand. From initial context to actionable intelligence in four precise steps.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-5xl mx-auto py-10">
          
          {/* Central Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-4 bottom-4 w-0.5 bg-primary" />

          {/* Steps container */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative w-full">
                  
                  {/* Timeline Central Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-8 w-3 h-3 rounded-full bg-primary border-2 border-white ring-4 ring-primary/20 z-20" />

                  {/* alternating grid container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* Unified Card Container placement */}
                    <div className={`col-span-1 pl-10 md:pl-0 ${
                      isEven 
                        ? 'md:col-start-1 md:pr-14 text-left' 
                        : 'md:col-start-2 md:pl-14 text-left'
                    }`}>
                      <div className="bg-white border border-gray-150 rounded-[20px] p-7 md:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[400px] text-left relative">
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-[8px] bg-slate-50 border border-gray-150/50 text-gray-650 flex items-center justify-center">
                              {step.icon}
                            </div>
                            <span className="text-[11.5px] font-bold text-primary font-mono tracking-wider">{step.num}</span>
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-[20px] font-bold text-gray-950 font-sans">{step.title}</h3>
                            <p className="text-[14.5px] text-gray-555 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          {step.illustration}
                        </div>

                        {/* Card 4 Button inside the card itself */}
                        {step.isLast && (
                          <div className="mt-6 w-full">
                            <Link href="/demo">
                              <Button className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-bold text-[14.5px] rounded-md transition-all active:scale-[0.98] shadow-sm">
                                Start Your Journey
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
