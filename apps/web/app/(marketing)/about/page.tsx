import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "About PersonaIQ & Founder Ma'ajo Lawasanjo Nathan",
  description: "Learn about PersonaIQ, the premier AI-powered Executive Presence Engine & Outfit Planner founded by Ma'ajo Lawasanjo Nathan (Maajo Digital). Discover our mission in skin intelligence, virtual try-on, and fashion AI.",
  keywords: [
    "Ma'ajo Nathan", "Nathan Ma'ajo", "Ma'ajo Lawasanjo Nathan", "Maajo", "MAAJO", "Ma'ajo Piper", 
    "Francis Nathan", "Nathan Francis Ma'ajo", "PersonaIQ founder", "Founder of PersonaIQ", 
    "AI outfit planner", "AI stylist Nigeria", "African fashion AI", "Executive presence AI"
  ],
};

export default function AboutPage() {
  return (
    <div className="py-20 bg-background text-foreground space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-6">
        <span className="text-[12px] font-mono font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          ABOUT PERSONAIQ
        </span>
        <h1 className="text-[42px] sm:text-[58px] font-extrabold tracking-tight text-gray-950 font-sans leading-tight">
          Pioneering AI-Driven <br />
          <span className="text-primary">Executive Presence & Style Intelligence</span>
        </h1>
        <p className="text-[18px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
          PersonaIQ was engineered to eliminate visual friction, uncertainty, and decision fatigue in personal styling. We empower executives, professionals, and students to present themselves with clinical confidence.
        </p>
      </section>

      {/* Founder Spotlight Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gray-950 text-white rounded-[28px] p-8 sm:p-12 shadow-xl border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-40 h-40 rounded-full border-2 border-primary/40 overflow-hidden relative shadow-lg bg-gray-900 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary font-mono">MN</span>
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-white font-sans">Ma'ajo Lawasanjo Nathan</h3>
              <p className="text-[13px] text-primary font-mono font-semibold">Founder & Lead AI Engineer</p>
              <p className="text-[11.5px] text-gray-400 font-mono mt-0.5">Ma'ajo Francis Nathan (Piper)</p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4 text-left">
            <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-widest block">
              FOUNDER'S VISION
            </span>
            <h2 className="text-[28px] font-bold text-white font-sans leading-snug">
              "First impressions shouldn't be left to guesswork."
            </h2>
            <p className="text-[14.5px] text-gray-300 leading-relaxed font-normal">
              Built by <strong>Ma'ajo Lawasanjo Nathan</strong> (Maajo Digital / NUTM AI Engineer), PersonaIQ fuses advanced computer vision, skin diagnostics, color harmony heuristics, and virtual try-on algorithms to deliver tailored presence plans for interviews, board meetings, keynote speeches, and social milestones.
            </p>
            <p className="text-[14.5px] text-gray-400 leading-relaxed font-normal">
              Whether you are selecting corporate business attire, traditional African native wear (Ankara, Senator, Agbada), or preparing for a high-stakes interview, PersonaIQ acts as your personal image consultant and AI wardrobe advisor.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[12px] font-mono text-gray-400">
              <span>📍 Lagos & Abuja, Nigeria</span>
              <span>•</span>
              <span>⚡ AI Product Innovation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Mission Pillars */}
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-[32px] font-bold text-gray-950 font-sans">Core Pillars of PersonaIQ</h2>
          <p className="text-[15px] text-gray-500 max-w-lg mx-auto">
            Combining smart technology with personal branding to optimize every outfit decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-red-50 text-red-600 flex items-center justify-center font-bold font-mono">01</div>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">AI Outfit Matcher</h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              Intelligent color matching, clothing recommendations, and capsule wardrobe organizing for daily confidence.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-red-50 text-red-600 flex items-center justify-center font-bold font-mono">02</div>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">Skin & Facial Analysis</h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              On-device epidermal metrics detecting fatigue, hydration, and posture offsets before public appearances.
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-red-50 text-red-600 flex items-center justify-center font-bold font-mono">03</div>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">Virtual Try-On</h3>
            <p className="text-[13.5px] text-gray-600 leading-relaxed">
              Simulate suits, blazers, and native outfits virtually before stepping into important events or interviews.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Keyword Cloud Footer Section */}
      <section className="max-w-5xl mx-auto px-6 pt-6 border-t border-gray-150">
        <div className="bg-gray-50 border border-gray-200 rounded-[20px] p-6 space-y-3 text-left">
          <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
            POPULAR SEARCH TOPICS & FEATURES
          </span>
          <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
            AI outfit planner, what should I wear to an interview, AI stylist, Nigerian fashion AI, Senator wear outfit matcher, executive presence coach, digital wardrobe assistant, skin analysis scanner, virtual fitting room, capsule wardrobe builder, stylebook alternative, fashion color matching app, wedding guest outfit recommender, college presentation attire, CEO style advisor, Ma'ajo Lawasanjo Nathan, PersonaIQ AI.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-4">
        <Link href="/signup">
          <Button className="h-12 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[14.5px] rounded-[10px] shadow-sm">
            Experience PersonaIQ Today →
          </Button>
        </Link>
      </section>
    </div>
  );
}
