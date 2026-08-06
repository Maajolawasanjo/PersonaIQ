'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';

export default function MarketingHomePage() {
  const [presenceScore, setPresenceScore] = useState(65);
  const [activeTab, setActiveTab] = useState<'context' | 'upload' | 'skin' | 'outfit' | 'plan'>('context');

  // Increment presence index score on mount for visual flair
  useEffect(() => {
    const timer = setInterval(() => {
      setPresenceScore((prev) => {
        if (prev >= 92) {
          clearInterval(timer);
          return 92;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Presence Scan™',
      desc: 'Map hydration, fatigue, and posture details in seconds using clinical-grade imaging metrics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>
      )
    },
    {
      title: 'Style Compare™',
      desc: 'Compare multiple outfits side-by-side. AI evaluates structure, contrast, and situational suitability.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><rect width="8" height="18" x="13" y="3" rx="1"/></svg>
      )
    },
    {
      title: 'Presence Index™',
      desc: 'Get an objective, single-score metric indicating your overall readiness for any specific event.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      )
    },
    {
      title: 'Presence Boosts™',
      desc: 'Actionable micro-adjustments sorted by speed and confidence impact to polish your presentation.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.886H3.82l4.912 3.57L6.82 18.342l5.18-3.762 5.18 3.762-1.913-5.886 4.912-3.57h-6.268L12 3z"/></svg>
      )
    },
    {
      title: 'Best Presence Plan™',
      desc: 'A complete custom guide with recommended arrival times, checklist steps, and preparation offsets.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      )
    },
    {
      title: 'Journey History™',
      desc: 'Review past performance trends, look metrics, and track consistent styling growth over time.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
      )
    }
  ];

  const demoSteps = [
    {
      id: 'context',
      label: '1. Event Context',
      title: 'Define your scenario parameters',
      desc: 'Tell us where you are heading. An investor pitch, a critical job interview, or a keynote presentation. Our engine references industry guidelines and context standards for that specific audience.',
      mock: (
        <div className="bg-white border border-gray-150 rounded-[14px] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider font-mono">Event Type Selection</span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 border-2 border-primary bg-primary/5 rounded-[8px] flex flex-col justify-between h-20 text-left text-primary">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span className="text-[12px] font-bold text-gray-900 leading-none">Job Interview</span>
            </div>
            <div className="p-3.5 border border-gray-200 hover:border-gray-300 rounded-[8px] flex flex-col justify-between h-20 text-left cursor-pointer text-gray-400">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              <span className="text-[12px] font-bold text-gray-700 leading-none">Keynote Speech</span>
            </div>
            <div className="p-3.5 border border-gray-200 hover:border-gray-300 rounded-[8px] flex flex-col justify-between h-20 text-left cursor-pointer text-gray-400">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span className="text-[12px] font-bold text-gray-700 leading-none">Investor Pitch</span>
            </div>
            <div className="p-3.5 border border-gray-200 hover:border-gray-300 rounded-[8px] flex flex-col justify-between h-20 text-left cursor-pointer text-gray-400">
              <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 22h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
              <span className="text-[12px] font-bold text-gray-700 leading-none">Wedding / Gala</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'upload',
      label: '2. Capture Look',
      title: 'Analyze frame composition',
      desc: 'Verify focus levels and contrast. Rather than a simple photo upload, our scanner evaluates lighting quality, webcam offsets, and background distractions before AI analysis runs.',
      mock: (
        <div className="bg-white border border-gray-150 rounded-[14px] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider font-mono">Frame Validator</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[4px]">✓ READY</span>
          </div>
          
          <div className="relative aspect-video bg-gray-100 rounded-[8px] overflow-hidden flex items-center justify-center">
            <img 
              src="/images/professional-ai-headshot.jpg" 
              alt="Balanced sample" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Simulated frame overlay */}
            <div className="absolute inset-2 border border-dashed border-emerald-500/40 rounded-[6px] z-10" />
            <div className="absolute top-2 left-2 text-[8px] font-bold font-mono text-white bg-gray-950/80 px-1.5 py-0.5 rounded z-10">
              ISO 400 • F2.0
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-left z-10 p-2 bg-white/90 backdrop-blur-sm rounded-[6px] border border-gray-100">
              <p className="text-[10.5px] font-bold text-gray-800 leading-none">Contrast balance optimized</p>
              <p className="text-[8px] text-gray-400 mt-0.5">Background noise: low • Lighting: centered</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'skin',
      label: '3. Skin Intelligence',
      title: 'Verify physical preparedness',
      desc: 'Identify sub-optimal conditions affecting clarity. Analysis tracks fatigue values, skin dehydration levels, and dark circular offsets, delivering immediate, actionable fixes to boost freshness.',
      mock: (
        <div className="bg-white border border-gray-150 rounded-[14px] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider font-mono">Skin Intelligence™</span>
            <span className="text-[11.5px] font-bold text-[#A31F34]">94% Optimal</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-[6px] overflow-hidden shrink-0 bg-slate-900 border border-gray-200">
              <img 
                src="/images/professional-female-headshot.jpg" 
                alt="Diagnostics thumbnail" 
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-gray-500">Hydration Parameters</span>
                <span className="font-bold text-gray-800">Excellent (88%)</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#A31F34]/5 border border-[#A31F34]/10 rounded-[8px] p-2.5 text-[10.5px] text-primary font-semibold leading-relaxed flex items-start space-x-2">
            <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>Quick Boost: Under-eye fatigue detected. Apply a cool compress for 3 minutes before going live.</span>
          </div>
        </div>
      )
    },
    {
      id: 'outfit',
      label: '4. Outfit Compare',
      title: 'Evaluate wardrobe alignments',
      desc: 'Compare multiple styles with AI try-on tools. We model tailoring suitability, drape structure, and color contrasts against the dress codes of your specified target organization.',
      mock: (
        <div className="bg-white border border-gray-150 rounded-[14px] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider font-mono">Style Match comparison</span>
            <span className="text-[10px] font-mono font-bold text-gray-400">2 Options</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-primary rounded-[10px] p-2 bg-primary/5 text-center relative overflow-hidden flex flex-col justify-between min-h-[110px]">
              <div className="absolute top-0 right-0 bg-primary text-white text-[7px] font-bold px-1.5 py-0.5 rounded-bl-[6px] z-10">
                BEST MATCH
              </div>
              <div className="w-full h-11 rounded overflow-hidden relative bg-slate-100 border border-primary/10">
                <img 
                  src="/images/brown-peaked-lapel-suit.jpg" 
                  alt="Brown blazer Option A"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1">
                <span className="text-[10.5px] font-bold text-gray-900 block leading-tight">Brown Suit</span>
                <span className="text-[9.5px] text-primary font-bold block">95% Match</span>
              </div>
            </div>

            <div className="border border-gray-250 hover:border-gray-300 rounded-[10px] p-2 text-center cursor-pointer transition-colors flex flex-col justify-between min-h-[110px]">
              <div className="w-full h-11 rounded overflow-hidden relative bg-slate-100 border border-gray-100">
                <img 
                  src="/images/rigor-polo-shorts-set.jpg" 
                  alt="Polo Option B"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-1">
                <span className="text-[10.5px] font-bold text-gray-700 block leading-tight">Bright Polo</span>
                <span className="text-[9.5px] text-gray-400 font-semibold block">68% Match</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'plan',
      label: '5. Presence Plan',
      title: 'Execute your custom roadmap',
      desc: 'A complete preparation blueprint. Includes the final score calculations, optimized arrival offsets, lighting configurations, and automated timers to keep you relaxed and focused.',
      mock: (
        <div className="bg-white border border-gray-150 rounded-[14px] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider font-mono">Your Presence Plan</span>
            <span className="text-[12px] font-bold text-emerald-600">✓ Ready</span>
          </div>

          <div className="space-y-2 text-[12px]">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500">✓</span>
              <span className="text-gray-700">Steam blazer sleeves (Style matching)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500">✓</span>
              <span className="text-gray-700">Position ring light at 45° angle</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-primary font-bold">□</span>
              <span className="text-gray-900 font-semibold">Verify collar alignment (Check frame)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-mono">
            <span>Arrival Offset: 15m early</span>
            <span className="font-bold text-gray-700">Index: 92</span>
          </div>
        </div>
      )
    }
  ];

  const currentDemo = demoSteps.find(step => step.id === activeTab)!;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-pattern-waves">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-5 flex flex-col space-y-7 text-left z-10">
            <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">
              BUILD YOUR PRESENCE. OWN EVERY MOMENT.
            </span>

            <h1 className="text-[52px] sm:text-[68px] font-extrabold tracking-tight text-gray-950 leading-[1.04] font-sans">
              Your Presence <br /> Powered by <span className="text-primary">AI.</span>
            </h1>

            <p className="text-[17.5px] text-gray-550 leading-relaxed max-w-[480px]">
              PersonaIQ combines Skin AI, Virtual Try-On, and contextual intelligence to create a personalized Presence Plan for every important moment.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-2">
              <Link href="/onboarding">
                <Button className="w-full sm:w-auto h-12 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[14.5px] rounded-md transition-all active:scale-[0.98] shadow-sm flex items-center justify-center space-x-2">
                  <span>Get Your Presence Plan</span>
                  <span className="text-xs">→</span>
                </Button>
              </Link>
              <Link href="/demo" className="flex items-center space-x-3 text-left group">
                <div className="w-11 h-11 rounded-full bg-white border border-gray-250 flex items-center justify-center group-hover:border-gray-300 transition-colors shadow-sm shrink-0">
                  <svg className="w-4 h-4 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[14px] font-bold text-gray-850 block leading-tight">See How It Works</span>
                  <span className="text-[11.5px] text-gray-400 font-semibold block">2 min overview</span>
                </div>
              </Link>
            </div>

            {/* Three key features horizontal grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-150/40">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-[6px] bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-tight">Skin AI Analysis</span>
                </div>
                <p className="text-[11.5px] text-gray-500 leading-normal">Understand your unique skin profile</p>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-[6px] bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h8m-8 0H1m8-11.813a4.5 4.5 0 018.284 0M17 10a4.5 4.5 0 014.142 3.187M17 10h-2M13 3h-2" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-tight">Virtual Try-On</span>
                </div>
                <p className="text-[11.5px] text-gray-500 leading-normal">See what looks best on you, instantly</p>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-[6px] bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-tight">Smart Recs</span>
                </div>
                <p className="text-[11.5px] text-gray-500 leading-normal">AI suggestions for every occasion</p>
              </div>
            </div>
          </div>

          {/* Right Hero Details - Model with floating cards */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end items-center relative z-10 w-full pt-10 lg:pt-0">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 lg:left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[580px] sm:h-[580px] rounded-full bg-gradient-to-tr from-gray-150 to-gray-200/40 -z-10" />

            <div className="relative w-[340px] h-[440px] sm:w-[480px] sm:h-[585px] md:w-[500px] md:h-[610px] rounded-[32px] overflow-hidden border border-gray-150/50 shadow-md">
              <img 
                src="/images/professional-ai-headshot.jpg" 
                alt="PersonaIQ Composure Profile" 
                className="w-full h-full object-cover scale-105"
              />
            </div>

            {/* Floating Card 1: Score */}
            <div className="absolute top-[2%] -right-[2%] sm:-right-[8%] md:-right-[10%] bg-white border border-gray-150 rounded-[16px] p-4.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] w-[160px] text-left z-20 hover:scale-[1.03] transition-transform hidden sm:block">
              <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-100 mb-2.5 text-[9.5px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Presence Score</span>
              </div>
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E5E7EB" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#A31F34" strokeWidth="6"
                    strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * 92) / 100}
                    strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-[20px] font-black text-gray-955 tracking-tight leading-none">92</span>
                </div>
              </div>
              <div className="text-center mt-2.5">
                <span className="text-[11.5px] font-bold text-gray-900 block leading-none">Exceptional</span>
                <span className="text-[8.5px] text-gray-400 block mt-1">You're showing up your best.</span>
              </div>
            </div>

            {/* Floating Card 2: Recommended */}
            <div className="absolute top-[42%] -right-[8%] sm:-right-[14%] bg-white border border-gray-150 rounded-[16px] p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] w-[200px] text-left z-20 hover:scale-[1.03] transition-transform hidden sm:block">
              <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-100 mb-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Recommended For You</span>
              </div>
              <div className="flex space-x-3 items-center">
                <div className="w-12 h-14 rounded-[8px] overflow-hidden shrink-0 bg-slate-100 border border-gray-150">
                  <img src="/images/brown-peaked-lapel-suit.jpg" className="w-full h-full object-cover" alt="Recommended style" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Executive Meeting</h4>
                  <p className="text-[9.5px] text-gray-500 leading-none">Navy Blazer</p>
                  <p className="text-[9.5px] text-gray-500 leading-none">White Shirt</p>
                  <div className="flex space-x-1 pt-1">
                    <span className="w-2 h-2 rounded-full bg-slate-900 border border-gray-200" />
                    <span className="w-2 h-2 rounded-full bg-blue-900" />
                    <span className="w-2 h-2 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 3: Skin Overview */}
            <div className="absolute bottom-[2%] -left-[2%] sm:-left-[10%] bg-white border border-gray-150 rounded-[16px] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.03)] w-[210px] text-left z-20 hover:scale-[1.03] transition-transform hidden sm:block">
              <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-100 mb-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Skin Health Overview</span>
              </div>
              <div className="flex space-x-3 items-center">
                <div className="w-12 h-14 rounded-[8px] overflow-hidden shrink-0 bg-slate-900 border border-gray-150 relative">
                  <img src="/images/professional-female-headshot.jpg" className="w-full h-full object-cover" alt="Scan details" />
                  <div className="absolute inset-0 border border-primary/20 rounded-[8px] pointer-events-none" />
                </div>
                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center text-gray-550">
                    <span>Hydration</span>
                    <span className="text-emerald-600 font-bold">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-550">
                    <span>Texture</span>
                    <span className="text-emerald-600 font-bold">Great</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-555">
                    <span>Even Tone</span>
                    <span className="text-emerald-600 font-bold">Good</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Security & Composure metrics bar */}
      <section className="py-6 bg-white border-b border-gray-150/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 select-none font-mono text-[10.5px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Secure On-Device Processing</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Zero Data Retention Policy</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>99.4% Composure Index Rating</span>
          </span>
        </div>
      </section>

      {/* 3. Problem Section (The Friction) */}
      <section className="py-36 bg-gray-950 text-white relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2a0c0c,transparent_55%)] opacity-70" />
        <div className="absolute inset-0 bg-pattern-geom opacity-[0.03]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-left space-y-5">
              <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">
                THE SOCIAL FRICTION
              </span>
              <h2 className="text-[44px] sm:text-[54px] font-extrabold tracking-tight leading-[1.05] font-sans">
                Why first <br /> impressions <br /> feel high-risk.
              </h2>
              <p className="text-[17.5px] text-gray-400 leading-relaxed max-w-[420px]">
                Unprepared collar adjustments, poor lighting angles, skin fatigue, or wardrobe choices that fail matching organizational codes can diminish authority.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 space-y-4 hover:border-primary/30 transition-all group text-left">
                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">01</div>
                <h3 className="text-[19px] font-bold text-white">Blind Preparation</h3>
                <p className="text-[14.5px] text-gray-400 leading-relaxed">
                  Most professionals prepare visually in front of normal mirrors, leaving details like camera alignment and lighting angles to chance.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 space-y-4 hover:border-primary/30 transition-all group text-left">
                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">02</div>
                <h3 className="text-[19px] font-bold text-white">Visual Friction</h3>
                <p className="text-[14.5px] text-gray-400 leading-relaxed">
                  Dehydrated skin showing fatigue or a poorly chosen dress code profile can subtly diminish leadership authority in high-stakes interactions.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 space-y-4 hover:border-primary/30 transition-all group text-left">
                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">03</div>
                <h3 className="text-[19px] font-bold text-white">Spatial Mismatch</h3>
                <p className="text-[14.5px] text-gray-400 leading-relaxed">
                  Your virtual frame proportions, laptop camera height, and background offsets can distract from the strength of your presentation.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 space-y-4 hover:border-primary/30 transition-all group text-left">
                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">04</div>
                <h3 className="text-[19px] font-bold text-white">Contextual Gap</h3>
                <p className="text-[14.5px] text-gray-400 leading-relaxed">
                  Different boardrooms and target audiences require distinct outfit archetypes. Failing to align with target metrics creates distance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solution Section (The Remedy) */}
      <section className="py-36 bg-[#FAF9F6] border-y border-gray-150/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-geom opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">
              THE REMEDY
            </span>
            <h2 className="text-[44px] sm:text-[54px] font-extrabold tracking-tight text-gray-955 leading-[1.08] font-sans">
              Context-aware personal diagnostics.
            </h2>
            <p className="text-[17.5px] text-gray-500 max-w-[620px] mx-auto leading-relaxed">
              We process spatial frame properties, wardrobe geometry, and skin hydration values. By evaluating selections against audience metrics, we output structured actions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Core Component 1 - Contextual Engine */}
            <div className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[320px] text-left">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-[12px] bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 12a9 9 0 0 0 18 0 9 9 0 0 0-18 0" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-gray-950">Contextual Engine</h3>
                  <p className="text-[14.5px] text-gray-500 leading-relaxed">
                    Matches your audience profiles and dress expectations with your presentation setup, ensuring maximum alignment.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[13px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                <span>Audience Alignment</span>
                <span className="text-primary font-bold">Active</span>
              </div>
            </div>

            {/* Core Component 2 - Style Analyzer */}
            <div className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[320px] text-left">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-[12px] bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="8" height="18" x="3" y="3" rx="1" />
                    <rect width="8" height="18" x="13" y="3" rx="1" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-gray-950">Style Analyzer</h3>
                  <p className="text-[14.5px] text-gray-500 leading-relaxed">
                    Applies AI wardrobe geometry rules to rate collar alignments, peaking lapels, and custom outfit combinations.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[13px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                <span>Wardrobe Contours</span>
                <span className="text-primary font-bold">Optimized</span>
              </div>
            </div>

            {/* Core Component 3 - Imaging Core */}
            <div className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[320px] text-left">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-[12px] bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-gray-950">Imaging Core</h3>
                  <p className="text-[14.5px] text-gray-500 leading-relaxed">
                    Tracks epidermal moisture levels and structural fatigue coordinates to suggest preparation timers and skin fixes.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[13px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                <span>Epidermal Fatigue</span>
                <span className="text-primary font-bold">Monitored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Product Preview */}
      <section className="py-36 bg-pattern-waves relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">INTERACTIVE PREVIEW</span>
            <h2 className="text-[44px] sm:text-[54px] font-extrabold tracking-tight text-gray-955 leading-[1.08] font-sans">Step through a Presence Journey</h2>
            <p className="text-[17.5px] text-gray-550 leading-relaxed">Explore how the AI models analyze visual characteristics to build confidence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
            {/* Timeline Sidebar Selector */}
            <div className="lg:col-span-4 flex flex-col space-y-8 relative pl-6 border-l border-gray-150/80 text-left py-2">
              {demoSteps.map((step) => {
                const isActive = activeTab === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(step.id as any)}
                    className="group relative flex flex-col text-left focus:outline-none transition-all"
                  >
                    {/* Timeline Dot Indicator */}
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                      isActive 
                        ? 'border-primary ring-4 ring-primary/10' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </div>

                    <span className={`text-[11px] font-extrabold uppercase tracking-[0.15em] font-mono transition-colors ${
                      isActive ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    <span className={`text-[17px] font-bold mt-1 leading-snug transition-colors ${
                      isActive ? 'text-gray-950' : 'text-gray-500 group-hover:text-gray-850'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Display active tab mockup panel */}
            <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-[24px] shadow-[0_12px_35px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col min-h-[440px]">
              {/* Window Controls */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-150/40 bg-gray-50/50">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono select-none">
                  app.personaiq.com/journey
                </span>
                <div className="w-10" />
              </div>
              
              {/* Window Content */}
              <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
                <div className="md:col-span-6 space-y-6 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                    Active Step
                  </span>
                  <h3 className="text-[24px] font-bold text-gray-950 font-sans leading-tight mt-1">{currentDemo.title}</h3>
                  <p className="text-[15.5px] text-gray-550 leading-relaxed">{currentDemo.desc}</p>
                  <Link href="/demo">
                    <Button className="h-10 px-4 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-bold text-[13px] rounded-md transition-all active:scale-[0.98] border border-primary/10 flex items-center space-x-2 w-fit">
                      <span>Try Interactive Demo</span>
                      <span>→</span>
                    </Button>
                  </Link>
                </div>
                
                <div className="md:col-span-6 w-full flex justify-center">
                  <div className="w-full max-w-[340px] shadow-[0_8px_20px_rgba(0,0,0,0.015)] transition-all duration-300 hover:translate-y-[-2px]">
                    {currentDemo.mock}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Features Grid */}
      <section id="features" className="py-24 bg-white border-b border-gray-150/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">ENGINEERED CAPABILITIES</span>
            <h2 className="text-[36px] font-bold text-gray-950 tracking-tight">Structured presence diagnostics</h2>
            <p className="text-[16px] text-gray-500">Every tool is tailored to remove visual friction and prepare you with clinical precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group border border-gray-150/40 rounded-[16px] p-8 hover:-translate-y-1 hover:shadow-md transition-all duration-350 bg-white flex flex-col justify-between h-[230px] text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-[8px] bg-[#FAF9F6] text-gray-400 group-hover:text-primary group-hover:bg-primary/5 flex items-center justify-center mb-5 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900">{f.title}</h3>
                  <p className="text-[14.5px] text-gray-550 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/features">
              <span className="text-gray-500 hover:text-gray-900 font-bold text-[14.5px] hover:underline cursor-pointer inline-flex items-center space-x-1">
                <span>View Full Features breakdown</span>
                <span>→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. How It Works Timeline */}
      <section id="how-it-works" className="py-24 bg-pattern-geom">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">FLOW WORKFLOW</span>
            <h2 className="text-[36px] font-bold text-gray-950 tracking-tight">A calm, guided experience</h2>
            <p className="text-[16px] text-gray-500">No dense surveys. We walk you through prep step-by-step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { num: '01', title: 'Context parameters', desc: 'Input your audience dress expectations and event targets.', time: '1 min' },
              { num: '02', title: 'Frame verification', desc: 'Scan lighting, background offset, and webcam orientation.', time: '1 min' },
              { num: '03', title: 'Compare outfits', desc: 'AI virtual try-on rates styling options side-by-side.', time: '30 sec' },
              { num: '04', title: 'Diagnostic Plan', desc: 'Receive structured actions and custom checklist offsets.', time: 'Instant' }
            ].map((step, i) => (
              <div key={i} className="bg-white border border-gray-150/40 rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[210px] text-left relative">
                <span className="text-[32px] font-black text-gray-100 font-mono absolute top-4 right-6">{step.num}</span>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 mt-2">{step.title}</h3>
                  <p className="text-[14.5px] text-gray-550 mt-2 leading-relaxed">{step.desc}</p>
                </div>
                <div className="text-[11.5px] font-bold uppercase tracking-widest font-mono text-primary pt-4">
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-28 bg-[#FAF9F6] border-t border-gray-150/40 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-pattern-geom opacity-[0.04] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <span className="text-[12px] font-bold text-primary tracking-widest uppercase font-mono">START TODAY</span>
          <h2 className="text-[44px] sm:text-[54px] font-extrabold tracking-tight text-gray-950 leading-[1.08] font-sans">
            Build your presence.<br/>Own every moment.
          </h2>
          <p className="text-[17.5px] text-gray-500 max-w-[480px] mx-auto leading-relaxed">
            Eliminate visual uncertainty and present yourself with absolute confidence.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-md transition-all active:scale-[0.98] shadow-sm">
                Start Your Presence Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
