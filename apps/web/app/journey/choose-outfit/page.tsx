'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Shirt,
  Target,
  Sparkles,
  Check,
  CheckCircle2,
  Heart,
  Pencil,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Sliders,
  Layers,
  Award
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';
import { getRecommendedLooksForSession, VTOLookDefinition } from '@/lib/catalog/looksCatalog';

export default function ChooseOutfitPage() {
  const router = useRouter();

  // State management
  const [selectedLookId, setSelectedLookId] = useState<string>('');
  const [favoriteLooks, setFavoriteLooks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Stored context state from earlier journey steps
  const [userGender, setUserGender] = useState<'male' | 'female'>('male');
  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [dressCode, setDressCode] = useState<string>('Business Formal');
  const [targetVibe, setTargetVibe] = useState<string>('Confident');
  const [presenceGoal, setPresenceGoal] = useState<string>('Make a strong, trustworthy first impression');
  const [eventDetails, setEventDetails] = useState<string>('Corporate, On-site');
  const [skinAnalysis, setSkinAnalysis] = useState<string>('Warm Neutral');
  const [bodyProfile, setBodyProfile] = useState<string>('Athletic Build');

  // Dynamic 30-Look dataset state
  const [recommendedLooks, setRecommendedLooks] = useState<VTOLookDefinition[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id') || '';
      const isFemale = savedAvatarId.includes('female') || localStorage.getItem('personaiq_user_gender') === 'female';
      const currentGender: 'male' | 'female' = isFemale ? 'female' : 'male';
      setUserGender(currentGender);

      const savedOccasion = localStorage.getItem('personaiq_event_type') || 'Job Interview';
      setOccasion(savedOccasion);

      const savedDressCode = localStorage.getItem('personaiq_dress_code') || 'Business Formal';
      setDressCode(savedDressCode);

      const savedVibe = localStorage.getItem('personaiq_target_vibe') || 'Confident';
      setTargetVibe(savedVibe);

      const savedGoal = localStorage.getItem('personaiq_presence_goal');
      if (savedGoal) setPresenceGoal(savedGoal);

      const savedSkin = localStorage.getItem('personaiq_skin_undertone');
      if (savedSkin) setSkinAnalysis(savedSkin);

      // Compute dynamic 30-look recommendations
      const { primary, alternatives } = getRecommendedLooksForSession({
        gender: currentGender,
        occasion: savedOccasion,
        targetVibe: savedVibe,
      });

      const combined = [primary, ...alternatives];
      setRecommendedLooks(combined);

      const savedLook = localStorage.getItem('personaiq_selected_look_id');
      if (savedLook && combined.some((l) => l.id === savedLook)) {
        setSelectedLookId(savedLook);
      } else {
        setSelectedLookId(primary.id);
      }
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteLooks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectLook = (id: string) => {
    setSelectedLookId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_selected_look_id', id);
    }
  };

  const handleContinueToVTO = async () => {
    setIsSubmitting(true);
    const chosenLook = recommendedLooks.find((l) => l.id === selectedLookId) || recommendedLooks[0];

    try {
      if (typeof window !== 'undefined' && chosenLook) {
        localStorage.setItem('personaiq_selected_outfit_title', chosenLook.title);
        localStorage.setItem('personaiq_user_outfit_preview', chosenLook.imageUrl);
        localStorage.setItem(
          'personaiq_complete_look',
          JSON.stringify({
            id: chosenLook.id,
            code: chosenLook.code,
            title: chosenLook.title,
            score: chosenLook.score,
            imageUrl: chosenLook.imageUrl,
            vibeMatch: chosenLook.vibeMatch,
            colorPalette: chosenLook.colorPalette,
            items: chosenLook.items,
            clothing: { name: chosenLook.items[0]?.name || chosenLook.title, image_url: chosenLook.items[0]?.image || chosenLook.imageUrl, category: 'clothing' },
            footwear: { name: chosenLook.items[3]?.name || 'Matching Footwear', image_url: chosenLook.items[3]?.image || chosenLook.imageUrl, category: 'footwear' },
            occasion,
            dressCode,
            targetVibe,
          })
        );
        localStorage.setItem('personaiq_active_draft_step', '/journey/virtual-try-on');
      }

      // Backend sync
      await stylistApi.recommendLook(occasion, targetVibe, dressCode);
    } catch (e) {
      console.warn('Backend sync notice, carrying forward local choice:', e);
    } finally {
      setIsSubmitting(false);
      router.push('/journey/virtual-try-on');
    }
  };

  const handleBrowseWardrobe = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_use_custom_wardrobe', 'true');
      localStorage.setItem('personaiq_active_draft_step', '/journey/virtual-try-on');
    }
    router.push('/journey/virtual-try-on');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* ── TOP HEADER: JOURNEY PROGRESS BAR (15 STEPS) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-150 px-6 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 flex-1">
            <span className="text-[13px] font-bold text-gray-700 font-sans shrink-0">
              Journey Progress
            </span>

            {/* 15 Step Bar */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <React.Fragment key={step}>
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="w-3 sm:w-5 h-[2px] bg-red-600 shrink-0" />
                </React.Fragment>
              ))}

              {/* Step 9 (ACTIVE) */}
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-red-100 shrink-0 shadow-xs">
                9
              </div>

              {[10, 11, 12, 13, 14, 15].map((step) => (
                <React.Fragment key={step}>
                  <div className="w-3 sm:w-5 h-[2px] bg-gray-200 shrink-0" />
                  <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-[10px] font-medium shrink-0 bg-white">
                    {step}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Exit Journey */}
          <Link
            href="/dashboard"
            className="h-9 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg border border-gray-250 transition-colors flex items-center space-x-1.5 shrink-0 shadow-2xs"
          >
            <span>Exit Journey</span>
            <LogOut className="w-3.5 h-3.5 text-gray-500" />
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* PAGE TITLE HEADER */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest block">
            STEP 9 OF 15
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Choose Your Outfit
          </h1>
          <p className="text-sm text-gray-600 max-w-3xl">
            We’ve curated the best outfit options for your occasion. Choose one to try in the Virtual Try-On studio.
          </p>
        </div>

        {/* READ-ONLY JOURNEY BRIEF BAR (4 CONTEXT CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. OCCASION */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">OCCASION</span>
              <span className="text-[14px] font-bold text-gray-950 block truncate">{occasion}</span>
            </div>
          </div>

          {/* 2. DRESS CODE */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <Shirt className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">DRESS CODE</span>
              <span className="text-[14px] font-bold text-gray-950 block truncate">{dressCode}</span>
            </div>
          </div>

          {/* 3. TARGET VIBE */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <Target className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">TARGET VIBE</span>
              <span className="text-[14px] font-bold text-gray-950 block truncate">{targetVibe}</span>
            </div>
          </div>

          {/* 4. PRESENCE GOAL */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">PRESENCE GOAL</span>
              <span className="text-[12.5px] font-bold text-gray-950 leading-tight block line-clamp-2">{presenceGoal}</span>
            </div>
          </div>

        </div>

        {/* ── TWO COLUMN LAYOUT: OUTFITS GRID (LEFT) + SUMMARY SIDEBAR (RIGHT) ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT 8 COLS: AI RECOMMENDED OUTFITS & RATIONALE */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">
                  AI RECOMMENDED OUTFITS
                </h2>
              </div>
              <Link
                href="/journey/event-type"
                className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Context</span>
              </Link>
            </div>

            {/* 4 CARDS GRID (3 RECOMMENDED LOOKS + BUILD FROM WARDROBE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {recommendedLooks.map((look, index) => {
                const isSelected = selectedLookId === look.id;
                const isFav = favoriteLooks.includes(look.id);
                const isBestMatch = index === 0;

                return (
                  <div
                    key={look.id}
                    onClick={() => handleSelectLook(look.id)}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-red-600 ring-4 ring-red-100 shadow-md scale-[1.01]'
                        : 'border-gray-200 hover:border-gray-300 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Top Badges & Model Image */}
                    <div className="relative aspect-[3/4] bg-gray-950 overflow-hidden group">
                      <img
                        src={look.imageUrl}
                        alt={look.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Best Match Badge */}
                      {isBestMatch && (
                        <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-white font-mono font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>BEST MATCH</span>
                        </div>
                      )}

                      {/* Code Badge */}
                      <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white font-mono font-bold text-[9.5px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {look.code}
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, look.id)}
                        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isFav
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-red-600 block uppercase tracking-wider">
                            LOOK 0{index + 1}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-gray-500">
                            {look.vibeMatch}
                          </span>
                        </div>
                        <h3 className="text-[14.5px] font-extrabold text-gray-950 font-sans leading-tight">
                          {look.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">
                          {look.description}
                        </p>
                      </div>

                      {/* Score Gauge & Item Swatches */}
                      <div className="space-y-2.5 border-t border-gray-100 pt-2.5">
                        
                        {/* Score Indicator */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9.5px] font-mono text-gray-400 block uppercase">Presence Score</span>
                            <div className="flex items-baseline space-x-0.5">
                              <span className="text-[16px] font-extrabold text-gray-950 font-sans">{look.score}</span>
                              <span className="text-[11px] font-bold text-gray-400">/100</span>
                            </div>
                          </div>

                          {/* Circular Gauge */}
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-150"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-emerald-500"
                                strokeDasharray={`${look.score}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Constituent Item Thumbnails */}
                        <div className="flex items-center space-x-1 pt-1">
                          {look.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0"
                              title={`${item.name} (${item.category})`}
                            >
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 4TH CARD: BUILD FROM MY WARDROBE */}
              <div className="bg-red-50/40 border-2 border-dashed border-red-200 rounded-2xl p-5 flex flex-col justify-between text-center space-y-4 hover:border-red-300 transition-colors">
                <div className="my-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-950 font-sans">
                      Build from My Wardrobe
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      Create your own look using items from your wardrobe.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBrowseWardrobe}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Browse Wardrobe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* BOTTOM RATIONALE BANNER */}
            <div className="bg-red-50/60 border border-red-150 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950 font-sans">Why these looks?</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    These recommendations are based on your skin tone, body profile, color season, and the goals of your occasion.
                  </p>
                </div>
              </div>

              <Link
                href="/journey/explanation"
                className="text-xs font-bold text-red-700 hover:text-red-900 border border-red-200 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center space-x-1.5 shadow-2xs"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* BOTTOM NAVIGATION ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <Link
                href="/journey/skin-intelligence"
                className="h-11 px-5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-250 transition-colors flex items-center space-x-2 shrink-0 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500" />
                <span>Back</span>
              </Link>

              <button
                type="button"
                onClick={handleContinueToVTO}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-13 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <div className="text-center sm:text-left">
                  <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
                    <span>Continue to Virtual Try-On Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="text-[10.5px] font-normal text-red-200 block">
                    See your selected look on you
                  </span>
                </div>
              </button>
            </div>

          </div>

          {/* RIGHT 4 COLS: YOUR JOURNEY SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
              YOUR JOURNEY SUMMARY
            </h2>

            {/* Checklist of completed journey milestones */}
            <div className="space-y-3.5 text-xs font-medium">
              
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Event Type</span>
                  <span className="font-bold text-gray-950 text-[13px]">{occasion}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Event Details</span>
                  <span className="font-bold text-gray-950 text-[13px]">{eventDetails}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Dress Code</span>
                  <span className="font-bold text-gray-950 text-[13px]">{dressCode}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Target Vibe</span>
                  <span className="font-bold text-gray-950 text-[13px]">{targetVibe}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Skin Analysis</span>
                  <span className="font-bold text-gray-950 text-[13px]">{skinAnalysis}</span>
                </div>
              </div>

              {/* Best Colors Swatches */}
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-gray-500 block text-[11px]">Best Colors</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#0F4C81] border border-gray-200" title="Dark Navy" />
                    <span className="w-4 h-4 rounded-full bg-[#708090] border border-gray-200" title="Slate Grey" />
                    <span className="w-4 h-4 rounded-full bg-[#D2B48C] border border-gray-200" title="Tan" />
                    <span className="w-4 h-4 rounded-full bg-[#8B4513] border border-gray-200" title="Cognac" />
                    <span className="w-4 h-4 rounded-full bg-[#58111A] border border-gray-200" title="Burgundy" />
                    <span className="text-[10px] font-mono font-bold text-gray-400">+3</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Body Profile</span>
                  <span className="font-bold text-gray-950 text-[13px]">{bodyProfile}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Face Analysis</span>
                  <span className="font-bold text-emerald-700 text-[13px]">Completed</span>
                </div>
              </div>

            </div>

            {/* Bottom Celebration Card */}
            <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 text-center space-y-1">
              <span className="text-xl block">🎉</span>
              <h4 className="text-xs font-bold text-red-950 font-sans">
                You’re all set!
              </h4>
              <p className="text-[11px] text-red-700">
                Let’s find your best look.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
