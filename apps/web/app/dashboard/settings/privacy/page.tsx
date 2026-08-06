'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, BarChart3, Download, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacySettingsPage() {
  const [autoDeleteImages, setAutoDeleteImages] = useState<boolean>(true);
  const [contributeAnalytics, setContributeAnalytics] = useState<boolean>(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header with Back Link */}
      <div className="space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/settings" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
          <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
            <Shield className="w-3 h-3 text-gray-500" />
            <span>SECURITY & TRUST</span>
          </span>
        </div>

        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Privacy Settings
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Manage your data permissions and retention policies. PersonaIQ prioritizes your sovereignty over personal information.
        </p>
      </div>

      {/* Main Settings List */}
      <div className="space-y-4">
        
        {/* Card 1: Delete Uploaded Images Automatically */}
        <div className="p-5 bg-white border border-gray-200 rounded-[20px] shadow-xs flex items-center justify-between">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[15.5px] font-bold text-gray-950 font-sans leading-tight">
                Delete Uploaded Images Automatically
              </h3>
              <p className="text-[12px] text-gray-500 font-normal leading-relaxed">
                Ensures source media is permanently purged immediately after analysis is complete.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAutoDeleteImages(!autoDeleteImages)}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
              autoDeleteImages ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                autoDeleteImages ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Card 2: Contribute to Analytics */}
        <div className="p-5 bg-white border border-gray-200 rounded-[20px] shadow-xs flex items-center justify-between">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[15.5px] font-bold text-gray-950 font-sans leading-tight">
                Contribute to Analytics
              </h3>
              <p className="text-[12px] text-gray-500 font-normal leading-relaxed">
                Allow anonymized usage metrics to improve PersonaIQ&apos;s foundational models.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setContributeAnalytics(!contributeAnalytics)}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
              contributeAnalytics ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                contributeAnalytics ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Card 3: Data Export */}
        <div className="p-5 bg-white border border-gray-200 rounded-[20px] shadow-xs flex items-center justify-between">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[15.5px] font-bold text-gray-950 font-sans leading-tight">
                Data Export
              </h3>
              <p className="text-[12px] text-gray-500 font-normal leading-relaxed">
                Download a comprehensive, machine-readable archive of your Presence Journey data.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[12.5px] rounded-[8px] transition-colors shrink-0"
          >
            Request Export
          </button>
        </div>

      </div>

      {/* Danger Zone Section */}
      <div className="pt-6 border-t border-gray-150 space-y-3">
        <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
          DANGER ZONE
        </span>

        <div className="bg-red-50/20 border border-red-200 rounded-[20px] p-5 flex items-center justify-between">
          <div className="flex items-start space-x-3.5 pr-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[15.5px] font-bold text-red-600 font-sans leading-tight">
                Delete Account
              </h3>
              <p className="text-[12px] text-gray-500 font-normal leading-relaxed">
                Permanently erase all profile data, analysis history, and associated records. This action cannot be undone.
              </p>
            </div>
          </div>

          <Link
            href="/system/account-deleted"
            className="px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold text-[12.5px] rounded-[8px] transition-colors shrink-0"
          >
            Delete Account
          </Link>
        </div>
      </div>

    </div>
  );
}
