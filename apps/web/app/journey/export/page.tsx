'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, Lock, Download } from 'lucide-react';

export default function ExportPresencePlanPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const formats = [
    {
      id: 'pdf',
      title: 'PDF Document',
      desc: 'Standard multi-page report',
      recommended: true,
    },
    {
      id: 'png',
      title: 'PNG Images',
      desc: 'ZIP archive of individual pages',
      recommended: false,
    },
    {
      id: 'print',
      title: 'Print Directly',
      desc: 'Open system print dialog',
      recommended: false,
    },
  ];

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Top Header Bar */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <Link
          href="/journey/summary"
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-[13px]"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Link>
        <h1 className="text-[24px] font-bold text-gray-950 font-sans leading-tight">
          Export Plan
        </h1>
      </div>

      {/* Main Grid: Left Document Preview vs Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Document Preview */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-5">
          
          {/* Header Badge & Score */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-[9.5px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
              PREVIEW DOCUMENT
            </span>
            <span className="text-[32px] font-extrabold text-gray-950 font-sans leading-none">
              92
            </span>
          </div>

          {/* Document Title */}
          <div className="space-y-0.5">
            <h2 className="text-[30px] font-bold text-gray-950 font-sans leading-tight">
              Presence Plan
            </h2>
            <p className="text-[12.5px] text-gray-500 font-mono">
              Prepared for Interview / Board Meeting
            </p>
          </div>

          {/* 2 Column Document Body: Selected Attire vs Recommendations & Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start border-t border-b border-gray-100 py-4">
            
            {/* Attire Preview */}
            <div className="sm:col-span-5 space-y-2">
              <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                SELECTED ATTIRE
              </span>
              <div className="aspect-[3/4] w-full rounded-[14px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src="/images/brown-peaked-lapel-suit.jpg"
                  alt="Selected Attire"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10.5px] text-gray-500 font-mono leading-tight">
                Navy unstructured blazer, crisp white button-down, dark denim.
              </p>
            </div>

            {/* Recommendations & Preparation Checklist */}
            <div className="sm:col-span-7 space-y-4">
              
              {/* Recommendations */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                  KEY RECOMMENDATIONS
                </span>
                <div className="space-y-1.5 text-[11.5px] font-sans text-gray-800">
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Maintain upright posture; current analysis shows slight forward lean.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Pacing is excellent. Keep speech rate between 140-160 wpm.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Color palette conveys authority. Ensure lighting is front-facing.</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                  PREPARATION CHECKLIST
                </span>
                <div className="space-y-1 text-[11.5px] font-mono text-gray-700">
                  <p>☐ Steam jacket lapels</p>
                  <p>☐ Test microphone levels</p>
                  <p>☐ Adjust camera to eye-level</p>
                  <p>☐ Review opening statement notes</p>
                </div>
              </div>

            </div>

          </div>

          {/* Document Footer */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
            <span>Generated by PersonaIQ</span>
            <span>Confidential</span>
          </div>

        </div>

        {/* Right Column: Controls Card */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-6">
          
          {/* Export Format Section */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              EXPORT FORMAT
            </span>

            <div className="space-y-2.5">
              {formats.map((fmt) => (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3.5 rounded-[14px] border cursor-pointer transition-all flex items-center justify-between ${
                    selectedFormat === fmt.id
                      ? 'border-2 border-red-600 bg-red-50/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedFormat === fmt.id ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300'
                      }`}
                    >
                      {selectedFormat === fmt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h3 className="text-[13.5px] font-bold text-gray-950 font-sans leading-tight">
                        {fmt.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {fmt.desc}
                      </p>
                    </div>
                  </div>

                  {fmt.recommended && (
                    <span className="text-[9px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase">
                      RECOMMENDED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              OPTIONS
            </span>

            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-sans font-bold text-gray-900">
                Include personal images in export
              </span>
              <button
                type="button"
                onClick={() => setIncludeImages(!includeImages)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  includeImages ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    includeImages ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 font-mono leading-tight flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Your Images remain private and are only included in your local export.</span>
            </p>
          </div>

          {/* Download CTA Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-white shrink-0" />
            <span>{isExporting ? 'Generating Report...' : 'Download Report'}</span>
          </button>

        </div>

      </div>

    </div>
  );
}
