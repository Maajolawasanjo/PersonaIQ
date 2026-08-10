'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, RefreshCw, ArrowRight, Camera, Sparkles, Activity } from 'lucide-react';
import { VTO_MODELS } from '@/lib/catalog/vtoCatalog';
import { analyzeImageFidelity, ImageTelemetryResult } from '@/lib/utils/imageAnalysis';

export default function ImageValidationPage() {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState<string>('/vto/models/male/black/male_black_base.jpg');
  const [modelName, setModelName] = useState<string>('Black Male Fitting Model');
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<ImageTelemetryResult | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      if (typeof window === 'undefined') return;

      let photoUrl = '/vto/models/male/black/male_black_base.jpg';
      let name = 'Black Male Fitting Model';

      const savedPhoto = localStorage.getItem('personaiq_user_selfie_preview');
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');

      if (savedPhoto && savedPhoto.length > 10) {
        photoUrl = savedPhoto;
        name = 'User Uploaded Selfie';
      } else if (savedAvatarId) {
        const found = VTO_MODELS.find((m) => m.id === savedAvatarId);
        if (found) {
          photoUrl = found.image_url;
          name = found.name;
        }
      }

      setUserPhoto(photoUrl);
      setModelName(name);

      // Perform REAL HTML5 Canvas Computer Vision & Pixel Telemetry
      const result = await analyzeImageFidelity(photoUrl);
      setTelemetry(result);

      // Save real telemetry into session
      localStorage.setItem('personaiq_image_telemetry', JSON.stringify(result));
      if (result.skinTone) {
        localStorage.setItem('personaiq_skin_undertone', result.skinTone.undertone);
      }

      setIsValidating(false);
    }

    runAnalysis();
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
          <span>Real-time Image Vision & Telemetry Check | Presence Journey</span>
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
              <span>{isValidating ? 'SAMPLING PIXELS...' : 'PIXEL SCAN COMPLETE'}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-300 truncate max-w-[120px]">{modelName}</span>
          </div>
        </div>

        {/* Right Column: Pre-Analysis Check Checklist */}
        <div className="sm:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-600 font-bold">
              <Activity className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-gray-950 font-sans leading-tight">
                Computer Vision Pre-Check
              </h2>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Analyzing sampled RGB contrast, pixel resolution ({telemetry?.width || '--'}x{telemetry?.height || '--'}px), and skin tone luma telemetry.
            </p>
          </div>

          {/* Diagnostic Telemetry Meters */}
          <div className="space-y-4 pt-1">
            
            {/* Meter 1: Face Detection & Alignment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Face Framing & Alignment</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  {telemetry ? telemetry.faceDetectionText : 'Calculating...'}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry?.faceDetectionScore || 85}%` }}
                />
              </div>
            </div>

            {/* Meter 2: Lighting & Lux Contrast */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Lighting Lux & Contrast</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  {telemetry ? telemetry.lightingText : 'Calculating...'}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry?.lightingScore || 90}%` }}
                />
              </div>
            </div>

            {/* Meter 3: Resolution & Sharpness */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-gray-950">Pixel Resolution & Clarity</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  {telemetry ? telemetry.resolutionText : 'Calculating...'}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry?.resolutionScore || 92}%` }}
                />
              </div>
            </div>

            {/* Real Skin Tone Chip */}
            {telemetry?.skinTone && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: telemetry.skinTone.hex }}
                  />
                  <span className="font-bold text-gray-900">Sampled Skin Tone: {telemetry.skinTone.hex}</span>
                </div>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">
                  {telemetry.skinTone.undertone} Undertone
                </span>
              </div>
            )}

            {/* Alert Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-950 block">
                  {telemetry?.angleStatus || 'Camera Framing Verified'}
                </span>
                <span className="text-emerald-800 font-medium text-[11.5px] block">
                  {telemetry?.suggestion || 'Image telemetry verified.'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleBeginAnalysis}
              disabled={isValidating}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
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
