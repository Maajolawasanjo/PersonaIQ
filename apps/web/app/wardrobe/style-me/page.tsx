'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Shirt,
  User,
  Camera,
  Upload,
  Globe,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
  Footprints,
  Watch,
  Scissors,
  Check,
  Layers
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';
import { VTO_CATALOG, VTO_MODELS, getRecommendedAssets, VTOAsset, generateGeminiStylistReasoning } from '@/lib/catalog/vtoCatalog';

const OCCASIONS = [
  { id: 'interview', name: 'Job Interview', icon: Briefcase },
  { id: 'meeting', name: 'Business Meeting', icon: Sparkles },
  { id: 'wedding', name: 'Wedding', icon: User },
  { id: 'church', name: 'Church / Religious', icon: CheckCircle2 },
  { id: 'funeral', name: 'Burial / Funeral', icon: AlertTriangle },
  { id: 'date', name: 'Date Night', icon: Sparkles },
  { id: 'travel', name: 'Travel / Transit', icon: Globe },
  { id: 'conference', name: 'Executive Conference', icon: Briefcase },
  { id: 'traditional', name: 'Traditional Ceremony', icon: User },
  { id: 'party', name: 'Gala / Party', icon: Sparkles },
];

export default function StyleMePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState<string>('interview');
  const [targetVibe, setTargetVibe] = useState<string>('Authoritative');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('male_black');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'clothing' | 'footwear' | 'accessories' | 'style_references'>('clothing');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('cloth-navy-suit-001');

  const [productUrl, setProductUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [userUploads, setUserUploads] = useState<VTOAsset[]>([]);

  // Filter catalog based on occasion and active tab
  const recommendedCatalog = getRecommendedAssets(selectedOccasion, activeCatalogTab);
  const allCategoryItems = [...userUploads.filter((u) => u.category === activeCatalogTab), ...recommendedCatalog];

  const activeSelectedAsset =
    userUploads.find((u) => u.id === selectedAssetId) ||
    VTO_CATALOG.find((c) => c.id === selectedAssetId) ||
    VTO_CATALOG[0];

  const handleCompleteMyLook = async () => {
    setIsGenerating(true);
    try {
      const topClothing = getRecommendedAssets(selectedOccasion, 'clothing')[0] || VTO_CATALOG[0];
      const topShoe = getRecommendedAssets(selectedOccasion, 'footwear')[0] || VTO_CATALOG[13];
      const topAcc = getRecommendedAssets(selectedOccasion, 'accessories')[0] || VTO_CATALOG[20];
      const topHair = getRecommendedAssets(selectedOccasion, 'style_references')[0] || VTO_CATALOG[23];

      setSelectedAssetId(topClothing.id);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'personaiq_complete_look',
          JSON.stringify({
            clothing: topClothing,
            footwear: topShoe,
            accessories: topAcc,
            hairstyle: topHair,
            occasion: selectedOccasion,
          })
        );
        localStorage.setItem('personaiq_user_outfit_preview', topClothing.image_url);
        localStorage.setItem('personaiq_selected_outfit_title', topClothing.name);
      }

      const dynamicAnalysis = generateGeminiStylistReasoning(
        selectedOccasion,
        targetVibe,
        topClothing,
        topShoe,
        topAcc,
        topHair
      );
      setRecommendation(dynamicAnalysis);
    } catch (e) {
      console.warn('Complete my look error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskAiStylist = async () => {
    setIsGenerating(true);
    try {
      const res = await stylistApi.recommendLook(selectedOccasion, targetVibe, 'Business Formal');
      if (res && res.reasoning) {
        setRecommendation(res);
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      console.warn('AI Stylist recommendation using local Gemini engine:', err);
      const activeGarment = VTO_CATALOG.find((c) => c.id === selectedAssetId);
      const dynamicAnalysis = generateGeminiStylistReasoning(
        selectedOccasion,
        targetVibe,
        activeGarment
      );
      setRecommendation(dynamicAnalysis);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;

    let fallbackName = 'Online Store Garment';
    let fallbackCategory: 'clothing' | 'footwear' | 'accessories' = 'clothing';
    const lowerUrl = productUrl.toLowerCase();
    
    if (lowerUrl.includes('shoe') || lowerUrl.includes('boot') || lowerUrl.includes('sneaker') || lowerUrl.includes('loafer')) {
      fallbackCategory = 'footwear';
      fallbackName = 'Imported Footwear';
    } else if (lowerUrl.includes('watch') || lowerUrl.includes('belt') || lowerUrl.includes('tie') || lowerUrl.includes('bag')) {
      fallbackCategory = 'accessories';
      fallbackName = 'Imported Luxury Accessory';
    } else if (lowerUrl.includes('dress') || lowerUrl.includes('suit') || lowerUrl.includes('blazer') || lowerUrl.includes('shirt')) {
      fallbackCategory = 'clothing';
      fallbackName = 'Imported Apparel Item';
    }

    try {
      const res = await stylistApi.importProduct(productUrl);
      if (res?.data) {
        const newItem: VTOAsset = {
          id: res.data.id || `imported_${Date.now()}`,
          name: res.data.name || fallbackName,
          category: res.data.category || fallbackCategory,
          subcategory: 'imported',
          gender: 'unisex',
          asset_type: 'product',
          image_url: res.data.photo_url || productUrl,
          occasions: [selectedOccasion],
          is_active: true,
        };
        setUserUploads((prev) => [newItem, ...prev]);
        setSelectedAssetId(newItem.id);
        setProductUrl('');
        return;
      }
    } catch (err) {
      console.warn('Backend product import offline, using client URL importer:', err);
    }

    const newItem: VTOAsset = {
      id: `imported_${Date.now()}`,
      name: fallbackName,
      category: fallbackCategory,
      subcategory: 'imported',
      gender: 'unisex',
      asset_type: 'product',
      image_url: productUrl, // Uses direct pasted URL
      occasions: [selectedOccasion],
      is_active: true,
    };
    setUserUploads((prev) => [newItem, ...prev]);
    setSelectedAssetId(newItem.id);
    setProductUrl('');
  };

  const handleRunVto = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_user_outfit_preview', activeSelectedAsset.image_url);
      localStorage.setItem('personaiq_selected_outfit_title', activeSelectedAsset.name);
      localStorage.setItem('personaiq_vto_avatar_id', selectedAvatarId);
    }
    router.push('/journey/virtual-try-on');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-fadeIn">
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-950 font-sans">
              AI Personal Stylist & VTO Studio
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Personalized executive styling intelligence powered by Gemini Reasoning & YouCam Visual AI.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunVto}
          className="h-11 px-6 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <span>Launch VTO Fitting Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Occasion & Fitting Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Occasion Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center justify-between">
              <span>1. Target Engagement</span>
              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">AI Occasion Query</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all text-xs font-semibold ${
                      isSelected
                        ? 'border-red-600 bg-red-50/60 text-red-950 shadow-2xs font-bold'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className="truncate">{occ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Fitting Model / Avatar Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
              2. Select Fitting Model Baseline
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {VTO_MODELS.map((model) => {
                const isSelected = selectedAvatarId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(model.id)}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50/60 ring-2 ring-red-100 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200">
                      <img src={model.image_url} alt={model.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[12px] block truncate font-sans ${isSelected ? 'font-bold text-gray-950' : 'font-medium text-gray-700'}`}>
                        {model.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 block">
                        {isSelected ? 'Active Model' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCompleteMyLook}
              disabled={isGenerating}
              className="w-full h-13 bg-[#5c0612] hover:bg-[#4a050e] text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>✨ Complete My Look (AI Auto-Match)</span>
                </>
              )}
            </button>

            <button
              onClick={handleAskAiStylist}
              disabled={isGenerating}
              className="w-full h-10 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-red-600" />
              <span>Ask AI Stylist for Complete Strategy</span>
            </button>
          </div>

        </div>

        {/* Right Column: VTO Category Catalog Tabs & AI Reasoning Layer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero Banner for Selected Asset */}
          <div className="bg-white border-2 border-red-600 rounded-2xl overflow-hidden shadow-sm space-y-0">
            <div className="relative aspect-[16/9] bg-gray-950">
              <img src={activeSelectedAsset.image_url} alt={activeSelectedAsset.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-gray-950/85 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[11px] font-mono font-bold text-white border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SELECTED ACTIVE GARMENT</span>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-950 font-sans">{activeSelectedAsset.name}</h3>
                <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 mt-0.5">
                  <span className="capitalize font-bold text-gray-800">{activeSelectedAsset.category}</span>
                  <span>•</span>
                  <span className="capitalize">{activeSelectedAsset.subcategory}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunVto}
                className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Try On Model</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VTO Category Filter Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                ASSET CATALOG ({allCategoryItems.length} ITEMS)
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Occasion: <strong className="text-red-600 uppercase">{selectedOccasion}</strong>
              </span>
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('clothing')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeCatalogTab === 'clothing'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shirt className="w-4 h-4" />
                <span>Clothing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('footwear')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeCatalogTab === 'footwear'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Footwear</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('accessories')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeCatalogTab === 'accessories'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Watch className="w-4 h-4" />
                <span>Accessories</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('style_references')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeCatalogTab === 'style_references'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>Hairstyles</span>
              </button>
            </div>

            {/* Asset Item Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
              {allCategoryItems.map((item) => {
                const isSelected = selectedAssetId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAssetId(item.id)}
                    className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all relative ${
                      isSelected ? 'border-2 border-red-600 shadow-md ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold z-10">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <div className="aspect-[4/3] bg-gray-900 overflow-hidden">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 space-y-0.5 bg-white">
                      <h4 className="text-[12px] font-bold text-gray-950 font-sans truncate">{item.name}</h4>
                      <p className="text-[10px] font-mono text-gray-500 uppercase truncate">{item.subcategory}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Strategy Breakdown & "Why This Works" Reasoning */}
          {recommendation && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold text-gray-950 font-sans">
                    Gemini AI Stylist Analysis
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  {recommendation.total_score} Match Score
                </span>
              </div>

              {/* Complete Look Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendation.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">{item.category}</span>
                    <span className="text-[12.5px] font-bold text-gray-950 block">{item.item_name}</span>
                  </div>
                ))}
              </div>

              {/* WHY THIS WORKS Breakdown Box */}
              <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-mono font-bold text-red-700 uppercase tracking-widest block">
                  💡 WHY THIS WORKS (AI REASONING LAYER)
                </span>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {recommendation.reasoning?.summary ||
                    `This combination establishes high executive authority for ${selectedOccasion.toUpperCase()}. Deep navy/dark tones communicate structure and credibility.`}
                </p>
              </div>
            </div>
          )}

          {/* Online Product Importer Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center space-x-2">
              <Globe className="w-4 h-4 text-red-600" />
              <span>Import Garment from Online Store</span>
            </h3>

            <form onSubmit={handleImportProduct} className="flex gap-2">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Paste store URL (e.g. https://store.com/blazer)..."
                className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-950 hover:bg-black text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Import
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
