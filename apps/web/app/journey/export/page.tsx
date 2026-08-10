'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Check, Lock, Download, Printer, FileText } from 'lucide-react';
import { VTO_MODELS } from '@/lib/catalog/vtoCatalog';

export default function ExportPresencePlanPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [occasion, setOccasion] = useState<string>('Job Interview');
  const [outfitTitle, setOutfitTitle] = useState<string>('Executive Tailored Suit');
  const [score, setScore] = useState<number>(96);
  const [outfitImage, setOutfitImage] = useState<string>('/vto/clothing/professional/01_navy_suit.jpg');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOccasion = localStorage.getItem('personaiq_active_occasion') || 'interview';
      const savedTitle = localStorage.getItem('personaiq_selected_outfit_title') || 'Executive Tailored Suit';
      const savedScore = localStorage.getItem('personaiq_active_presence_score') || '96';
      const savedPhoto = localStorage.getItem('personaiq_user_outfit_preview') || localStorage.getItem('personaiq_user_selfie_preview');
      const savedAvatarId = localStorage.getItem('personaiq_vto_avatar_id');

      setOccasion(savedOccasion.toUpperCase());
      setOutfitTitle(savedTitle);
      setScore(parseInt(savedScore, 10));

      if (savedPhoto && savedPhoto.length > 10) {
        setOutfitImage(savedPhoto);
      } else if (savedAvatarId) {
        const found = VTO_MODELS.find((m) => m.id === savedAvatarId);
        if (found) setOutfitImage(found.image_url);
      }
    }
  }, []);

  const formats = [
    {
      id: 'pdf',
      title: 'PDF Document',
      desc: 'Standard multi-page executive report',
      recommended: true,
    },
    {
      id: 'print',
      title: 'Print / Browser PDF',
      desc: 'Open system print & save dialog',
      recommended: false,
    },
  ];

  const handleDownload = () => {
    setIsExporting(true);

    if (selectedFormat === 'print') {
      setTimeout(() => {
        setIsExporting(false);
        window.print();
      }, 500);
      return;
    }

    // Generate downloadable document
    setTimeout(() => {
      try {
        const reportContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>PersonaIQ Executive Presence Plan - ${occasion}</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
                .header { border-bottom: 2px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                .score { font-size: 36px; font-weight: 800; color: #dc2626; }
                .section { margin-bottom: 25px; background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
                .title { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
                .badge { background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
                .checklist { line-height: 1.8; }
                .footer { border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #6b7280; text-align: center; margin-top: 40px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <span class="badge">PersonaIQ Presence Plan</span>
                  <div class="title">${occasion} Preparedness</div>
                  <div style="color: #6b7280; font-size: 13px;">Selected Attire: ${outfitTitle}</div>
                </div>
                <div class="score">${score}</div>
              </div>
              <div class="section">
                <h3>Executive Summary & Directives</h3>
                <p>Visual, posture, and attire parameters are fully optimized for authority during <strong>${occasion}</strong>. Maintain vertical lapel symmetry and front-facing luminance.</p>
              </div>
              <div class="section">
                <h3>Action Checklist</h3>
                <div class="checklist">
                  ✔ Verify attire fit and steam lapels<br/>
                  ✔ Confirm eye-level camera placement<br/>
                  ✔ Check speech cadence (140-160 WPM)<br/>
                  ✔ Lock color contrast against background
                </div>
              </div>
              <div class="footer">
                PersonaIQ Automated Executive Intelligence Report • Confidential
              </div>
            </body>
          </html>
        `;

        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PersonaIQ_Presence_Plan_${occasion.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        window.print();
      } finally {
        setIsExporting(false);
      }
    }, 800);
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
          Export Presence Plan
        </h1>
      </div>

      {/* Main Grid: Left Document Preview vs Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Document Preview */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-5">
          
          {/* Header Badge & Score */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-[9.5px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded uppercase tracking-wider">
              ● LIVE REPORT PREVIEW
            </span>
            <span className="text-[32px] font-extrabold text-gray-950 font-sans leading-none">
              {score}
            </span>
          </div>

          {/* Document Title */}
          <div className="space-y-0.5">
            <h2 className="text-[30px] font-bold text-gray-950 font-sans leading-tight">
              Presence Plan Briefing
            </h2>
            <p className="text-[12.5px] text-gray-500 font-mono">
              Prepared for <strong className="text-gray-950 uppercase">{occasion}</strong>
            </p>
          </div>

          {/* 2 Column Document Body */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start border-t border-b border-gray-100 py-4">
            
            {/* Attire Preview */}
            <div className="sm:col-span-5 space-y-2">
              <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                SELECTED ATTIRE
              </span>
              <div className="aspect-[3/4] w-full rounded-[14px] overflow-hidden bg-gray-950 border border-gray-200">
                <img
                  src={includeImages ? outfitImage : '/vto/clothing/professional/01_navy_suit.jpg'}
                  alt="Selected Attire"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <p className="text-[11px] font-bold text-gray-950 font-sans leading-tight">
                {outfitTitle}
              </p>
            </div>

            {/* Recommendations & Preparation Checklist */}
            <div className="sm:col-span-7 space-y-4">
              
              {/* Recommendations */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                  KEY DIRECTIVES
                </span>
                <div className="space-y-1.5 text-[11.5px] font-sans text-gray-800">
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Maintain lapel symmetry and upright posture for authority.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Speech rate baseline: 140-160 WPM during presentation.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>Lighting lux: Ensure front luminance to prevent background washing.</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                  PREPARATION CHECKLIST
                </span>
                <div className="space-y-1 text-[11.5px] font-mono text-gray-700">
                  <p>☑ Steam & inspect outfit lapels</p>
                  <p>☑ Test audio levels & microphone</p>
                  <p>☑ Align camera eye-level</p>
                  <p>☑ Lock presence index baseline ({score})</p>
                </div>
              </div>

            </div>

          </div>

          {/* Document Footer */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
            <span>Generated by PersonaIQ Engine</span>
            <span>Executive Confidential</span>
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
                Include outfit photo in report
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
              <span>Your images remain private and are generated locally.</span>
            </p>
          </div>

          {/* Download CTA Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-white shrink-0" />
            <span>{isExporting ? 'Generating Report...' : 'Download Report'}</span>
          </button>

        </div>

      </div>

    </div>
  );
}
