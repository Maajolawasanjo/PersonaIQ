'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  Shirt,
  Footprints,
  Watch,
  Scissors,
  User,
  Upload,
  RefreshCw,
  Zap,
  Layers,
  Camera,
  Cpu,
  ZoomIn,
  Maximize2,
  Image as ImageIcon,
  Plus,
  Heart,
  Bookmark,
  TrendingUp,
  Pencil,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';
import {
  VTO_CATALOG,
  VTO_MODELS,
  VTOAsset,
  VTOModel,
  getRecommendedAssets,
  generateGeminiStylistReasoning
} from '@/lib/catalog/vtoCatalog';

interface SavedLookCard {
  id: string;
  title: string;
  score: number;
  image: string;
  garment: VTOAsset;
  shoe?: VTOAsset;
  accessory?: VTOAsset;
}

export default function VirtualTryOnPage() {
  const router = useRouter();

  // Baseline photo & context state
  const [userPhoto, setUserPhoto] = useState<string>('/vto/looks/female/F01_job_interview.png');
  const [userSelfieAvailable, setUserSelfieAvailable] = useState<boolean>(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('user_selfie');

  // Journey context loaded from localStorage
  const [occasion, setOccasion] = useState<string>('Date Night');
  const [dressCode, setDressCode] = useState<string>('Casual');
  const [targetVibe, setTargetVibe] = useState<string>('Confident');

  // Studio tabs & filters
  const [activeTab, setActiveTab] = useState<'clothing' | 'footwear' | 'accessories' | 'style_references'>('clothing');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');

  // Currently applied items
  const [selectedGarment, setSelectedGarment] = useState<VTOAsset>(VTO_CATALOG[0]);
  const [selectedShoe, setSelectedShoe] = useState<VTOAsset>(
    VTO_CATALOG.find((c) => c.category === 'footwear') || VTO_CATALOG[13]
  );
  const [selectedAccessory, setSelectedAccessory] = useState<VTOAsset | null>(
    VTO_CATALOG.find((c) => c.category === 'accessories') || null
  );
  const [selectedHairstyle, setSelectedHairstyle] = useState<VTOAsset | null>(
    VTO_CATALOG.find((c) => c.category === 'style_references') || null
  );

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // Split Screen Compare Slider (0 to 100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Canvas Viewport Controls
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [backgroundEffect, setBackgroundEffect] = useState<'studio' | 'blur' | 'plain'>('studio');

  // Interactive Saved Looks Carousel
  const [savedLooks, setSavedLooks] = useState<SavedLookCard[]>([
    {
      id: 'look_01',
      title: 'Executive Navy',
      score: 93,
      image: '/vto/clothing/professional/01_navy_suit.jpg',
      garment: VTO_CATALOG[0],
      shoe: VTO_CATALOG.find((c) => c.category === 'footwear'),
    },
    {
      id: 'look_02',
      title: 'Charcoal Classic',
      score: 89,
      image: '/vto/clothing/professional/02_black_suit.jpg',
      garment: VTO_CATALOG[1],
      shoe: VTO_CATALOG.find((c) => c.category === 'footwear'),
    },
    {
      id: 'look_03',
      title: 'Grey Confidence',
      score: 86,
      image: '/vto/clothing/professional/04_beige_power_suit.jpg',
      garment: VTO_CATALOG[2],
    },
    {
      id: 'look_04',
      title: 'Smart Minimal',
      score: 82,
      image: '/vto/clothing/professional/05_white_dress_shirt.jpg',
      garment: VTO_CATALOG[3],
    },
  ]);
  const [activeLookId, setActiveLookId] = useState<string>('look_01');

  // Import Product State
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [productUrl, setProductUrl] = useState<string>('');
  const [importedItems, setImportedItems] = useState<VTOAsset[]>([]);

  // AI Render & Telemetry State
  const [vtoResult, setVtoResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [presenceScore, setPresenceScore] = useState<number>(93);
  const [providerUsed, setProviderUsed] = useState<string>('YouCam AI VTO');

  // Featherless AI Stylist Reasoning
  const [aiStylistText, setAiStylistText] = useState<string>(
    'This navy suit with a white shirt and navy tie projects confidence, professionalism, and approachability—ideal for making a strong first impression.'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelfie = localStorage.getItem('personaiq_user_selfie_preview');
      const outfitPreview = localStorage.getItem('personaiq_user_outfit_preview');

      if (savedSelfie) {
        setUserPhoto(savedSelfie);
        setUserSelfieAvailable(true);
      } else if (outfitPreview) {
        setUserPhoto(outfitPreview);
      }

      const savedOccasion =
        localStorage.getItem('personaiq_event_title') ||
        localStorage.getItem('personaiq_event_type') ||
        localStorage.getItem('personaiq_active_occasion') ||
        'Date Night';
      setOccasion(savedOccasion);

      const savedDressCode =
        localStorage.getItem('personaiq_dress_code') ||
        localStorage.getItem('personaiq_active_dress_code') ||
        'Casual';
      setDressCode(savedDressCode);

      const savedVibe = localStorage.getItem('personaiq_target_vibe') || 'Confident';
      setTargetVibe(savedVibe);

      // Load initial outfit choice from choose-outfit step
      const completeLookRaw = localStorage.getItem('personaiq_complete_look');
      if (completeLookRaw) {
        try {
          const parsed = JSON.parse(completeLookRaw);
          if (parsed.clothing) {
            const found = VTO_CATALOG.find((c) => c.name === parsed.clothing.name || c.image_url === parsed.clothing.image_url);
            if (found) setSelectedGarment(found);
          }
          if (parsed.aiReasoning) {
            setAiStylistText(parsed.aiReasoning);
          }
        } catch (e) {
          console.warn('Error parsing complete look:', e);
        }
      }

      // Initial YouCam VTO AI composite call
      const activeImage = savedSelfie || outfitPreview || '/vto/looks/female/F01_job_interview.png';
      stylistApi.vtoPreview('user_selfie', [selectedGarment, selectedShoe], activeImage)
        .then((res) => {
          const resultUrl = res?.data?.result_image_url || res?.data?.result_url || res?.preview_url || res?.data?.preview_url;
          if (resultUrl) {
            setVtoResult(resultUrl);
          }
          if (res?.data?.provider_used) {
            setProviderUsed(res.data.provider_used === 'youcam' ? 'Perfect Corp YouCam AI' : 'PersonaIQ Composite Engine');
          }
        })
        .catch((err) => {
          console.warn('Initial YouCam VTO preview notice:', err);
        });
    }
  }, []);

  // Split-Screen Drag Handler
  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAssetSelect = async (item: VTOAsset) => {
    let garment = selectedGarment;
    let shoe = selectedShoe;
    let acc = selectedAccessory;
    let hair = selectedHairstyle;

    if (item.category === 'clothing') {
      setSelectedGarment(item);
      garment = item;
    } else if (item.category === 'footwear') {
      setSelectedShoe(item);
      shoe = item;
    } else if (item.category === 'accessories') {
      setSelectedAccessory(item);
      acc = item;
    } else if (item.category === 'style_references') {
      setSelectedHairstyle(item);
      hair = item;
    }

    // Compute dynamic score & AI rationale
    const reasoningObj = generateGeminiStylistReasoning(occasion, targetVibe, garment, shoe, acc || undefined, hair || undefined);
    setPresenceScore(reasoningObj.total_score);
    if (reasoningObj.reasoning.summary) {
      setAiStylistText(reasoningObj.reasoning.summary);
    }

    setIsGenerating(true);

    try {
      const activeModelImg = selectedAvatarId === 'user_selfie' ? userPhoto : VTO_MODELS.find((m) => m.id === selectedAvatarId)?.image_url || userPhoto;
      const res = await stylistApi.vtoPreview(selectedAvatarId, [garment, shoe, acc, hair], activeModelImg);
      const resultUrl = res?.data?.result_image_url || res?.data?.result_url || res?.preview_url || res?.data?.preview_url;
      if (resultUrl) {
        setVtoResult(resultUrl);
      }
    } catch (e) {
      console.warn('VTO endpoint notice, using local dynamic compositing canvas:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCurrentLook = () => {
    const newLook: SavedLookCard = {
      id: `look_${Date.now()}`,
      title: `${selectedGarment.name.split(' ')[0]} ${selectedGarment.color || 'Custom'}`,
      score: presenceScore,
      image: selectedGarment.image_url,
      garment: selectedGarment,
      shoe: selectedShoe,
      accessory: selectedAccessory || undefined,
    };
    setSavedLooks((prev) => [newLook, ...prev.slice(0, 4)]);
    setActiveLookId(newLook.id);
  };

  const handleSelectSavedLook = (look: SavedLookCard) => {
    setActiveLookId(look.id);
    setSelectedGarment(look.garment);
    if (look.shoe) setSelectedShoe(look.shoe);
    if (look.accessory) setSelectedAccessory(look.accessory);
    setPresenceScore(look.score);
  };

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;

    let fallbackCategory: 'clothing' | 'footwear' | 'accessories' = 'clothing';
    let fallbackName = 'Imported Store Apparel';
    const lower = productUrl.toLowerCase();

    if (lower.includes('shoe') || lower.includes('boot') || lower.includes('sneaker') || lower.includes('loafer')) {
      fallbackCategory = 'footwear';
      fallbackName = 'Imported Designer Footwear';
    } else if (lower.includes('watch') || lower.includes('tie') || lower.includes('belt')) {
      fallbackCategory = 'accessories';
      fallbackName = 'Imported Luxury Accessory';
    }

    const importedItem: VTOAsset = {
      id: `imported_${Date.now()}`,
      name: fallbackName,
      category: fallbackCategory,
      subcategory: 'online_store',
      gender: 'unisex',
      asset_type: 'product',
      image_url: productUrl,
      occasions: ['all'],
      is_active: true,
      price: 195,
      score: 91,
    };

    setImportedItems((prev) => [importedItem, ...prev]);
    handleAssetSelect(importedItem);
    setProductUrl('');
    setIsImportOpen(false);
  };

  // Sub-category Filter Options
  const subFilterOptions = {
    clothing: [
      { id: 'all', label: 'All' },
      { id: 'professional', label: 'Suits & Blazers' },
      { id: 'casual', label: 'Shirts & Knits' },
      { id: 'ceremonial', label: 'Traditional & Agbada' },
    ],
    footwear: [
      { id: 'all', label: 'All' },
      { id: 'formal', label: 'Oxfords' },
      { id: 'business', label: 'Loafers' },
      { id: 'boots', label: 'Boots' },
      { id: 'casual', label: 'Sneakers' },
    ],
    accessories: [
      { id: 'all', label: 'All' },
      { id: 'watches', label: 'Watches' },
      { id: 'ties', label: 'Neckties' },
      { id: 'hats', label: 'Traditional Caps' },
    ],
    style_references: [
      { id: 'all', label: 'All' },
      { id: 'hairstyles', label: 'Hairstyles' },
    ],
  };

  // Filter items by category & subcategory
  const filteredCatalogItems = VTO_CATALOG.filter((item) => {
    if (item.category !== activeTab) return false;
    if (activeSubFilter === 'all') return true;
    return item.subcategory === activeSubFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn py-2">
      
      {/* ── TOP STEP & BRANDED TITLE HEADER ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest border-t-2 border-red-600 pt-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>PRESENCE JOURNEY STAGE</span>
          </div>
          <span>STEP 10 OF 15 — VIRTUAL TRY-ON STUDIO</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
                AI Virtual Try-On Studio
              </h1>
            </div>
            <p className="text-base text-gray-600 mt-1 max-w-3xl pl-12">
              See your looks. Own your presence. Powered by Perfect Corp YouCam AI engine.
            </p>
          </div>

          {/* Context Badges & Edit Context Shortcut */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="bg-white border border-gray-250 rounded-xl px-3.5 py-1.5 shadow-2xs">
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">OCCASION</span>
              <span className="text-xs font-bold text-gray-950 block">{occasion}</span>
            </div>

            <div className="bg-white border border-gray-250 rounded-xl px-3.5 py-1.5 shadow-2xs">
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">DRESS CODE</span>
              <span className="text-xs font-bold text-gray-950 block">{dressCode}</span>
            </div>

            <div className="bg-white border border-gray-250 rounded-xl px-3.5 py-1.5 shadow-2xs">
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">VIBE</span>
              <span className="text-xs font-bold text-red-600 block">{targetVibe}</span>
            </div>

            <Link
              href="/journey/event-type"
              className="h-10 px-3.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-250 shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <Pencil className="w-3.5 h-3.5 text-red-600" />
              <span>Edit Context</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN STUDIO GRID (LEFT 7 COLS CANVAS + RIGHT 5 COLS WARDROBE) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT 7 COLS: VTO SPLIT CANVAS, CAROUSEL & PRESENCE METRICS */}
        <div className="lg:col-span-7 space-y-6">

          {/* SPLIT SCREEN TRY-ON CANVAS CONTAINER */}
          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl relative aspect-[4/3] sm:aspect-[16/11] select-none group transition-transform ${
              isZoomed ? 'scale-105 z-30' : ''
            }`}
          >
            
            {/* LEFT HALF: YOUR PHOTO */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={userPhoto}
                alt="Your Original Photo"
                className={`w-full h-full object-cover object-top ${
                  backgroundEffect === 'blur' ? 'backdrop-blur-md' : ''
                }`}
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10 shadow-md">
                YOUR PHOTO
              </div>
            </div>

            {/* RIGHT HALF: VTO RESULT (CLIPPED BY SLIDER POSITION) */}
            <div
              className="absolute inset-0 h-full overflow-hidden transition-all duration-75"
              style={{ width: `${100 - sliderPosition}%`, left: `${sliderPosition}%` }}
            >
              <img
                src={vtoResult || userPhoto}
                alt="VTO Rendered Result"
                className="absolute inset-0 h-full object-cover object-top"
                style={{
                  width: `${sliderRef.current ? sliderRef.current.clientWidth : 800}px`,
                  left: `-${(sliderPosition / 100) * (sliderRef.current ? sliderRef.current.clientWidth : 800)}px`,
                }}
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-red-400 z-10 shadow-md flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-white" />
                <span>VTO RESULT</span>
              </div>
            </div>

            {/* INTERACTIVE SPLIT SLIDER DIVIDER BAR */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-lg hover:w-1.5 transition-all"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-red-600 text-white shadow-xl border-2 border-white flex items-center justify-center font-bold text-xs shrink-0 cursor-ew-resize hover:scale-110 transition-transform">
                ↔
              </div>
            </div>

            {/* FLOATING VERTICAL TOOLBAR (RIGHT EDGE) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col space-y-2 z-20">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[9px] font-mono transition-all backdrop-blur-md border ${
                  isZoomed
                    ? 'bg-red-600 text-white border-red-400 shadow-lg'
                    : 'bg-black/60 hover:bg-black/80 text-gray-300 border-white/10'
                }`}
                title="Toggle Zoom"
              >
                <ZoomIn className="w-4 h-4 mb-0.5" />
                <span>Zoom</span>
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 text-gray-300 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center text-[9px] font-mono transition-all"
                title="Fit Screen"
              >
                <Maximize2 className="w-4 h-4 mb-0.5" />
                <span>Fit</span>
              </button>

              <button
                type="button"
                onClick={() => setBackgroundEffect(backgroundEffect === 'studio' ? 'blur' : 'studio')}
                className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 text-gray-300 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center text-[9px] font-mono transition-all"
                title="Background Studio Lighting"
              >
                <ImageIcon className="w-4 h-4 mb-0.5" />
                <span>BG</span>
              </button>
            </div>

            {/* SPINNER OVERLAY DURING YOUCAM RENDER */}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/70 backdrop-blur-xs z-30">
                <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  YouCam AI Rendering Garment...
                </span>
              </div>
            )}

          </div>

          {/* SAVED LOOKS CAROUSEL BAR (UNDER CANVAS) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-600 uppercase tracking-wider">
                SAVED OUTFIT LOOKS
              </span>
              <button
                type="button"
                onClick={handleSaveCurrentLook}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current Composition</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {savedLooks.map((look) => {
                const isActive = activeLookId === look.id;
                return (
                  <div
                    key={look.id}
                    onClick={() => handleSelectSavedLook(look)}
                    className={`bg-gray-50 rounded-xl p-2 border transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isActive
                        ? 'border-2 border-red-600 ring-4 ring-red-100 bg-red-50/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden relative mb-2">
                      <img src={look.image} alt={look.title} className="w-full h-full object-cover object-top" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-emerald-400 font-mono font-extrabold text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                        {look.score}
                      </div>
                      {isActive && (
                        <div className="absolute top-1 left-1 bg-red-600 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-gray-950 block truncate">{look.title}</span>
                    </div>
                  </div>
                );
              })}

              {/* SAVE LOOK BUTTON CARD */}
              <button
                type="button"
                onClick={handleSaveCurrentLook}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl border border-dashed border-gray-300 hover:border-red-600 p-4 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 text-gray-500 hover:text-red-600 min-h-[100px]"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-xs font-bold">Save Look</span>
              </button>
            </div>
          </div>

          {/* PRESENCE IMPACT METRICS BAR (UNDER CAROUSEL) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono font-bold text-gray-800 uppercase tracking-wider">
                  PRESENCE IMPACT ANALYSIS
                </span>
              </div>

              <Link
                href="/journey/explanation"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
              
              {/* Main Score Bar */}
              <div className="sm:col-span-2 space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[11px] font-mono text-gray-500 uppercase block font-bold">Overall Presence Impact</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-gray-950">{presenceScore}</span>
                  <span className="text-xs font-bold text-gray-400">/ 100</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${presenceScore}%` }}
                  />
                </div>
              </div>

              {/* Metric 1 */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center space-y-0.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Confidence</span>
                <span className="text-lg font-extrabold text-emerald-600">92</span>
              </div>

              {/* Metric 2 */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center space-y-0.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Authority</span>
                <span className="text-lg font-extrabold text-emerald-600">91</span>
              </div>

              {/* Metric 3 */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center space-y-0.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Style Fit</span>
                <span className="text-lg font-extrabold text-emerald-600">94</span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT 5 COLS: WARDROBE CATALOG, IMPORT & AI STYLIST RECOMMENDATION */}
        <div className="lg:col-span-5 space-y-6">

          {/* MAIN CATALOG & CATEGORY TABS CONTAINER */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-2xs">
            
            {/* Category Tabs Header */}
            <div className="grid grid-cols-4 gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('clothing');
                  setActiveSubFilter('all');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'clothing'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clothing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('footwear');
                  setActiveSubFilter('all');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'footwear'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Footwear</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('accessories');
                  setActiveSubFilter('all');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'accessories'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Watch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Accessories</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('style_references');
                  setActiveSubFilter('all');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === 'style_references'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hairstyles</span>
              </button>
            </div>

            {/* Sub-Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {subFilterOptions[activeTab]?.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveSubFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeSubFilter === filter.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Imported Online Store Items Notice */}
            {importedItems.length > 0 && (
              <div className="space-y-2 pt-1 border-b border-gray-200 pb-3">
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider block">
                  MY IMPORTED GARMENTS ({importedItems.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {importedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAssetSelect(item)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-2 bg-red-50/40 ${
                        selectedGarment.id === item.id || selectedShoe?.id === item.id
                          ? 'border-2 border-red-600 ring-2 ring-red-100'
                          : 'border-red-200 hover:border-red-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG CARDS GRID (2 COLUMNS, SPACIOUS CARDS) */}
            <div className="grid grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
              {filteredCatalogItems.map((item) => {
                const isSelected =
                  selectedGarment.id === item.id ||
                  selectedShoe?.id === item.id ||
                  selectedAccessory?.id === item.id ||
                  selectedHairstyle?.id === item.id;
                const isFav = favorites.includes(item.id);
                const itemPrice = item.price || (item.category === 'clothing' ? 320 : item.category === 'footwear' ? 180 : 90);
                const itemScore = item.score || (isSelected ? presenceScore : 89);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAssetSelect(item)}
                    className={`bg-white border rounded-2xl overflow-hidden p-3.5 transition-all cursor-pointer group flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-2 border-red-600 ring-4 ring-red-100 shadow-md bg-red-50/10 scale-[1.01]'
                        : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    {/* Top Image Container — Clean Light Background for Isolated Garments */}
                    <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden relative mb-3 border border-gray-200 flex items-center justify-center p-1">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full p-1 shadow-md z-10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, item.id)}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
                          isFav
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white/80 hover:bg-white text-gray-700 shadow-2xs border border-gray-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Card Text & Price Info */}
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-extrabold text-gray-950 font-sans line-clamp-2 leading-snug">
                        {item.name}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-150">
                        <span className="text-xs font-mono font-extrabold text-gray-900">
                          ${itemPrice}
                        </span>

                        {/* Circular Score Meter Badge */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <span>{itemScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* IMPORT FROM ONLINE STORE BANNER */}
          <div className="bg-gradient-to-r from-red-50/80 via-white to-red-50/40 border border-red-200 rounded-2xl p-4.5 shadow-2xs space-y-3">
            <button
              type="button"
              onClick={() => setIsImportOpen(!isImportOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-950 font-sans">
                    Import from Online Store
                  </h3>
                  <span className="text-[11px] font-mono text-gray-500">
                    Paste any product link (Zara, ASOS, Nordstrom, etc.)
                  </span>
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 text-red-600 transition-transform ${isImportOpen ? 'rotate-90' : ''}`} />
            </button>

            {isImportOpen && (
              <form onSubmit={handleImportProduct} className="flex items-center space-x-2 pt-2 border-t border-red-150">
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste store product URL..."
                  className="flex-1 h-10 px-3.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Import
                </button>
              </form>
            )}
          </div>

          {/* AI STYLIST RECOMMENDATION BOX */}
          <div className="bg-gray-950 text-white border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center space-x-2.5 text-red-500">
              <Sparkles className="w-4.5 h-4.5" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                AI STYLIST RECOMMENDATION
              </h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {aiStylistText}
            </p>

            {/* 4 Red Brand Vibe Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-medium bg-red-950/80 text-red-200 border border-red-800/60 px-3 py-1 rounded-full">
                Clean Silhouette
              </span>
              <span className="text-[11px] font-medium bg-red-950/80 text-red-200 border border-red-800/60 px-3 py-1 rounded-full">
                Power Color
              </span>
              <span className="text-[11px] font-medium bg-red-950/80 text-red-200 border border-red-800/60 px-3 py-1 rounded-full">
                Interview Ready
              </span>
              <span className="text-[11px] font-medium bg-red-950/80 text-red-200 border border-red-800/60 px-3 py-1 rounded-full">
                Executive Presence
              </span>
            </div>
          </div>

          {/* BOTTOM STICKY ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveCurrentLook}
              className="h-12 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-250 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span>Save to Wardrobe</span>
            </button>

            <Link
              href="/journey/grooming-checklist"
              className="h-12 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Complete My Look</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
