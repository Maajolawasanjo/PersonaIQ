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
  Sliders,
  Layers,
  Award,
  Cpu,
  RefreshCw,
  Camera,
  UserCheck
} from 'lucide-react';
import { stylistApi, userApi } from '@/lib/api/services';
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
  const [userSelfiePreview, setUserSelfiePreview] = useState<string | null>(null);

  // Featherless AI Live Reasoning State
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiStrengths, setAiStrengths] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Dynamic 30-Look dataset state
  const [recommendedLooks, setRecommendedLooks] = useState<VTOLookDefinition[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelfie = localStorage.getItem('personaiq_user_selfie_preview');
      if (savedSelfie) setUserSelfiePreview(savedSelfie);

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

      const savedDetails = localStorage.getItem('personaiq_event_details');
      if (savedDetails) setEventDetails(savedDetails);

      const savedSkin = localStorage.getItem('personaiq_skin_undertone');
      if (savedSkin) setSkinAnalysis(savedSkin);

      const savedBody = localStorage.getItem('personaiq_body_profile');
      if (savedBody) setBodyProfile(savedBody);

      // Check computer vision telemetry cache
      const cachedTelemetry = localStorage.getItem('personaiq_image_telemetry');
      if (cachedTelemetry) {
        try {
          const parsed = JSON.parse(cachedTelemetry);
          if (parsed.skinTone?.undertone) {
            setSkinAnalysis(`${parsed.skinTone.undertone} (${parsed.skinTone.lumaCategory || 'Medium'})`);
          }
        } catch (e) {
          // ignore error
        }
      }

      // Compute dynamic catalog recommendations
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

      // Fetch User DB Profile if available
      userApi.getProfile()
        .then((profile) => {
          if (profile.first_name) {
            // Logged in user profile active
          }
        })
        .catch(() => {
          // Anonymous or session-based journey
        });

      // Dispatch Featherless AI LLM reasoning request
      setIsLoadingAi(true);
      stylistApi.recommendLook(savedOccasion, savedVibe, savedDressCode)
        .then((res) => {
          if (res?.reasoning?.summary) {
            setAiReasoning(res.reasoning.summary);
          }
          if (res?.reasoning?.strengths && Array.isArray(res.reasoning.strengths)) {
            setAiStrengths(res.reasoning.strengths);
          }
          if (res?.total_score || res?.analysis?.occasion_fit) {
            const fitScore = res.total_score || res.analysis?.occasion_fit;
            setAiScore(fitScore);

            // Update top recommendation score with live Featherless AI rating
            setRecommendedLooks((prev) =>
              prev.map((l, idx) => (idx === 0 ? { ...l, score: fitScore } : l))
            );
          }
        })
        .catch((err) => {
          console.warn('Backend Featherless AI sync notice, using local dynamic reasoning canvas:', err);
        })
        .finally(() => {
          setIsLoadingAi(false);
        });
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
        localStorage.setItem('personaiq_active_presence_score', String(chosenLook.score));
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
            items: chosenLook.items.map((item) => ({
              category: item.category,
              name: item.name,
              image_url: item.image,
              image: item.image,
            })),
            aiReasoning: aiReasoning || chosenLook.description,
            clothing: { name: chosenLook.items[0]?.name || chosenLook.title, image_url: chosenLook.items[0]?.image || chosenLook.imageUrl, category: 'clothing' },
            footwear: { name: chosenLook.items[3]?.name || 'Matching Footwear', image_url: chosenLook.items[3]?.image || chosenLook.imageUrl, category: 'footwear' },
            occasion,
            dressCode,
            targetVibe,
          })
        );
        localStorage.setItem('personaiq_active_draft_step', '/journey/virtual-try-on');
      }

      // Live Backend Featherless AI Sync
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

  // Dynamic Color Swatches derived from skin undertone
  const isCool = skinAnalysis.toLowerCase().includes('cool');
  const colorSwatches = isCool
    ? [
        { color: '#1B263B', label: 'Midnight Blue' },
        { color: '#4A5568', label: 'Charcoal' },
        { color: '#A0AEC0', label: 'Ice Grey' },
        { color: '#2B6CB0', label: 'Sapphire' },
        { color: '#742A2A', label: 'Deep Plum' },
      ]
    : [
        { color: '#0F4C81', label: 'Dark Navy' },
        { color: '#708090', label: 'Slate Grey' },
        { color: '#D2B48C', label: 'Tan' },
        { color: '#8B4513', label: 'Cognac' },
        { color: '#58111A', label: 'Burgundy' },
      ];

  return (
    <div className="space-y-8 animate-fadeIn py-2">
      
      {/* ── TOP STEP & TITLE HEADER ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest border-t-2 border-red-600 pt-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>PRESENCE JOURNEY STAGE</span>
          </div>
          <span>STEP 9 OF 15 — OUTFIT SELECTION</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Choose Your Outfit Concept
            </h1>
            <p className="text-base text-gray-600 mt-1 max-w-3xl">
              We’ve curated top AI outfit concepts tailored precisely for your <span className="font-bold text-gray-950">{occasion}</span>. Select a look below to try on your uploaded selfie in the Virtual Studio.
            </p>
          </div>

          <Link
            href="/journey/event-type"
            className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-250 transition-colors flex items-center space-x-2 shrink-0 shadow-2xs self-start sm:self-auto"
          >
            <Pencil className="w-3.5 h-3.5 text-red-600" />
            <span>Edit Context</span>
          </Link>
        </div>
      </div>

      {/* ── READ-ONLY JOURNEY BRIEF BAR (4 SPACIOUS CONTEXT CARDS) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. OCCASION */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 flex items-center space-x-4 shadow-2xs hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">OCCASION</span>
            <span className="text-base font-bold text-gray-950 block truncate mt-0.5">{occasion}</span>
          </div>
        </div>

        {/* 2. DRESS CODE */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 flex items-center space-x-4 shadow-2xs hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
            <Shirt className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">DRESS CODE</span>
            <span className="text-base font-bold text-gray-950 block truncate mt-0.5">{dressCode}</span>
          </div>
        </div>

        {/* 3. TARGET VIBE */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 flex items-center space-x-4 shadow-2xs hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">TARGET VIBE</span>
            <span className="text-base font-bold text-gray-950 block truncate mt-0.5">{targetVibe}</span>
          </div>
        </div>

        {/* 4. PRESENCE GOAL */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4.5 flex items-center space-x-4 shadow-2xs hover:border-gray-300 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">PRESENCE GOAL</span>
            <span className="text-xs font-bold text-gray-950 leading-snug block line-clamp-2 mt-0.5">{presenceGoal}</span>
          </div>
        </div>

      </div>

      {/* ── TWO COLUMN MAIN LAYOUT: OUTFITS (LEFT 8-9 COLS) + SUMMARY (RIGHT 3-4 COLS) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT 8 COLS: AI RECOMMENDED OUTFITS & WARDROBE BANNER */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section Header with User Selfie Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-5 h-5 text-red-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-gray-900">
                AI RECOMMENDED OUTFIT CONCEPTS ({recommendedLooks.length})
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {userSelfiePreview && (
                <div className="flex items-center space-x-1.5 bg-red-50 border border-red-150 px-2.5 py-1 rounded-full text-xs font-bold text-red-700 shadow-2xs">
                  <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-red-300">
                    <img src={userSelfiePreview} alt="User selfie preview" className="w-full h-full object-cover" />
                  </div>
                  <span>Previewing for Your Selfie</span>
                </div>
              )}

              {isLoadingAi && (
                <span className="text-xs text-red-600 font-mono font-bold flex items-center space-x-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>FEATHERLESS AI ACTIVE...</span>
                </span>
              )}
            </div>
          </div>

          {/* 3 SPACIOUS AI RECOMMENDED OUTFIT CARDS (3-COLUMN GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedLooks.map((look, index) => {
              const isSelected = selectedLookId === look.id;
              const isFav = favoriteLooks.includes(look.id);
              const isBestMatch = index === 0;

              return (
                <div
                  key={look.id}
                  onClick={() => handleSelectLook(look.id)}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer relative flex flex-col justify-between group ${
                    isSelected
                      ? 'border-2 border-red-600 ring-4 ring-red-100 shadow-lg scale-[1.02] bg-red-50/10'
                      : 'border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Top Badges & High-Res Model Photo */}
                  <div className="relative aspect-[3/4] bg-gray-950 overflow-hidden">
                    <img
                      src={look.imageUrl}
                      alt={look.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Best Match Badge */}
                    {isBestMatch && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white font-mono font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 z-10">
                        <Sparkles className="w-3 h-3" />
                        <span>BEST MATCH</span>
                      </div>
                    )}

                    {/* Look Code Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/75 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md backdrop-blur-md z-10">
                      {look.code}
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, look.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                        isFav
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-black/40 hover:bg-black/60 text-white backdrop-blur-md'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Selected Checkmark Badge Overlay */}
                    {isSelected && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1.5 z-10 animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>SELECTED</span>
                      </div>
                    )}

                    {/* Try On My Photo CTA Badge */}
                    <div className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1 z-10 transition-transform group-hover:scale-105">
                      <span>Try On My Photo</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    
                    {/* Header Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
                          LOOK 0{index + 1}
                        </span>
                        <span className="text-xs font-mono font-medium text-gray-500 truncate">
                          {look.vibeMatch}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-extrabold text-gray-950 font-sans leading-snug">
                        {look.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {isBestMatch && aiReasoning ? aiReasoning : look.description}
                      </p>
                    </div>

                    {/* Score & Constituent Items Section */}
                    <div className="space-y-3 border-t border-gray-150 pt-3">
                      
                      {/* Presence Score Row */}
                      <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Presence Score</span>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-lg font-black text-gray-950 font-sans">{look.score}</span>
                            <span className="text-xs font-bold text-gray-400">/ 100</span>
                          </div>
                        </div>

                        {/* Circular Score Meter */}
                        <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-200"
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

                      {/* Constituent Item Swatches */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">SUGGESTED GARMENTS</span>
                        <div className="flex items-center space-x-1.5 pt-0.5">
                          {look.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-250 shrink-0 hover:scale-110 transition-transform shadow-2xs"
                              title={`${item.name} (${item.category})`}
                            >
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FEATURED OPTION BANNER: BUILD FROM MY WARDROBE */}
          <div className="bg-gradient-to-r from-red-50/80 via-white to-red-50/40 border-2 border-dashed border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:border-red-300 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-2xs">
                <Shirt className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <h3 className="text-base font-extrabold text-gray-950 font-sans">
                  Build from My Digital Wardrobe
                </h3>
                <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                  Prefer to assemble your own outfit? Pick items directly from your digital wardrobe to try on your photo in the Virtual Studio.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBrowseWardrobe}
              className="h-11 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Browse Wardrobe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* DYNAMIC RATIONALE BANNER: FEATHERLESS AI REASONING */}
          <div className="bg-gray-900 text-white border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-sans text-white">Featherless AI Personal Stylist Analysis</h4>
                  <span className="text-[11px] font-mono text-red-400 block">LLM Meta Llama Reasoning Engine Active</span>
                </div>
              </div>

              <Link
                href="/journey/explanation"
                className="text-xs font-bold text-gray-300 hover:text-white border border-gray-700 bg-gray-800 hover:bg-gray-700 px-3.5 py-1.5 rounded-xl transition-colors shrink-0 flex items-center space-x-1.5 shadow-2xs"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {aiReasoning ? (
                aiReasoning
              ) : (
                `Recommendations synthesize your ${skinAnalysis} skin undertone, ${bodyProfile} profile, and your goal to "${presenceGoal}" for a high-impact presentation.`
              )}
            </p>

            {aiStrengths.length > 0 && (
              <div className="pt-2 border-t border-gray-800 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">AI STRENGTHS:</span>
                {aiStrengths.map((str, i) => (
                  <span key={i} className="text-[11px] font-medium bg-red-950/80 text-red-200 border border-red-800/60 px-2.5 py-0.5 rounded-full">
                    ✓ {str}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM NAVIGATION ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <Link
              href="/journey/skin-intelligence"
              className="h-12 px-6 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-250 transition-colors flex items-center space-x-2 shrink-0 shadow-2xs"
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
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <span>Continue to Virtual Try-On Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-normal text-red-100 block mt-0.5">
                  Loads selected AI concept directly onto your photo in the Virtual Studio
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* RIGHT 4 COLS: YOUR JOURNEY SUMMARY SIDEBAR */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-600">
              YOUR JOURNEY SUMMARY
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Checklist of completed journey milestones */}
          <div className="space-y-4">
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Event Type</span>
                <span className="font-extrabold text-gray-950 text-sm block">{occasion}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Event Details</span>
                <span className="font-extrabold text-gray-950 text-sm block truncate">{eventDetails}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Dress Code</span>
                <span className="font-extrabold text-gray-950 text-sm block">{dressCode}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Target Vibe</span>
                <span className="font-extrabold text-gray-950 text-sm block">{targetVibe}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Skin Analysis</span>
                <span className="font-extrabold text-gray-950 text-sm block">{skinAnalysis}</span>
              </div>
            </div>

            {/* Best Colors Swatches - Dynamic based on Skin Undertone */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500 font-medium block">Best Colors ({isCool ? 'Cool Season' : 'Warm Season'})</span>
                <div className="flex items-center space-x-2">
                  {colorSwatches.map((item, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-gray-300 shadow-2xs transition-transform hover:scale-125 cursor-pointer"
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Body Profile</span>
                <span className="font-extrabold text-gray-950 text-sm block">{bodyProfile}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-500 font-medium block">Face Analysis</span>
                <span className="font-extrabold text-emerald-700 text-sm block">Completed</span>
              </div>
            </div>

          </div>

          {/* Bottom Celebration Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/60 border border-red-150 rounded-xl p-4 text-center space-y-1 shadow-2xs">
            <span className="text-2xl block">🎉</span>
            <h4 className="text-sm font-extrabold text-red-950 font-sans">
              You’re all set!
            </h4>
            <p className="text-xs text-red-800 font-medium">
              Select your favorite outfit concept above to proceed to Virtual Try-On.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
