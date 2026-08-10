'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ShoppingBag,
  Zap
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';

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

const AVATARS = [
  { id: 'black_male', label: 'Black Male Model', image: '/vto and more/black male.png' },
  { id: 'black_female', label: 'Black Female Model', image: '/vto and more/black female.png' },
  { id: 'white_male', label: 'White Male Model', image: '/vto and more/white male.png' },
  { id: 'white_female', label: 'White Female Model', image: '/vto and more/white female.png' },
];

export default function StyleMePage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('interview');
  const [targetVibe, setTargetVibe] = useState<string>('Authoritative');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('black_male');
  const [activeTab, setActiveTab] = useState<'catalog' | 'online' | 'upload' | 'closet'>('catalog');
  const [productUrl, setProductUrl] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [vtoPreview, setVtoPreview] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);

  useEffect(() => {
    async function fetchGaps() {
      try {
        const res = await stylistApi.getWardrobeGaps(selectedOccasion);
        setGapAnalysis(res.data);
      } catch (err) {
        console.error('Gap analysis fetch error:', err);
      }
    }
    fetchGaps();
  }, [selectedOccasion]);

  const handleGenerateRecommendation = async () => {
    setIsGenerating(true);
    try {
      const res = await stylistApi.recommendLook(selectedOccasion, targetVibe, 'Business Formal');
      setRecommendation(res);
    } catch (err) {
      console.error('Failed to generate recommendation:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunVto = async () => {
    try {
      const res = await stylistApi.vtoPreview(selectedAvatar, recommendation?.items || []);
      setVtoPreview(res.data);
    } catch (err) {
      console.error('VTO execution error:', err);
    }
  };

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;
    try {
      await stylistApi.importProduct(productUrl);
      alert('Product imported successfully to your wardrobe!');
      setProductUrl('');
    } catch (err) {
      alert('Failed to import product URL.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-fadeIn">
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
            Personalized executive styling intelligence powered by Featherless Llama 3.3 LLM & YouCam VTO.
          </p>
        </div>

        <Link
          href="/wardrobe"
          className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg flex items-center space-x-2 transition-all"
        >
          <Shirt className="w-4 h-4" />
          <span>My Closet</span>
        </Link>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Occasion & Styling Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Occasion Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 font-mono">
              1. What Are You Dressing For?
            </h2>
            
            <div className="grid grid-cols-2 gap-2.5">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all text-xs font-semibold ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 text-red-950 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className="truncate">{occ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Avatar Model Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 font-mono">
              2. Select Model / Avatar
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                    selectedAvatar === av.id
                      ? 'border-red-600 bg-red-50/40 text-gray-950 font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 text-red-600" />
                  <span className="text-xs">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Wardrobe Gap Analysis Card */}
          {gapAnalysis && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Wardrobe Gap Readiness</span>
                </h2>
                <span className="text-sm font-extrabold text-gray-900 font-mono">
                  {gapAnalysis.readiness_score}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    gapAnalysis.readiness_score >= 80
                      ? 'bg-emerald-500'
                      : gapAnalysis.readiness_score >= 50
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${gapAnalysis.readiness_score}%` }}
                />
              </div>

              {gapAnalysis.missing_essential_items?.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Missing Essentials:
                  </p>
                  {gapAnalysis.missing_essential_items.map((missing: string, idx: number) => (
                    <div key={idx} className="text-xs text-amber-900 bg-amber-50/60 px-3 py-1.5 rounded-lg border border-amber-200/50">
                      ⚠️ {missing}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Action Trigger */}
          <button
            onClick={handleGenerateRecommendation}
            disabled={isGenerating}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Ask AI Stylist for Look</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Recommendation & VTO Preview Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recommendation Card */}
          {recommendation ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-xs animate-fadeIn">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-950">
                    {recommendation.look_name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Structured Llama 3.3 Executive Reasoning
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-red-600 font-mono">
                    {recommendation.total_score}
                  </span>
                  <span className="text-xs text-gray-400 font-mono"> / 100</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                  Recommended Outfit Combination
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {recommendation.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200/60 rounded-xl">
                      <p className="text-[11px] text-gray-400 font-mono uppercase">{item.category}</p>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">{item.item_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Stylist Explanation */}
              <div className="p-4 bg-red-50/30 border border-red-100 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-red-950 flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span>Stylist Analysis</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">
                  {recommendation.reasoning?.summary}
                </p>
              </div>

              {/* VTO Launch Button */}
              <button
                onClick={handleRunVto}
                className="w-full h-11 bg-gray-950 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <span>Try This Look in VTO Studio</span>
                <ArrowRight className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Select Your Occasion to Begin
              </h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Choose what event you are dressing for on the left, then click "Ask AI Stylist for Look" to generate structured styling analysis and VTO preview.
              </p>
            </div>
          )}

          {/* Online Product Importer Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center space-x-2">
              <Globe className="w-4 h-4 text-red-600" />
              <span>Import Garment from Online Store</span>
            </h3>

            <form onSubmit={handleImportProduct} className="flex gap-2">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Paste store URL (e.g., https://store.com/blazer)..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all"
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
