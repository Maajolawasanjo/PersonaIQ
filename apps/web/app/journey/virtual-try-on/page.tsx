'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ZoomIn, RotateCw, ArrowRight, Check } from 'lucide-react';
import { stylistApi } from '@/lib/api/services';

export default function VirtualTryOnPage() {
  const router = useRouter();
  const [selectedOutfit, setSelectedOutfit] = useState<number>(1);
  const [userPhoto, setUserPhoto] = useState<string>('/images/professional-female-headshot.jpg');
  const [vtoResult, setVtoResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
      if (savedPhoto) {
        setUserPhoto(savedPhoto);
      }
    }
  }, []);

  const wardrobeOptions = [
    {
      id: 1,
      name: 'Executive Minimalist',
      tag: 'Charcoal / High Contrast',
      image: '/images/brown-peaked-lapel-suit.jpg',
      score: 94,
      vibe: 'High Authority',
    },
    {
      id: 2,
      name: 'Startup Approachable',
      tag: 'Navy / Soft Tonal',
      image: '/images/ascot-knit-polo-tan.jpg',
      score: 88,
      vibe: 'Balanced Approachability',
    },
    {
      id: 3,
      name: 'Architectural Form',
      tag: 'Burgundy / Structured',
      image: '/images/563018699011466.jpeg',
      score: 91,
      vibe: 'Structured Precision',
    },
  ];

  const currentOption = wardrobeOptions.find((o) => o.id === selectedOutfit) || wardrobeOptions[0];

  const triggerVtoComposite = async (garmentUrl: string) => {
    setIsGenerating(true);
    try {
      const res = await stylistApi.vtoPreview({
        user_id: 'active_session',
        garment_url: garmentUrl,
      });
      if (res?.preview_url) {
        setVtoResult(res.preview_url);
      }
    } catch (e) {
      console.warn('VTO endpoint preview fallback:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOutfitSelect = (opt: typeof wardrobeOptions[0]) => {
    setSelectedOutfit(opt.id);
    triggerVtoComposite(opt.image);
  };

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_draft_step', '/journey/presence-index');
    }
    router.push('/journey/presence-index');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Main Grid: Control Panel (Left) + Showroom Avatar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Control Card */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[24px] p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              REAL VIRTUAL TRY-ON
            </span>
            <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
              Virtual Try-On™ Studio
            </h1>
            <p className="text-[13px] text-gray-600 font-medium">
              Evaluating tailored garments directly against your uploaded baseline selfie photo.
            </p>
          </div>

          {/* Generating Status Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-3.5 flex items-center space-x-2.5">
            <Sparkles className={`w-4 h-4 text-red-650 shrink-0 ${isGenerating ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="text-[12.5px] font-mono font-bold text-gray-900">
              {isGenerating ? 'Rendering AI VTO Garment Match...' : 'AI Garment Fitting Active'}
            </span>
          </div>

          {/* Wardrobe Options List */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              SELECT WARDROBE LOOK
            </span>

            {wardrobeOptions.map((opt) => {
              const isSelected = selectedOutfit === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleOutfitSelect(opt)}
                  className={`p-3 rounded-[16px] border transition-all cursor-pointer flex items-center space-x-3.5 ${
                    isSelected
                      ? 'border-2 border-red-600 bg-red-50/10 ring-2 ring-red-100'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-gray-100 shrink-0">
                    <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">
                      {opt.name}
                    </h3>
                    <p className="text-[11.5px] text-gray-500 font-mono">
                      {opt.tag}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="w-full h-12 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Continue to Presence Index</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Fitting Room Canvas */}
        <div className="lg:col-span-7 bg-gray-950 border border-gray-800 rounded-[24px] overflow-hidden shadow-lg relative min-h-[560px] flex flex-col justify-between p-6">
          {/* Top Room Header */}
          <div className="flex items-center justify-between text-[13px] font-sans text-gray-300 relative z-10">
            <span className="font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>User Photo Fitting Room</span>
            </span>
            <div className="flex items-center space-x-2 text-[14px]">
              <span className="text-[11px] font-mono text-gray-400">Garment Match: {currentOption.name}</span>
            </div>
          </div>

          {/* Center Avatar Preview: User Selfie Composite */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[20px] overflow-hidden border border-white/20 shadow-2xl">
              {/* User Real Photo */}
              <img
                src={vtoResult || userPhoto}
                alt="User Fitting Baseline"
                className="w-full h-full object-cover"
              />

              {/* Garment Preview Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-gray-950/85 backdrop-blur-md border border-white/10 p-3 rounded-[14px] flex items-center space-x-3">
                <img
                  src={currentOption.image}
                  alt={currentOption.name}
                  className="w-12 h-12 rounded-[8px] object-cover border border-white/20"
                />
                <div className="text-left">
                  <span className="text-[12px] font-bold text-white block">{currentOption.name}</span>
                  <span className="text-[10px] font-mono text-gray-400 block">{currentOption.tag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Overlay */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-[18px] shadow-sm text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center text-[15px] font-bold text-white font-sans bg-red-950/40">
                {currentOption.score}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                  PRESENCE INDEX™
                </span>
                <span className="text-[12.5px] font-bold text-white font-sans">
                  {currentOption.vibe}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-[10px] border border-white/10">
              Fitting Target: <span className="text-emerald-400 font-bold">100% User Baseline Match</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
