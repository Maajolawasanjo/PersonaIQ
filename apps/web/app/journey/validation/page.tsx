'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, RefreshCw, ArrowRight, Camera } from 'lucide-react';
import { VTO_MODELS } from '@/lib/catalog/vtoCatalog';

export default function ImageValidationPage() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>('/vto/models/male_black.jpg');
  const [modelName, setModelName] = useState<string>('Black Male Fitting Model');
  const [isValidating, setIsValidating] = useState<boolean>(true);

  // Dynamic Telemetry State
  const [telemetry, setTelemetry] = useState({
    faceDetection: '100% (Optimal Alignment)',
    faceScore: 100,
    lightingLux: '96% (Even Luminance)',
    lightingScore: 96,
    resolution: '98% (Fidelity Ultra-High)',
    resolutionScore: 98,
    angleStatus: 'Optimal Camera Angle',
    suggestion: 'Capture framed perfectly. Telemetry locked for skin & presence index analysis.',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');

      if (savedPhoto && savedPhoto.length > 10) {
        setUserPhoto(savedPhoto);
        setModelName('User Uploaded Selfie');
      } else if (savedAvatarId) {
        const found = VTO_MODELS.find((m) => m.id === savedAvatarId);
        if (found) {
          setUserPhoto(found.image_url);
          setModelName(found.name);
        }
      }

      // Simulate live AI telemetry scan
      const timer = setTimeout(() => {
        setIsValidating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleBeginAnalysis = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_draft_step', '/journey/skin-intelligence');
    }
    router.push('/journey/skin-intelligence');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-6">
      {/* Top Header Bar */}
      <div className="bg-gray-950 text-white px-5 py-3.5 rounded-t-2xl flex items-center justify-between text-xs font-mono font-bold tracking-wide border border-gray-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Image Validation & Telemetry Check | Presence Journey</span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">STEP 4 OF 6</span>
      </div>

      {/* Main Validation Card */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-7 items-center">
        {/* Left Column: Portrait Viewfinder Feed */}
        <div className="sm:col-span-5 relative aspect-[3/4] bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-md">
          <img
            src={userPhoto}
            alt="Validated Capture"
            className="w-full h-full object-cover"
          />

          {/* Scanner Grid Overlay */}
          <div className="absolute inset-0 border-2 border-red-500/30 pointer-events-none" />
          <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_12px_#dc2626] animate-pulse" />

          {/* Live Feed Badge */}
          <div className="absolute bottom-3 left-3 right-3 bg-gray-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold flex items-center justify-between border border-white/10">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isValidating ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{isValidating ? 'ANALYZING...' : 'LIVE FEED LOCKED'}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-300 truncate max-w-[120px]">{modelName}</span>
          </div>
        </div>

        {/* Right Column: Pre-Analysis Check Checklist */}
        <div className="sm:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-600 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-gray-950 font-sans leading-tight">
                Pre-Analysis Check
              </h2>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              We are validating your capture quality to ensure optimal facial detection and color contrast telemetry for your Presence Journey.
            </p>
          </div>

          {/* Diagnostic Telemetry Meters */}
          <div className="space-y-4 pt-1">
            {/* Meter 1: Face Detection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Face Detection & Alignment</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">{telemetry.faceDetection}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-full transition-all duration-700" />
              </div>
            </div>

            {/* Meter 2: Lighting Quality */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Lighting & Lux Contrast</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">{telemetry.lightingLux}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[96%] transition-all duration-700" />
              </div>
            </div>

            {/* Meter 3: Resolution & Clarity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Resolution & Focal Sharpness</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">{telemetry.resolution}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[98%] transition-all duration-700" />
              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-950 block">{telemetry.angleStatus}</span>
                <span className="text-emerald-800 font-medium text-[11.5px] block">
                  {telemetry.suggestion}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleBeginAnalysis}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Begin Skin & Presence Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/journey/capture-look"
              className="w-full h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Photo / Select Built-in Model</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
