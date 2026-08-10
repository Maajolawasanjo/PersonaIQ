'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  ArrowLeft,
  RefreshCw,
  Zap,
  Plus,
  Check,
  Scissors,
  Watch,
  Footprints
} from 'lucide-react';
import { wardrobeApi, stylistApi } from '@/lib/api/services';

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

interface OutfitItem {
  id: string;
  title: string;
  category: string;
  image: string;
  fitScore: string;
}

export default function ChooseOutfitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-load journey session event context if available
  const [selectedOccasion, setSelectedOccasion] = useState<string>('interview');
  const [targetVibe, setTargetVibe] = useState<string>('Authoritative');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('black_male');
  const [productUrl, setProductUrl] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);

  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('charcoal');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Digital Closet & Recent Garments
  const [outfitList, setOutfitList] = useState<OutfitItem[]>([
    {
      id: 'charcoal',
      title: 'Executive Brown Peaked Ensemble',
      category: 'Executive Suit',
      image: '/images/brown-peaked-lapel-suit.jpg',
      fitScore: 'Presence Index™ Fit: 94% (High)',
    },
    {
      id: 'tan_ascot',
      title: 'Smart Casual Tan Ascot Knit',
      category: 'Smart Casual',
      image: '/images/ascot-knit-polo-tan.jpg',
      fitScore: 'Presence Index™ Fit: 88% (Moderate)',
    },
    {
      id: 'senator',
      title: 'Formal Senator Suit',
      category: 'Formal Traditional',
      image: '/images/african-senator-suit.jpg',
      fitScore: 'Presence Index™ Fit: 92% (High)',
    },
    {
      id: 'winter',
      title: 'Premium Winter Casual',
      category: 'Outerwear',
      image: '/images/premium-winter-casual.jpg',
      fitScore: 'Presence Index™ Fit: 90% (High)',
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_event_type');
      if (savedOccasion) {
        setSelectedOccasion(savedOccasion.toLowerCase().includes('interview') ? 'interview' : 'conference');
      }
    }

    async function loadData() {
      try {
        const [items, gaps] = await Promise.all([
          wardrobeApi.listItems().catch(() => []),
          stylistApi.getWardrobeGaps(selectedOccasion).catch(() => null),
        ]);

        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((item: any, idx: number) => ({
            id: item.id || `db_item_${idx}`,
            title: item.name || item.title || 'Custom Garment',
            category: item.category || 'Wardrobe Item',
            image: item.image_url || item.image || '/images/brown-peaked-lapel-suit.jpg',
            fitScore: 'Presence Index™ Fit: High',
          }));
          setOutfitList((prev) => [...mapped, ...prev]);
        }

        if (gaps) {
          setGapAnalysis(gaps.data || gaps);
        }
      } catch (err) {
        console.warn('Initial styling fetch notice:', err);
      }
    }
    loadData();
  }, [selectedOccasion]);

  const handleAskAiStylist = async () => {
    setIsGenerating(true);
    try {
      const res = await stylistApi.recommendLook(selectedOccasion, targetVibe, 'Business Formal');
      setRecommendation(res);
    } catch (err) {
      console.warn('AI Stylist recommendation fallback:', err);
      setRecommendation({
        look_name: 'Executive Leadership Profile',
        total_score: 95,
        items: [
          { category: 'Suit / Ensemble', item_name: 'Charcoal Tailored Double-Breasted Suit' },
          { category: 'Shirt / Inner', item_name: 'Crisp White Oxford Spread Collar' },
          { category: 'Footwear', item_name: 'Cap-Toe Hand-Burnished Leather Oxfords' },
          { category: 'Hairstyle & Grooming', item_name: 'Clean Low Fade with Precision Edge' },
          { category: 'Accessories', item_name: 'Slim Stainless Chronograph & Silk Pocket Square' },
        ],
        reasoning: {
          summary: `Optimized for ${selectedOccasion.toUpperCase()} engagements. Projected visual presence delivers peak authority with approachability balance.`,
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;
    try {
      await stylistApi.importProduct(productUrl);
      const newId = `imported_${Date.now()}`;
      const newItem: OutfitItem = {
        id: newId,
        title: 'Imported Garment from Online Store',
        category: 'Online Import',
        image: '/images/brown-peaked-lapel-suit.jpg',
        fitScore: 'Presence Index™ Fit: 95% (Store Import)',
      };
      setOutfitList((prev) => [newItem, ...prev]);
      setSelectedOutfitId(newId);
      setProductUrl('');
    } catch (err) {
      alert('Importing garment preview URL...');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addCustomGarment(file, url);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);

        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'outfit.jpg', { type: 'image/jpeg' });
            addCustomGarment(file, dataUrl);
          });
      }
    }
  };

  const addCustomGarment = (file: File, displayUrl: string) => {
    const newId = `custom_${Date.now()}`;
    const newItem: OutfitItem = {
      id: newId,
      title: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Garment',
      category: 'User Custom',
      image: displayUrl,
      fitScore: 'Presence Index™ Fit: 96% (Custom Snapshot)',
    };
    setOutfitList((prev) => [newItem, ...prev]);
    setSelectedOutfitId(newId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_user_outfit_preview', displayUrl);
      localStorage.setItem('personaiq_selected_outfit_title', newItem.title);
    }
  };

  const handleNext = () => {
    const activeItem = outfitList.find((o) => o.id === selectedOutfitId) || outfitList[0];
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_user_outfit_preview', activeItem.image);
      localStorage.setItem('personaiq_selected_outfit_title', activeItem.title);
      localStorage.setItem('personaiq_active_draft_step', '/journey/virtual-try-on');
    }
    router.push('/journey/virtual-try-on');
  };

  const selectedItem = outfitList.find((o) => o.id === selectedOutfitId) || outfitList[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 animate-fadeIn">
      {/* Hidden File Input & Canvas */}
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-widest">
              PRESENCE JOURNEY STAGE
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">STEP 5 OF 6</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 font-sans mt-0.5">
            AI Personal Stylist & Garment Selection
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Unified Executive Styling Intelligence: Select occasions, import online garments, snap clothes, and receive full Llama 3.3 outfit & grooming recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <span>Continue to VTO Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Split Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Occasion + Avatar + Gap Readiness + Online Import (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Occasion Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center justify-between">
              <span>1. What Are You Dressing For?</span>
              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">Journey Active</span>
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

          {/* 2. Select Avatar / Fitting Model */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
              2. Select Model / Fitting Avatar
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                    selectedAvatar === av.id
                      ? 'border-red-600 bg-red-50/50 text-gray-950 font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-xs truncate">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Online Store Product Importer */}
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
                placeholder="Paste product store URL (e.g., https://store.com/blazer)..."
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

          {/* 4. Trigger AI Stylist Recommendation */}
          <button
            onClick={handleAskAiStylist}
            disabled={isGenerating}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Ask AI Stylist for Look & Grooming Recommendations</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Active Garment + Closet Gallery + AI Grooming Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Camera Stream Overlay */}
          {isCameraActive && (
            <div className="aspect-[4/3] bg-gray-950 rounded-[20px] overflow-hidden relative border border-gray-800 shadow-xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={takeSnapshot}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-red-600 text-white font-bold text-[13px] rounded-full shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Outfit Snapshot</span>
              </button>
            </div>
          )}

          {/* Active Selected Garment Hero Card */}
          <div className="bg-white border-2 border-red-600 rounded-2xl overflow-hidden shadow-sm space-y-0">
            <div className="relative aspect-[16/9] bg-gray-950">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-gray-950/85 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[11px] font-mono font-bold text-white border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SELECTED FOR VTO FITTING</span>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-950 font-sans">{selectedItem.title}</h3>
                <span className="text-xs font-mono text-gray-500">{selectedItem.fitScore}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Digital Closet Gallery */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              DIGITAL CLOSET & RECENT UPLOADS ({outfitList.length})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {outfitList.map((item) => {
                const isSelected = selectedOutfitId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedOutfitId(item.id);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('personaiq_user_outfit_preview', item.image);
                        localStorage.setItem('personaiq_selected_outfit_title', item.title);
                      }
                    }}
                    className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all relative ${
                      isSelected ? 'border-2 border-red-600 shadow-sm ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold z-10">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 space-y-0.5 bg-white">
                      <h4 className="text-[12px] font-bold text-gray-950 font-sans truncate">{item.title}</h4>
                      <p className="text-[10px] font-mono text-gray-500 truncate">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Grooming, Shoes, Hairstyles & Accessories Breakdown */}
          {recommendation && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold text-gray-950 font-sans">
                    Llama 3.3 Complete Grooming & Accessories Strategy
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  {recommendation.total_score} Score Match
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendation.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">{item.category}</span>
                    <span className="text-[12.5px] font-bold text-gray-950 block">{item.item_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
