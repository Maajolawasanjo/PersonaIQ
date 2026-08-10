'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Plus, Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { wardrobeApi, uploadApi } from '@/lib/api/services';

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

  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('charcoal');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Real Wardrobe Items List with Default Baseline Fallbacks
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
    async function fetchWardrobe() {
      try {
        const items = await wardrobeApi.listItems();
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
      } catch (err) {
        console.warn('Backend wardrobe items notice, using local closet gallery:', err);
      }
    }
    fetchWardrobe();
  }, []);

  // 1. Handle File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addCustomGarment(file, url);
    }
  };

  // 2. Camera Stream Handler
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
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
    setIsUploading(true);
    const newId = `custom_${Date.now()}`;
    const newItem: OutfitItem = {
      id: newId,
      title: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Custom Outfit',
      category: 'User Upload',
      image: displayUrl,
      fitScore: 'Presence Index™ Fit: 95% (Custom Match)',
    };

    setOutfitList((prev) => [newItem, ...prev]);
    setSelectedOutfitId(newId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_user_outfit_preview', displayUrl);
      localStorage.setItem('personaiq_selected_outfit_title', newItem.title);
    }
    setIsUploading(false);
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-6 text-center">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-[34px] sm:text-[42px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Choose Your Outfit
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium">
          Select attire from your digital closet or snap/upload a photo of your new clothes directly into your Presence Journey.
        </p>
      </div>

      {/* Camera Modal */}
      {isCameraActive && (
        <div className="max-w-md mx-auto aspect-[4/3] bg-gray-950 rounded-[20px] overflow-hidden relative border border-gray-800 shadow-xl">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={takeSnapshot}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-full shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Outfit Photo</span>
          </button>
        </div>
      )}

      {/* Hero Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 max-w-4xl mx-auto items-stretch text-left">
        
        {/* Upload / Snap New Clothes Card */}
        <div className="sm:col-span-5 bg-gradient-to-br from-red-50 to-white border-2 border-dashed border-red-300 hover:border-red-500 rounded-[20px] p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[260px] shadow-xs transition-all">
          <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
            <Plus className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[17px] font-bold text-gray-950 block font-sans">
              Add New Garment
            </span>
            <span className="text-[12px] text-gray-500 block font-medium">
              Snap or upload photos of your own clothes
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1 w-full max-w-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-9 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[12px] rounded-[8px] flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 h-9 bg-primary hover:bg-primary/95 text-white font-bold text-[12px] rounded-[8px] flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snap Camera</span>
            </button>
          </div>
        </div>

        {/* Currently Selected Garment Hero Card */}
        <div className="sm:col-span-7 bg-white rounded-[20px] overflow-hidden shadow-xs border-2 border-red-500 ring-2 ring-red-100 text-left flex flex-col justify-between">
          <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-gray-950/85 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[11px] font-mono font-bold text-white border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE JOURNEY SELECTION</span>
            </div>
          </div>

          <div className="p-5 space-y-1 bg-white">
            <h3 className="text-[19px] font-bold text-gray-950 font-sans">
              {selectedItem.title}
            </h3>
            <div className="flex items-center justify-between text-[12px] font-mono text-gray-600">
              <span>{selectedItem.fitScore}</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 font-bold text-gray-800">{selectedItem.category}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Wardrobe Items Gallery (4-Grid) */}
      <div className="space-y-3 max-w-4xl mx-auto pt-2 text-left">
        <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
          AVAILABLE DIGITAL CLOSET & RECENT UPLOADS ({outfitList.length})
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                className={`bg-white rounded-[16px] overflow-hidden shadow-xs border cursor-pointer transition-all relative ${
                  isSelected ? 'border-2 border-red-600 shadow-md ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-0.5 bg-white">
                  <h4 className="text-[13px] font-bold text-gray-950 font-sans leading-tight truncate">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-mono text-gray-500 truncate">
                    {item.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link
          href="/journey/skin-intelligence"
          className="h-11 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-[13px] rounded-[10px] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Skin Diagnostics</span>
        </Link>
        <button
          type="button"
          onClick={handleNext}
          className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[14px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Continue to Virtual Try-On</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
