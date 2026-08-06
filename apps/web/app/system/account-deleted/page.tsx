'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserMinus } from 'lucide-react';

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center space-x-2 pb-6 border-b border-gray-200">
        <Link href="/" className="text-[13px] font-sans text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PersonaIQ</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-md w-full space-y-6 mt-6 flex flex-col items-center">
        
        {/* User Minus / Deleted Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-650">
          <UserMinus className="w-6 h-6" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-[28px] font-bold text-gray-950 font-sans">
            Account Deleted
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            Your PersonaIQ account and all associated data have been permanently removed from our systems. We respect your data sovereignty.
          </p>
        </div>

        {/* Support & Inquiries Box */}
        <div className="bg-gray-50 border border-gray-150 rounded-[14px] p-4 text-center space-y-1 w-full">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            SUPPORT & INQUIRIES
          </span>
          <p className="text-[11.5px] text-gray-600 font-normal leading-relaxed">
            If you believe this was an error, or if you need assistance recovering specific academic reports within the 30-day grace period, please contact our support team immediately.
          </p>
          <a
            href="mailto:support@personaiq.mit.edu"
            className="text-[11.5px] font-mono text-red-600 hover:underline block pt-1 font-bold"
          >
            support@personaiq.mit.edu
          </a>
        </div>

        {/* Return Button */}
        <div className="pt-2 w-full">
          <Link
            href="/"
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm flex items-center justify-center transition-all"
          >
            Return to Home
          </Link>
        </div>

        {/* Footer */}
        <span className="text-[11px] font-mono text-gray-400 block pt-1">
          Thank you for participating in the Presence Journey.
        </span>

      </div>

    </div>
  );
}
