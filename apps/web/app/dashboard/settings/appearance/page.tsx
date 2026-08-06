'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, Type, Eye, Sun, Moon, Monitor, ArrowLeft } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [fontSize, setFontSize] = useState<number>(16);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <Link href="/dashboard/settings" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Settings</span>
        </Link>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Appearance Settings
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Customize the visual interface of your Presence Journey. Select themes, adjust typography, and configure accessibility options for optimal readability.
        </p>
      </div>

      {/* Main Grid: Left Controls vs Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Theme, Typography, Accessibility */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Interface Theme */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
            <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-700" />
              <span>Interface Theme</span>
            </span>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-[14px] border text-left transition-all space-y-2 ${
                  theme === 'light'
                    ? 'border-2 border-red-600 bg-red-50/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 bg-gray-100 rounded-[8px] border border-gray-200 p-1.5 space-y-1">
                  <div className="w-8 h-2 bg-gray-300 rounded" />
                  <div className="w-full h-4 bg-white rounded border border-gray-250" />
                </div>
                <span className="text-[13px] font-bold text-gray-950 font-sans flex items-center space-x-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-[14px] border text-left transition-all space-y-2 ${
                  theme === 'dark'
                    ? 'border-2 border-red-600 bg-red-50/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 bg-gray-900 rounded-[8px] border border-gray-800 p-1.5 space-y-1">
                  <div className="w-8 h-2 bg-gray-700 rounded" />
                  <div className="w-full h-4 bg-gray-800 rounded" />
                </div>
                <span className="text-[13px] font-bold text-gray-950 font-sans flex items-center space-x-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3.5 rounded-[14px] border text-left transition-all space-y-2 ${
                  theme === 'system'
                    ? 'border-2 border-red-600 bg-red-50/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-12 bg-gradient-to-r from-gray-100 to-gray-900 rounded-[8px] border border-gray-300" />
                <span className="text-[13px] font-bold text-gray-950 font-sans flex items-center space-x-1.5">
                  <Monitor className="w-3.5 h-3.5 text-gray-500" />
                  <span>System</span>
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Typography & Spacing */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-5">
            <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
              <Type className="w-4 h-4 text-gray-700" />
              <span>Typography & Spacing</span>
            </span>

            {/* Font Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[12px] font-mono">
                <span className="text-gray-500">Base Font Size</span>
                <span className="font-bold text-gray-950">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-red-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-400">
                <span>Small (14px)</span>
                <span>Large (20px)</span>
              </div>
            </div>

            {/* Density Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-[12px] font-mono text-gray-500 block">Interface Density</span>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-[12px]">
                {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={`py-1.5 rounded-[8px] text-[12px] font-mono capitalize transition-all ${
                      density === d ? 'bg-white text-gray-950 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Accessibility */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
            <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-700" />
              <span>Accessibility</span>
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-bold text-gray-950 font-sans">High Contrast Mode</h4>
                  <p className="text-[11.5px] text-gray-500">Increase contrast for better legibility of text and UI elements.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    highContrast ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${highContrast ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <h4 className="text-[13.5px] font-bold text-gray-950 font-sans">Reduce Motion</h4>
                  <p className="text-[11.5px] text-gray-500">Minimize UI animations and structural transitions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    reduceMotion ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${reduceMotion ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Preview Card */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs space-y-4">
          <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            LIVE PREVIEW
          </span>

          <div className="bg-gray-50/70 border border-gray-150 rounded-[16px] p-4 space-y-3">
            <span className="text-[9.5px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              ANALYSIS
            </span>

            <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
              Cognitive Load Index
            </h3>

            <p className="text-[11.5px] text-gray-600 font-normal leading-relaxed">
              The current interface configuration suggests an optimal reading environment, prioritizing academic editorialism and minimal distraction.
            </p>

            <div className="pt-2 border-t border-gray-200 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center font-bold text-gray-950 font-sans text-[15px]">
                84
              </div>
              <div>
                <span className="text-[12px] font-bold text-gray-950 font-sans block">Clarity Score</span>
                <span className="text-[10px] font-mono text-gray-500">High readability</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-8 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-[11px] font-mono rounded-[6px] transition-colors mt-2"
            >
              View Detailed Metrics
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
