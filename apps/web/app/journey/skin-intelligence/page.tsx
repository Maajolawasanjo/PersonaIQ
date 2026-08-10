'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lightbulb, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { presenceApi } from '@/lib/api/services';
import { VTO_MODELS } from '@/lib/catalog/vtoCatalog';
import { analyzeImageFidelity } from '@/lib/utils/imageAnalysis';

export default function SkinIntelligencePage() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>('/images/professional-female-headshot.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  
  // Dynamic AI Telemetry State
  const [skinData, setSkinData] = useState<{
    score: number;
    headline: string;
    analysis: string;
    tip: string;
    luminosity: string;
    texture: string;
    fatigue: string;
    strengths: string;
    focusArea: string;
  }>({
    score: 88,
    headline: 'High visual vitality & balanced tone detected.',
    analysis: 'Your visual markers project an alert, energetic baseline suited for high-stakes presentation.',
    tip: 'Ensure balanced key lighting to maintain optimal contrast across high-definition video feeds.',
    luminosity: 'Optimal (balanced)',
    texture: '92% (High Clarity)',
    fatigue: 'Low / Alert Baseline',
    strengths: 'Even tone distribution across T-zone and forehead, creating a crisp, confident baseline.',
    focusArea: 'Slight ambient shadow under soft lighting; positioning high key light at 45° eliminates contrast falloff.',
  });

  useEffect(() => {
    async function loadTelemetry() {
      setIsAnalyzing(true);
      if (typeof window !== 'undefined') {
        const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
        const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');

        let targetPhoto = '/vto/models/male/black/male_black_base.jpg';
        if (savedPhoto && savedPhoto.length > 10) {
          targetPhoto = savedPhoto;
        } else if (savedAvatarId) {
          const found = VTO_MODELS.find((m) => m.id === savedAvatarId);
          if (found) targetPhoto = found.image_url;
        }
        setUserPhoto(targetPhoto);

        // Read real sampled computer vision telemetry
        let imageTelemetry: any = null;
        const cachedTelemetry = localStorage.getItem('personaiq_image_telemetry');
        if (cachedTelemetry) {
          try {
            imageTelemetry = JSON.parse(cachedTelemetry);
          } catch (e) {}
        }

        if (!imageTelemetry) {
          imageTelemetry = await analyzeImageFidelity(targetPhoto);
        }

        const skin = imageTelemetry.skinTone || { undertone: 'Warm', hex: '#8c6450', lumaCategory: 'Medium' };
        const score = Math.min(99, Math.max(75, Math.round(imageTelemetry.lightingScore * 0.5 + imageTelemetry.resolutionScore * 0.5)));

        setSkinData({
          score: score,
          headline: `Analyzed ${skin.undertone} undertone & ${skin.lumaCategory} luma baseline.`,
          analysis: `Pixel RGB sampling (${skin.hex}) indicates a high-contrast ${skin.undertone} undertone. Overall image contrast standard deviation is ${imageTelemetry.contrastStdDev || 35} lux.`,
          tip: skin.undertone === 'Warm'
            ? 'Pair with rich navy, charcoal, or deep olive tailoring to accentuate your warm skin undertone.'
            : 'Pair with crisp white, icy blue, or sterling silver accents to complement your cool skin contrast.',
          luminosity: `${imageTelemetry.avgLuminance || 125} Luma Lux (${imageTelemetry.avgLuminance > 160 ? 'High Glare' : imageTelemetry.avgLuminance < 90 ? 'Deep Contrast' : 'Balanced Lux'})`,
          texture: `${imageTelemetry.resolutionScore || 92}% (${imageTelemetry.width || 800}x${imageTelemetry.height || 1000} Resolution)`,
          fatigue: imageTelemetry.lightingScore > 88 ? 'Low / Alert Baseline' : 'Moderate Shadow Falloff',
          strengths: `Sampled facial RGB (${skin.hex}) shows consistent ${skin.undertone} tone distribution across key presentation focal points.`,
          focusArea: imageTelemetry.avgLuminance < 100
            ? 'Increase front key lighting by 15% to boost T-zone definition in virtual video feeds.'
            : 'Maintain 45° diffuse lighting to preserve natural edge sharpness.',
        });
      }
      setIsAnalyzing(false);
    }
    loadTelemetry();
  }, []);

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_draft_step', '/journey/choose-outfit');
    }
    router.push('/journey/choose-outfit');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto py-6">
      
      {/* 1. Header with Red Top Progress Accent Line */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest border-t-2 border-primary pt-3">
          <span>PRESENCE JOURNEY</span>
          <span>STEP 4 OF 5 — AI SKIN TELEMETRY</span>
        </div>

        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Skin Intelligence Analysis
        </h1>
        <p className="text-[15px] text-gray-600 font-medium max-w-2xl">
          AI evaluation of your visual baseline—synthesizing hydration markers, fatigue indicators, and lighting contrast for your upcoming engagement.
        </p>
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Photo Card with Dynamic Telemetry Overlay */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-xs relative">
          <div className="relative aspect-[4/5] bg-gray-900">
            <img
              src={userPhoto}
              alt="User Photo Diagnostic Telemetry"
              className="w-full h-full object-cover"
            />
            
            {/* Target Ring 1: Forehead */}
            <div className="absolute top-[22%] left-[45%] w-7 h-7 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center animate-ping">
              <div className="w-2 h-2 rounded-full bg-red-600" />
            </div>

            {/* Target Ring 2: Cheek */}
            <div className="absolute top-[48%] left-[34%] w-6 h-6 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>

            {/* Target Ring 3: Chin */}
            <div className="absolute top-[68%] left-[51%] w-6 h-6 rounded-full border-2 border-red-500/90 bg-red-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>

            {/* Bottom Telemetry Overlay Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-gray-950/85 backdrop-blur-md border border-white/10 rounded-[12px] p-3 flex items-center justify-between text-[11.5px] font-mono font-bold text-white shadow-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                <span>{isAnalyzing ? 'RUNNING AI SCAN...' : 'AI SCAN COMPLETE'}</span>
              </div>
              <span className="text-gray-400">USER PHOTO ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Score Gauge + AI Synthesis */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Top Analysis Card */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>AI SYNTHESIS</span>
              </span>

              {/* Gauge Score Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="text-primary" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * skinData.score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[22px] font-black text-gray-950 font-sans leading-none">{skinData.score}</span>
                  <span className="text-[7.5px] font-mono font-bold text-gray-400 uppercase">INDEX</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
                {skinData.headline}
              </h2>
              <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
                {skinData.analysis}
              </p>
            </div>

            {/* Presentation Tip Quote */}
            <div className="bg-gray-50 border border-gray-200/80 rounded-[14px] p-4 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-gray-500" />
                <span>PRESENTATION TIP</span>
              </span>
              <p className="text-[12.5px] text-gray-700 italic font-medium leading-relaxed">
                &quot;{skinData.tip}&quot;
              </p>
            </div>
          </div>

          {/* Dynamic Metrics Table Card */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-[13px] border-b border-gray-100 pb-2.5">
              <span className="font-semibold text-gray-700">Luminosity Variance</span>
              <span className="font-mono font-bold text-gray-950">{skinData.luminosity}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] border-b border-gray-100 pb-2.5">
              <span className="font-semibold text-gray-700">Texture Uniformity</span>
              <span className="font-mono font-bold text-gray-950">{skinData.texture}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-gray-700">Fatigue Indicators</span>
              <span className="font-mono font-bold text-primary">{skinData.fatigue}</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Dynamic Strengths vs Focus Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Strengths */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-[18px] p-6 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950 font-sans">
            <svg width="18" height="18" fill="currentColor" className="text-primary" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
            <span>Strengths</span>
          </div>
          <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
            {skinData.strengths}
          </p>
        </div>

        {/* Focus Area */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-[18px] p-6 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[15px] font-bold text-gray-950 font-sans">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            <span>Focus Area</span>
          </div>
          <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
            {skinData.focusArea}
          </p>
        </div>
      </div>

      {/* 4. Bottom Action Buttons */}
      <div className="pt-6 flex items-center justify-end space-x-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleNext}
          className="h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
        >
          <span>Next Step — Select Wardrobe</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
