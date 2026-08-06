'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CaptureLookPage() {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn py-6 text-center sm:text-left">
      
      {/* 1. Top Red Progress Line Accent */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <div className="w-3/4 bg-primary h-full rounded-full transition-all" />
      </div>

      {/* 2. Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
          Let&apos;s see your current look.
        </h1>
        <p className="text-[14.5px] text-gray-600 font-medium leading-relaxed">
          Upload a recent photo or take one now. This will be used as the baseline for your Presence Journey analysis.
        </p>
      </div>

      {/* 3. Main Upload Box */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-7 sm:p-9 shadow-xs space-y-6">
        
        {/* Dashed Dropzone */}
        <div
          onClick={() => setHasUploaded(true)}
          className={`border-2 border-dashed rounded-[16px] p-8 text-center space-y-4 cursor-pointer transition-all ${
            hasUploaded
              ? 'border-primary bg-red-50/30'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-gray-100/90 mx-auto flex items-center justify-center text-gray-700">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>

          <div className="space-y-1">
            <span className="text-[17px] font-bold text-gray-950 block font-sans">
              {hasUploaded ? 'Image Uploaded Successfully!' : 'Drag & drop or click to upload'}
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
              className="h-10 px-5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[13px] rounded-[10px] shadow-2xs inline-flex items-center space-x-2"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span>Open Camera</span>
            </button>
          </div>
        </div>

        {/* Privacy First Box */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-[14px] p-4 flex items-start space-x-3 text-[12.5px] text-gray-600 leading-relaxed text-left">
          <div className="w-5 h-5 rounded-full bg-red-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <p>
            <strong className="text-gray-900 font-bold">Privacy First:</strong> Your images are securely processed locally when possible and never shared with third parties. Used exclusively for your Presence Index™ calculation.
          </p>
        </div>

      </div>

      {/* 4. Footer Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <Link href="/journey/dress-code" className="text-[13.5px] font-bold text-gray-500 hover:text-gray-900">
          Skip for now
        </Link>

        <Link
          href="/journey/validation"
          className="h-11 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center space-x-2"
        >
          <span>Next Step</span>
          <span>→</span>
        </Link>
      </div>

    </div>
  );
}
