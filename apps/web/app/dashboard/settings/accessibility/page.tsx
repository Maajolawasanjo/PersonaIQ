'use client';

import React, { useState } from 'react';

export default function AccessibilitySettingsPage() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [fontSize, setFontSize] = useState('Default');

  const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: () => void; label: string; desc: string }) => (
    <div className="flex items-center justify-between p-4 rounded-[14px] border border-gray-200 bg-gray-50/50">
      <div>
        <span className="text-[14.5px] font-bold text-gray-950 block">{label}</span>
        <span className="text-[12px] text-gray-400 font-mono">{desc}</span>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-primary' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">

      <div className="space-y-1 border-b border-gray-100 pb-4">
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">Accessibility</h1>
        <p className="text-[13.5px] text-gray-500 font-normal">Customise motion, contrast, and readability preferences.</p>
      </div>

      <div className="space-y-3">
        <Toggle value={reduceMotion} onChange={() => setReduceMotion(v => !v)} label="Reduce Motion" desc="Disable transitions and animations throughout the app." />
        <Toggle value={highContrast} onChange={() => setHighContrast(v => !v)} label="High Contrast Mode" desc="Increase colour contrast for improved visibility." />
        <Toggle value={largeText} onChange={() => setLargeText(v => !v)} label="Larger Text" desc="Increase base font size across the interface." />
      </div>

      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <h3 className="text-[18px] font-bold text-gray-950 font-sans">Font Size Preference</h3>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {['Small', 'Default', 'Large', 'Extra Large'].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all border ${
                fontSize === size
                  ? 'bg-gray-950 text-white border-gray-950'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <h3 className="text-[18px] font-bold text-gray-950 font-sans">Keyboard Navigation</h3>
        <p className="text-[13px] text-gray-500">PersonaIQ supports full keyboard navigation. Use <kbd className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[12px] font-mono">Tab</kbd> to move between elements and <kbd className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[12px] font-mono">Enter</kbd> to activate.</p>
      </div>

      <button type="button" className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all">
        Save Accessibility Settings
      </button>
    </div>
  );
}
