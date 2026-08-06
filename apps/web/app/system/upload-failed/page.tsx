'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, UploadCloud } from 'lucide-react';

export default function AnalysisUploadFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center space-x-2 pb-4 border-b border-gray-200">
        <Link href="/dashboard" className="text-[13px] font-sans text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PersonaIQ</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-xl w-full space-y-6 mt-4 text-left">
        
        {/* Red Circle Exclamation Icon & Title */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-650 flex items-center justify-center shrink-0 border border-red-150">
            <span className="text-[20px] font-bold">!</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-[26px] font-bold text-gray-950 font-sans leading-tight">
              Analysis Upload Failed
            </h1>
            <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
              The intelligent processing engine could not verify the structural integrity of your submission. Ensure your dataset adheres to the required formats for Presence Analysis.
            </p>
          </div>
        </div>

        {/* Required Specifications Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-[16px] p-5 space-y-3">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
            REQUIRED SPECIFICATIONS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] font-mono text-gray-700">
            <div>
              <span className="text-gray-400 block uppercase text-[9.5px]">Supported Formats</span>
              <strong className="text-gray-950">.CSV, .JSON, .TXT (UTF-8)</strong>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[9.5px]">Maximum File Size</span>
              <strong className="text-gray-950">50 MB per analysis batch</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 space-y-1">
            <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Detected Error Context</span>
            </span>
            <p className="text-[11.5px] font-mono text-gray-700 bg-white border border-gray-200 rounded-[8px] p-2.5">
              Error Code: ERR_MIME_UNSUPPORTED. The provided file &apos;presence_data_v2.pdf&apos; is an unrecognized binary format for this pipeline.
            </p>
          </div>
        </div>

        {/* Drag & Drop Re-upload Dropzone */}
        <div className="border-2 border-dashed border-gray-250 rounded-[18px] p-6 text-center space-y-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-500">
            <UploadCloud className="w-5 h-5 text-gray-450" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-gray-950 font-sans">
              Drag & drop verified dataset here
            </h3>
            <p className="text-[12px] text-gray-500 font-mono">
              or click to browse local directory
            </p>
          </div>

          <button
            type="button"
            className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all"
          >
            Select Dataset
          </button>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <Link
            href="/dashboard"
            className="h-10 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[12.5px] rounded-[8px] transition-colors flex items-center"
          >
            Cancel Process
          </Link>
        </div>

      </div>

    </div>
  );
}
