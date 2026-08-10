'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
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
  Layers
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';
import { VTO_CATALOG, VTO_MODELS, VTOAsset, VTOModel, getRecommendedAssets } from '@/lib/catalog/vtoCatalog';

export default function VirtualTryOnPage() {
  const router = useRouter();

  // Baseline photo or avatar model selection
  const [userPhoto, setUserPhoto] = useState<string>('/vto/models/female/black/female_black_base.jpg');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('user_selfie');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'clothing' | 'footwear' | 'accessories' | 'style_references'>('clothing');

  // Currently tried-on assets
  const [selectedGarment, setSelectedGarment] = useState<VTOAsset>(VTO_CATALOG[0]);
  const [selectedShoe, setSelectedShoe] = useState<VTOAsset>(
    VTO_CATALOG.find((c) => c.category === 'footwear') || VTO_CATALOG[12]
  );
  const [selectedAccessory, setSelectedAccessory] = useState<VTOAsset | null>(
    VTO_CATALOG.find((c) => c.category === 'accessories') || null
  );
  const [selectedHairstyle, setSelectedHairstyle] = useState<VTOAsset | null>(
    VTO_CATALOG.find((c) => c.category === 'style_references') || null
  );

  const [userUploads, setUserUploads] = useState<VTOAsset[]>([]);
  const [productUrl, setProductUrl] = useState<string>('');
  const [vtoResult, setVtoResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [presenceScore, setPresenceScore] = useState<number>(96);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
      if (savedPhoto) {
        setUserPhoto(savedPhoto);
      }
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');
      if (savedAvatarId) {
        setSelectedAvatarId(savedAvatarId);
      }

      const completeLookRaw = localStorage.getItem('personaiq_complete_look');
      if (completeLookRaw) {
        try {
          const parsed = JSON.parse(completeLookRaw);
          if (parsed.clothing) setSelectedGarment(parsed.clothing);
          if (parsed.footwear) setSelectedShoe(parsed.footwear);
          if (parsed.accessories) setSelectedAccessory(parsed.accessories);
          if (parsed.hairstyle) setSelectedHairstyle(parsed.hairstyle);
        } catch (e) {
          console.warn('Error parsing complete look:', e);
        }
      } else {
        const savedOutfitUrl = localStorage.getItem('personaiq_user_outfit_preview');
        const savedOutfitTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Selected Attire';
        if (savedOutfitUrl) {
          const found = VTO_CATALOG.find((item) => item.image_url === savedOutfitUrl);
          if (found) {
            setSelectedGarment(found);
          } else {
            // Dynamically construct asset from user outfit choice
            setSelectedGarment({
              id: `user_outfit_${Date.now()}`,
              name: savedOutfitTitle,
              category: 'clothing',
              subcategory: 'professional',
              gender: 'unisex',
              asset_type: 'product',
              image_url: savedOutfitUrl,
              occasions: ['all'],
              is_active: true,
            });
          }
        }
      }

      const savedScore = localStorage.getItem('personaiq_active_presence_score');
      if (savedScore) setPresenceScore(parseInt(savedScore, 10));
    }
  }, []);

  const activeModelImage =
    selectedAvatarId === 'user_selfie'
      ? userPhoto
      : VTO_MODELS.find((m) => m.id === selectedAvatarId)?.image_url || userPhoto;

  const handleAssetSelect = async (item: VTOAsset) => {
    let garment = selectedGarment;
    let shoe = selectedShoe;
    let acc = selectedAccessory;
    let hair = selectedHairstyle;

    if (item.category === 'clothing') {
      setSelectedGarment(item);
      garment = item;
    }
    if (item.category === 'footwear') {
      setSelectedShoe(item);
      shoe = item;
    }
    if (item.category === 'accessories') {
      setSelectedAccessory(item);
      acc = item;
    }
    if (item.category === 'style_references') {
      setSelectedHairstyle(item);
      hair = item;
    }

    setIsGenerating(true);

    // Compute deterministic presence telemetry score based on items cohesion
    let baseScore = 91;
    if (garment.subcategory === 'professional') baseScore += 4;
    if (shoe?.subcategory === 'formal' || shoe?.subcategory === 'business') baseScore += 3;
    if (acc) baseScore += 1;
    if (hair) baseScore += 1;
    const finalScore = Math.min(99, baseScore);
    setPresenceScore(finalScore);

    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_presence_score', finalScore.toString());
      localStorage.setItem('personaiq_user_outfit_preview', garment.image_url);
      localStorage.setItem('personaiq_selected_outfit_title', garment.name);
    }

    try {
      const res = await stylistApi.vtoPreview(selectedAvatarId, [garment, shoe, acc, hair], activeModelImage);
      if (res?.preview_url || res?.data?.preview_url) {
        setVtoResult(res.preview_url || res.data.preview_url);
      }
    } catch (e) {
      console.warn('VTO endpoint preview notice, using local dynamic compositing canvas:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;

    let fallbackCategory: 'clothing' | 'footwear' | 'accessories' = 'clothing';
    let fallbackName = 'Imported Garment';
    const lower = productUrl.toLowerCase();

    if (lower.includes('shoe') || lower.includes('boot') || lower.includes('sneaker') || lower.includes('loafer')) {
      fallbackCategory = 'footwear';
      fallbackName = 'Imported Shoes';
    } else if (lower.includes('watch') || lower.includes('belt') || lower.includes('bag')) {
      fallbackCategory = 'accessories';
      fallbackName = 'Imported Accessory';
    } else if (lower.includes('suit') || lower.includes('dress') || lower.includes('blazer')) {
      fallbackCategory = 'clothing';
      fallbackName = 'Imported Apparel';
    }

    try {
      const res = await stylistApi.importProduct(productUrl);
      if (res?.data) {
        const newItem: VTOAsset = {
          id: res.data.id || `imported_${Date.now()}`,
          name: res.data.name || fallbackName,
          category: res.data.category || fallbackCategory,
          subcategory: 'online_store',
          gender: 'unisex',
          asset_type: 'product',
          image_url: res.data.photo_url || productUrl,
          occasions: ['all'],
          is_active: true,
        };
        setUserUploads((prev) => [newItem, ...prev]);
        handleAssetSelect(newItem);
        setProductUrl('');
        return;
      }
    } catch (err) {
      console.warn('Backend product import service notice, using direct URL import:', err);
    }

    const importedItem: VTOAsset = {
      id: `imported_${Date.now()}`,
      name: fallbackName,
      category: fallbackCategory,
      subcategory: 'online_store',
      gender: 'unisex',
      asset_type: 'product',
      image_url: productUrl, // Uses direct pasted URL
      occasions: ['all'],
      is_active: true,
    };
    setUserUploads((prev) => [importedItem, ...prev]);
    handleAssetSelect(importedItem);
    setProductUrl('');
  };

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_draft_step', '/journey/presence-index');
    }
    router.push('/journey/presence-index');
  };

  const catalogItems = [
    ...userUploads.filter((u) => u.category === activeCatalogTab),
    ...VTO_CATALOG.filter((item) => item.category === activeCatalogTab),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-widest block">
            PRESENCE JOURNEY STAGE • VIRTUAL TRY-ON
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 font-sans mt-0.5">
            Virtual Try-On™ Interactive Studio
          </h1>
          <p className="text-sm text-gray-600">
            Dress your selected fitting model or uploaded selfie live on the spot. Click clothes, shoes, accessories, or hairstyles to composite instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <span>Finalize Presence Index</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Wardrobe Selector (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[24px] p-5 shadow-xs space-y-5">
          
          {/* 1. Fitting Model / Baseline Toggle */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              1. CHOOSE FITTING MODEL BASELINE
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAvatarId('user_selfie')}
                className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                  selectedAvatarId === 'user_selfie'
                    ? 'border-2 border-red-600 bg-red-50/60 font-bold shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200">
                  <img src={userPhoto} alt="My Uploaded Selfie" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <span className="text-[11.5px] block font-bold text-gray-950 truncate">My Photo</span>
                  <span className="text-[9.5px] font-mono text-gray-400 block">Uploaded Selfie</span>
                </div>
              </button>

              {VTO_MODELS.map((model) => {
                const isSelected = selectedAvatarId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarId(model.id);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('personaiq_vto_avatar_id', model.id);
                      }
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50/60 font-bold shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200">
                      <img src={model.image_url} alt={model.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="truncate">
                      <span className="text-[11.5px] block font-bold text-gray-950 truncate">{model.name}</span>
                      <span className="text-[9.5px] font-mono text-gray-400 block">Built-in Model</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Import URL */}
          <form onSubmit={handleImportProduct} className="space-y-2 border-t border-gray-100 pt-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              2. IMPORT GARMENT STORE URL
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Paste store or image URL..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 cursor-pointer transition-colors"
              >
                Import
              </button>
            </div>
          </form>

          {/* 3. On-The-Spot VTO Category Tabs */}
          <div className="space-y-3 border-t border-gray-100 pt-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              3. SELECT ITEMS TO DRESS MODEL
            </span>

            <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('clothing')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeCatalogTab === 'clothing' ? 'bg-white text-red-600 shadow-2xs' : 'text-gray-600'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('footwear')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeCatalogTab === 'footwear' ? 'bg-white text-red-600 shadow-2xs' : 'text-gray-600'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Shoes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('accessories')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeCatalogTab === 'accessories' ? 'bg-white text-red-600 shadow-2xs' : 'text-gray-600'
                }`}
              >
                <Watch className="w-3.5 h-3.5" />
                <span>Extras</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('style_references')}
                className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  activeCatalogTab === 'style_references' ? 'bg-white text-red-600 shadow-2xs' : 'text-gray-600'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Hair</span>
              </button>
            </div>

            {/* Item Gallery */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {catalogItems.map((item) => {
                const isSelected =
                  selectedGarment?.id === item.id ||
                  selectedShoe?.id === item.id ||
                  selectedAccessory?.id === item.id ||
                  selectedHairstyle?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAssetSelect(item)}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50/60 ring-2 ring-red-100 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-950 shrink-0 border border-gray-200">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11.5px] font-bold text-gray-950 truncate font-sans">{item.name}</h4>
                      <p className="text-[9.5px] font-mono text-gray-500 uppercase truncate">{item.subcategory}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Proceed with Selection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Interactive Fitting Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-950 border border-gray-800 rounded-[24px] overflow-hidden shadow-lg relative min-h-[620px] flex flex-col justify-between p-6">
          
          {/* Room Header */}
          <div className="flex items-center justify-between text-[13px] font-sans text-gray-300 relative z-10">
            <span className="font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {selectedAvatarId === 'user_selfie' ? 'Uploaded Photo Fitting Room' : 'Built-in Model Fitting Room'}
              </span>
            </span>

            {isGenerating && (
              <span className="text-xs font-mono font-bold text-red-400 flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Compositing Garment...</span>
              </span>
            )}
          </div>

          {/* Model Canvas Composite Centerpiece */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[20px] overflow-hidden border border-white/20 shadow-2xl bg-gray-900">
              
              {/* Model Base Image */}
              <img
                src={vtoResult || activeModelImage}
                alt="Fitting Canvas Model"
                className="w-full h-full object-contain p-2"
              />

              {/* Live Garment Preview Overlay Badge */}
              <div className="absolute top-4 right-4 bg-gray-950/90 border border-white/20 p-2.5 rounded-[14px] shadow-lg flex items-center space-x-3 pointer-events-auto">
                <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-red-500/50">
                  <img src={selectedGarment.image_url} alt={selectedGarment.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-400 block uppercase">TRIED-ON ATTIRE</span>
                  <span className="text-[12px] font-bold text-white block max-w-[130px] truncate">{selectedGarment.name}</span>
                </div>
              </div>

              {/* Applied Layer Badges */}
              <div className="absolute bottom-4 left-4 right-4 bg-gray-950/85 backdrop-blur-md border border-white/10 p-3 rounded-[14px] space-y-2">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={selectedGarment.image_url}
                    alt={selectedGarment.name}
                    className="w-10 h-10 rounded-lg object-contain bg-gray-900 border border-white/20 shrink-0 p-1"
                  />
                  <div className="min-w-0">
                    <span className="text-[11.5px] font-bold text-white block truncate">{selectedGarment.name}</span>
                    <span className="text-[9.5px] font-mono text-gray-400 block uppercase">Garment: {selectedGarment.subcategory}</span>
                  </div>
                </div>

                {selectedShoe && (
                  <div className="flex items-center space-x-2 text-[10.5px] text-gray-300 border-t border-white/10 pt-1.5">
                    <Footprints className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">Shoe: {selectedShoe.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Presence Telemetry Overlay */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-900/90 backdrop-blur-md border border-white/10 p-3.5 rounded-[18px] shadow-sm text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center text-[15px] font-bold text-white font-sans bg-red-950/40">
                {presenceScore}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                  PRESENCE INDEX™ FITTING SCORE
                </span>
                <span className="text-[12.5px] font-bold text-white font-sans">
                  High Executive Authority
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-[10px] border border-white/10">
              Active Baseline: <span className="text-emerald-400 font-bold">{selectedAvatarId === 'user_selfie' ? 'User Selfie' : 'Selected Model'}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
