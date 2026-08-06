'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export default function SessionExpiredPage() {
  const [email, setEmail] = useState('dr.eleanorv@mit.edu');
  const [password, setPassword] = useState('••••••••••');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-xs max-w-sm w-full space-y-5 text-left border-t-4 border-t-red-600">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-[20px] text-gray-950 font-sans">
            Persona<span className="text-red-600">IQ</span>
          </span>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-[24px] font-bold text-gray-950 font-sans">
            Session Expired
          </h1>
          <p className="text-[12px] text-gray-600 font-normal leading-relaxed">
            Your secure session has timed out due to inactivity. Please re-authenticate to continue your analysis.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
              INSTITUTIONAL EMAIL
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 bg-gray-50 border border-gray-250 rounded-[8px] text-[13px] font-mono text-gray-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                PASSWORD
              </span>
              <Link href="/forgot-password" className="text-[11px] font-mono text-red-600 hover:underline">
                Reset
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3.5 bg-gray-50 border border-gray-250 rounded-[8px] text-[13px] font-mono text-gray-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Primary CTA */}
        <Link
          href="/dashboard"
          className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm flex items-center justify-center space-x-2 transition-all mt-2"
        >
          <span>Re-authenticate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-150 flex justify-between items-center text-[11px] font-mono text-gray-400">
          <span className="flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>Secure Connection</span>
          </span>
          <Link href="/login" className="hover:text-gray-700">
            Return to login
          </Link>
        </div>

      </div>

    </div>
  );
}
