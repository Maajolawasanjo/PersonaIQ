'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Mail, Clock } from 'lucide-react';

export default function SystemMaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      
      <div className="bg-white border border-gray-200 rounded-[24px] p-8 sm:p-10 shadow-xs max-w-md w-full space-y-6 flex flex-col items-center">
        
        {/* Robotic/Recalibrating Icon inside Dashed Circle */}
        <div className="w-20 h-20 rounded-full border border-dashed border-red-300 bg-red-50/30 flex items-center justify-center">
          <Cpu className="w-8 h-8 text-red-650 animate-pulse" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
            System Optimization
          </h1>
          <p className="text-[13px] text-gray-600 font-normal leading-relaxed">
            The Persona Engine is currently undergoing scheduled maintenance to enhance processing precision and analytical depth. Our academic models are being recalibrated.
          </p>
        </div>

        {/* Status Recalibrating Card */}
        <div className="bg-gray-50/80 border border-gray-200 rounded-[16px] p-4 text-left w-full space-y-3">
          <span className="text-[9.5px] font-mono font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
            STATUS: RECALIBRATING
          </span>

          <div className="grid grid-cols-2 gap-2 text-[12px] font-mono text-gray-700">
            <div>
              <span className="text-gray-400 block uppercase text-[9px]">SYSTEM</span>
              <strong className="text-gray-950">PersonaEngine v2.4</strong>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[9px]">ESTIMATED COMPLETION</span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <strong className="text-gray-950">14:30 UTC</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-2 border-t border-gray-150 w-full flex items-center justify-between text-[11.5px] font-mono text-gray-500">
          <Link href="/support" className="hover:text-gray-900 inline-flex items-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span>Contact Support</span>
          </Link>
          <Link href="/system" className="hover:text-gray-900 inline-flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>System Log</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
