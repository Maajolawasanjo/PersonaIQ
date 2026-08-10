'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Shield, RefreshCw } from 'lucide-react';
import { uploadApi } from '@/lib/api/services';

export default function CaptureLookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Trigger Native File Picker
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      uploadPhoto(file, url);
    }
  };

  // 2. Start Web Camera Stream
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setErrorMsg('Camera access denied or unavailable. Please use file upload.');
      setIsCameraActive(false);
    }
  };

  // 3. Capture Photo Frame from Camera
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
        setPreviewUrl(dataUrl);

        // Stop camera stream tracks
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);

        // Convert base64 to File for API upload
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            uploadPhoto(file, dataUrl);
          });
      }
    }
  };

  // 4. Upload Photo to Backend API & Store Local Preview
  const uploadPhoto = async (file: File, displayUrl: string) => {
    setIsUploading(true);
    setErrorMsg(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('personaiq_user_selfie_preview', displayUrl);
        const journeyId = localStorage.getItem('personaiq_active_journey_id');
        if (journeyId) {
          await uploadApi.uploadSelfie(journeyId, file);
        }
      }
    } catch (err) {
      console.warn('Backend upload notice, using local high-res capture:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personaiq_active_draft_step', '/journey/validation');
    }
    router.push('/journey/validation');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn py-6 text-center sm:text-left">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Progress Line Accent */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <div className="w-3/4 bg-primary h-full rounded-full transition-all" />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Let&apos;s see your current look.
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium leading-relaxed">
          Upload a recent photo or open your live camera. This will be used as the baseline for your facial skin tone, fatigue, and Presence Index™ telemetry.
        </p>
      </div>

      {/* Main Upload / Camera Viewfinder */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 sm:p-9 shadow-xs space-y-6">
        
        {/* Live Camera Viewfinder */}
        {isCameraActive ? (
          <div className="relative aspect-[4/3] bg-gray-950 rounded-[16px] overflow-hidden border border-gray-800 shadow-md">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-red-500/40 pointer-events-none" />
            <button
              type="button"
              onClick={takeSnapshot}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-full shadow-lg flex items-center space-x-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Take Snapshot</span>
            </button>
          </div>
        ) : previewUrl ? (
          /* Preview Uploaded / Captured Image */
          <div className="relative aspect-[4/3] bg-gray-900 rounded-[16px] overflow-hidden border border-gray-800 shadow-md">
            <img src={previewUrl} alt="Captured Selfie" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  startCamera();
                }}
                className="px-3 py-1.5 bg-gray-950/80 hover:bg-gray-950 text-white font-bold text-[11px] font-mono rounded-full border border-white/20 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        ) : (
          /* Dashed Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50/50 rounded-[16px] p-8 text-center space-y-4 cursor-pointer transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100/90 mx-auto flex items-center justify-center text-gray-700">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[17px] font-bold text-gray-950 block font-sans">
                Drag & drop or click to upload photo
              </span>
              <span className="text-[12px] text-gray-500 block font-medium">
                Supports JPG, PNG, WEBP (Max 5MB)
              </span>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-[12px] text-gray-400 font-medium">
              <div className="w-10 h-[1px] bg-gray-300" />
              <span>OR</span>
              <div className="w-10 h-[1px] bg-gray-300" />
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="h-10 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13px] rounded-[10px] shadow-2xs inline-flex items-center space-x-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-primary" />
                <span>Open Live Camera</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-[12px] p-3 rounded-[10px] font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Privacy Box */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-[14px] p-4 flex items-start space-x-3 text-[12.5px] text-gray-600 leading-relaxed text-left">
          <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-900 font-bold">Privacy First:</strong> Your photo is processed securely for your Presence Index™ facial telemetry and is never shared with third parties.
          </p>
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleNext}
          className="text-[13.5px] font-bold text-gray-500 hover:text-gray-900"
        >
          Skip for now
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isUploading}
          className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-75"
        >
          <span>{isUploading ? 'Uploading...' : 'Next Step'}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
}
