'use client';

import React from 'react';
import Link from 'next/link';

export default function ImageValidationPage() {
  const checks = [
    { label: 'Face detected & centered', status: 'pass', tip: 'Optimal framing detected' },
    { label: 'Lighting balance', status: 'pass', tip: 'Sufficient ambient light' },
    { label: 'Image resolution', status: 'pass', tip: 'Full 1080p telemetry resolution' },
    { label: 'Camera angle & posture', status: 'pass', tip: 'Eye-level angle confirmed' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold uppercase tracking-widest">
          STEP 06 OF 09 • VALIDATED
        </span>
        <h1 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight text-gray-950 font-sans">
          Image Quality Verified
        </h1>
        <p className="text-[15.5px] text-gray-600 font-medium">
          Our defensive validator has verified your photo for AI analysis.
        </p>
      </div>

      {/* Validation Checklist Cards */}
      <div className="bg-white border border-gray-250 rounded-[16px] p-6 shadow-sm space-y-4">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 rounded-[10px] bg-gray-50 border border-gray-150">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <span className="font-bold text-[14.5px] text-gray-950">{item.label}</span>
            </div>
            <span className="text-[12px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Pass
            </span>
          </div>
        ))}
      </div>

      {/* Encouraging Recommendation Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-[14px] p-5 space-y-1.5">
        <span className="text-[11px] font-mono text-primary font-bold uppercase tracking-wider">
          ENCOURAGING TIP
        </span>
        <p className="text-[14px] text-gray-800 font-medium leading-relaxed">
          &ldquo;Your lighting balance is great. For maximum posture score, maintain eye contact with the upper lens.&rdquo;
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 flex items-center justify-between border-t border-gray-200">
        <Link href="/journey/capture-look" className="text-[14px] font-bold text-gray-500 hover:text-gray-950">
          ← Re-upload
        </Link>

        <Link
          href="/journey/presence-scan"
          className="h-12 px-7 bg-primary hover:bg-primary/95 text-white font-bold text-[14.5px] rounded-[10px] shadow-sm flex items-center space-x-2"
        >
          <span>Run Presence Scan™</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}
