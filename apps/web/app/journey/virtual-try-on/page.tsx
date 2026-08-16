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
  Layers,
  Camera,
  Cpu
} from 'lucide-react';
import { stylistApi } from '@/lib/api/services';
import { VTO_CATALOG, VTO_MODELS, VTOAsset, VTOModel, getRecommendedAssets } from '@/lib/catalog/vtoCatalog';

export default function VirtualTryOnPage() {
  const router = useRouter();

  // Baseline photo or avatar model selection
  const [userPhoto, setUserPhoto] = useState<string>('/vto/looks/female/F01_job_interview.png');
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
  const [providerUsed, setProviderUsed] = useState<string>('YouCam AI VTO');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prioritize uploaded selfie photo over generic outfit preview
      const selfiePhoto = localStorage.getItem('personaiq_user_selfie_preview');
      const outfitPreview = localStorage.getItem('personaiq_user_outfit_preview');
      
      if (selfiePhoto) {
        setUserPhoto(selfiePhoto);
      } else if (outfitPreview) {
        setUserPhoto(outfitPreview);
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

      // Trigger initial YouCam VTO Composite generation if selfie is active
      const activeImage = selfiePhoto || outfitPreview || '/vto/looks/female/F01_job_interview.png';
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
          console.warn('Initial YouCam VTO sync notice:', err);
        });
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
      const resultUrl = res?.data?.result_image_url || res?.data?.result_url || res?.preview_url || res?.data?.preview_url;
      if (resultUrl) {
        setVtoResult(resultUrl);
      }
      if (res?.data?.provider_used) {
        setProviderUsed(res.data.provider_used === 'youcam' ? 'Perfect Corp YouCam AI' : 'PersonaIQ Composite Engine');
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
      image_url: productUrl,
      occasions: ['all'],
      is_active: true,
    };
    setUserUploads((prev) => [importedItem, ...prev]);
    handleAssetSelect(importedItem);
    setProductUrl('');
  };

  const currentTabItems = VTO_CATALOG.filter((item) => item.category === activeCatalogTab);

  return (
    <div className="space-y-8 animate-fadeIn py-2">
      
      {/* ── TOP STEP & TITLE HEADER ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest border-t-2 border-red-600 pt-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>PRESENCE JOURNEY STAGE</span>
          </div>
          <span>STEP 10 OF 15 — VIRTUAL TRY-ON STUDIO</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 font-sans">
              Virtual Try-On Studio
            </h1>
            <p className="text-base text-gray-600 mt-1 max-w-3xl">
              Preview your AI-recommended outfit concept on your selfie photo or model avatar powered by Perfect Corp YouCam AI.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN STUDIO GRID (2 COLUMNS: FITTING CANVAS + ASSET CATALOG) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT 6 COLS: VTO CANVAS & MODEL SELECTION */}
        <div className="lg:col-span-6 space-y-6">

          {/* Model Selector Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-600 uppercase tracking-wider">
                SELECT FITTING MODEL
              </span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 flex items-center space-x-1">
                <Cpu className="w-3 h-3" />
                <span>{providerUsed}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              
              {/* Option 1: User's Uploaded Selfie */}
              <button
                type="button"
                onClick={() => setSelectedAvatarId('user_selfie')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  selectedAvatarId === 'user_selfie'
                    ? 'border-2 border-red-600 bg-red-50/40 text-red-950 ring-2 ring-red-100 font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                  <img src={userPhoto} alt="User Selfie" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] truncate w-full">My Photo</span>
              </button>

              {/* Stock Avatar Models */}
              {VTO_MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedAvatarId(model.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    selectedAvatarId === model.id
                      ? 'border-2 border-red-600 bg-red-50/40 text-red-950 ring-2 ring-red-100 font-bold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    <img src={model.image_url} alt={model.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] truncate w-full">{model.name}</span>
                </button>
              ))}

            </div>
          </div>

          {/* MAIN VTO CANVAS */}
          <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl relative aspect-[3/4] flex items-center justify-center group">
            
            {/* Background Model Image / YouCam Result */}
            <img
              src={vtoResult || activeModelImage}
              alt="Virtual Try-On Model Canvas"
              className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                isGenerating ? 'opacity-40' : 'opacity-100'
              }`}
            />

            {/* Spinner Overlay during YouCam AI render */}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/60 backdrop-blur-xs z-30">
                <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  YouCam AI Rendering Composite...
                </span>
              </div>
            )}

            {/* Top Badge: Provider Telemetry */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 z-20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {selectedAvatarId === 'user_selfie' ? 'MY SELFIE CANVAS' : 'MODEL CANVAS'}
              </span>
            </div>

            {/* Top Right Badge: Presence Score Indicator */}
            <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center space-x-1.5 z-20 shadow-md">
              <Zap className="w-4 h-4 text-emerald-400 fill-current" />
              <span className="text-xs font-mono font-extrabold">{presenceScore} / 100 FIT</span>
            </div>

            {/* Bottom Floating Card: Currently Applied Garments */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md text-white p-3.5 rounded-xl border border-white/10 flex items-center justify-between gap-3 z-20">
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                  APPLIED GARMENT
                </span>
                <span className="text-xs font-bold text-white truncate block mt-0.5">
                  {selectedGarment.name}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-gray-900">
                  <img src={selectedGarment.image_url} alt={selectedGarment.name} className="w-full h-full object-cover" />
                </div>
                {selectedShoe && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-gray-900">
                    <img src={selectedShoe.image_url} alt={selectedShoe.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT 6 COLS: ASSET CATALOG & IMPORT TOOLS */}
        <div className="lg:col-span-6 space-y-6">

          {/* Import Product from URL Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-950 font-sans flex items-center space-x-2">
                <Globe className="w-4 h-4 text-red-600" />
                <span>Import Garment from Store URL</span>
              </h3>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Zara / ASOS / Nike</span>
            </div>

            <form onSubmit={handleImportProduct} className="flex items-center space-x-2">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Paste store product URL (e.g. https://store.com/item)..."
                className="flex-1 h-11 px-3.5 bg-gray-50 border border-gray-250 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="submit"
                className="h-11 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Import</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Catalog Categories Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
            
            {/* Category Tab Buttons */}
            <div className="flex items-center space-x-1 border-b border-gray-200 pb-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('clothing')}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  activeCatalogTab === 'clothing'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('footwear')}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  activeCatalogTab === 'footwear'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Footwear</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('accessories')}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  activeCatalogTab === 'accessories'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Watch className="w-3.5 h-3.5" />
                <span>Accessories</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('style_references')}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  activeCatalogTab === 'style_references'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Hairstyles</span>
              </button>
            </div>

            {/* Custom User Uploads Section */}
            {userUploads.length > 0 && (
              <div className="space-y-2 pt-1 border-b border-gray-150 pb-3">
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
                  MY IMPORTED ITEMS ({userUploads.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {userUploads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAssetSelect(item)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center space-x-2 bg-red-50/30 ${
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

            {/* Standard Catalog Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {currentTabItems.map((item) => {
                const isSelected =
                  selectedGarment.id === item.id ||
                  selectedShoe?.id === item.id ||
                  selectedAccessory?.id === item.id ||
                  selectedHairstyle?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAssetSelect(item)}
                    className={`bg-white border rounded-xl overflow-hidden p-2.5 transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-red-600 ring-2 ring-red-100 shadow-sm bg-red-50/10'
                        : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative mb-2 border border-gray-150">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block truncate">
                        {item.subcategory}
                      </span>
                      <h4 className="text-xs font-bold text-gray-950 font-sans line-clamp-1">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link
              href="/journey/choose-outfit"
              className="h-12 px-6 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-250 transition-colors flex items-center space-x-2 shrink-0 shadow-2xs"
            >
              <span>Back to Outfits</span>
            </Link>

            <Link
              href="/journey/grooming-checklist"
              className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
            >
              <span>Continue to Grooming Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
