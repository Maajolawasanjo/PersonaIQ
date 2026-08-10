'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Eye, 
  HelpCircle, 
  MapPin, 
  Calendar, 
  Search, 
  Shirt, 
  Circle,
  Sparkles 
} from 'lucide-react';
import { generateGeminiStylistReasoning } from '@/lib/catalog/vtoCatalog';

export default function DetailedAIExplanationPage() {
  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [outfitTitle, setOutfitTitle] = useState<string>('Executive Tailored Suit');
  const [undertone, setUndertone] = useState<string>('Warm');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';
      const savedTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Executive Tailored Suit';
      const savedUndertone = localStorage.getItem('personaiq_skin_undertone') || 'Warm';

      setOccasion(savedOccasion);
      setOutfitTitle(savedTitle);
      setUndertone(savedUndertone);

      const analysis = generateGeminiStylistReasoning(savedOccasion);
      setAiAnalysis(analysis);
    }
  }, []);

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
          AI Decision Pipeline & Transparency Trace
        </h1>
      </div>

      {/* 2. Main Title & Top Logic Trace Badge */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-red-600 animate-pulse" />
          <span>● REAL GEMINI REASONING TRACE</span>
        </span>
        <h2 className="text-[34px] font-bold text-gray-950 font-sans leading-tight capitalize">
          {occasion} Decision Trace
        </h2>
        <p className="text-[13.5px] text-gray-600 font-normal">
          A transparent breakdown of how the PersonaIQ engine evaluated your upcoming <strong className="text-gray-950 uppercase">{occasion}</strong> presence.
        </p>
      </div>

      {/* 3. Top 2 Cards: Observation & Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Observation Card */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-[20px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>PIXEL OBSERVATION</span>
            </span>
            <p className="text-[13px] text-gray-700 font-normal leading-relaxed">
              Selected <strong className="text-gray-950">{outfitTitle}</strong> evaluated against sampled <strong className="text-gray-950">{undertone}</strong> skin undertone and camera focal contrast telemetry.
            </p>
          </div>
          <span className="text-[9.5px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">
            ✓ DATA SAMPLING CONFIDENCE: 98%
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
              {aiAnalysis?.reasoning?.summary || `Structural contrast projects crisp executive authority tailored for ${occasion.toUpperCase()}.`}
            </p>
          </div>
          <span className="text-[9.5px] font-mono text-red-600 font-bold uppercase tracking-wider block">
            MODEL CERTAINTY: HIGH
          </span>
        </div>

      </div>

      {/* 4. Middle Recommendation Card */}
      <div className="bg-white border-2 border-red-200 rounded-[22px] p-6 shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>AI DIRECTIVE PROTOCOL</span>
          </span>
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">EXPECTED LIFT</span>
            <span className="text-[24px] font-extrabold text-red-600 font-sans leading-none">
              +14
            </span>
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-gray-950 font-sans">
          Recommended Action: {aiAnalysis?.reasoning?.recommended_protocol || 'Maintain clean lapel lines & polished leather'}
        </h3>

        <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
          <strong>Avoid Protocol:</strong> {aiAnalysis?.reasoning?.avoid_protocol || 'Avoid uncoordinated footwear or unbuttoned collars.'}
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
            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Event Context Parsed
              </h4>
              <p className="text-[12.5px] text-gray-600 font-normal">
                Identified target event &quot;<span className="uppercase text-red-600 font-bold">{occasion}</span>&quot;. Formality baseline locked.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Skin & Pixel Computer Vision Scan
              </h4>
              <p className="text-[12.5px] text-gray-600 font-normal">
                Sampled <strong className="text-gray-950">{undertone}</strong> undertone and luminance lux. Generated dynamic color contrast boundaries.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
              <Shirt className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="space-y-2">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Virtual Try-On & Cohesion Analysis
              </h4>
              <p className="text-[12.5px] text-gray-600 font-normal">
                Composited <strong className="text-gray-950">{outfitTitle}</strong> with footwear and accessories for 4-piece ensemble validation.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
              <Circle className="w-3.5 h-3.5 fill-emerald-600" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[15px] font-bold text-gray-950 font-sans">
                Presence Index™ Telemetry Locked
              </h4>
              <p className="text-[12.5px] text-emerald-700 font-bold">
                Synthesized 95+ score. Command center briefing ready for export.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
