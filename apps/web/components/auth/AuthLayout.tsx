'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  headline: string;
  subheadline: string;
  topRightText?: string;
  topRightLinkText?: string;
  topRightLinkHref?: string;
  badgeText?: string;
  children: React.ReactNode;
}

export function AuthLayout({
  headline,
  subheadline,
  topRightText,
  topRightLinkText,
  topRightLinkHref,
  badgeText = 'SECURITY & INTEL',
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden grid grid-cols-1 lg:grid-cols-12 bg-pattern-geom font-sans text-gray-900 antialiased selection:bg-primary/10 selection:text-primary">
      
      {/* LEFT PANEL — Desktop Dark Obsidian Brand Panel (Visible on lg+) */}
      <div className="lg:col-span-5 bg-pattern-geom-dark text-white relative p-8 xl:p-16 hidden lg:flex flex-col justify-between min-h-screen border-r border-white/[0.08]">
        {/* Subtle watermark text & gradient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 font-mono font-black text-[120px] text-white/[0.025] tracking-[0.3em] whitespace-nowrap uppercase rotate-90 origin-left">
            PERSONAIQ • TELEMETRY
          </div>
          <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Logo Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center space-x-3 group min-h-[44px]">
            <Image
              src="/icon.png"
              alt="PersonaIQ Logo"
              width={34}
              height={34}
              style={{ width: 34, height: 34 }}
              className="rounded-[6px] shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-bold tracking-tight text-[24px] text-white">
              Persona<span className="text-primary">IQ</span>
            </span>
          </Link>
        </div>

        {/* Center Headline & Subheadline */}
        <div className="relative z-10 my-auto max-w-md space-y-5">
          <span className="text-[11px] font-bold font-mono text-primary tracking-[0.2em] uppercase">
            {badgeText}
          </span>
          <h1 className="text-[36px] xl:text-[44px] font-extrabold tracking-tight text-white leading-[1.12] font-sans">
            {headline}
          </h1>
          <p className="text-[15.5px] text-gray-400 leading-relaxed font-normal">
            {subheadline}
          </p>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between text-[12.5px] text-gray-500 font-mono">
          <span className="flex items-center space-x-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span>256-Bit TLS Encrypted</span>
          </span>
          <span>Zero Data Retention</span>
        </div>
      </div>

      {/* RIGHT PANEL — Mobile & Desktop Responsive Form Canvas */}
      <div className="lg:col-span-7 flex flex-col justify-between px-4 py-6 sm:px-8 sm:py-10 lg:px-16 lg:py-16 min-h-screen min-h-[100dvh] w-full max-w-full">
        
        {/* Mobile Header Branding (Shown only on screens < lg) */}
        <div className="lg:hidden w-full max-w-lg mx-auto flex items-center justify-between pb-4 border-b border-gray-200/80 mb-4">
          <Link href="/" className="inline-flex items-center space-x-2.5 min-h-[44px]">
            <Image
              src="/icon.png"
              alt="PersonaIQ Logo"
              width={28}
              height={28}
              style={{ width: 28, height: 28 }}
              className="rounded-[5px] shrink-0"
            />
            <span className="font-bold tracking-tight text-[20px] text-gray-950">
              Persona<span className="text-primary">IQ</span>
            </span>
          </Link>

          {topRightLinkText && topRightLinkHref && (
            <Link
              href={topRightLinkHref}
              className="font-bold text-primary text-[13px] hover:underline min-h-[44px] inline-flex items-center"
            >
              {topRightLinkText}
            </Link>
          )}
        </div>

        {/* Top Navigation Bar for Desktop (lg+) */}
        <div className="hidden lg:flex w-full max-w-lg mx-auto items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[13.5px] font-semibold text-gray-600 hover:text-gray-950 transition-colors group py-2 px-1 min-h-[44px]"
            aria-label="Back to landing page"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </Link>

          {topRightLinkText && topRightLinkHref && (
            <div className="text-[13.5px]">
              {topRightText && <span className="text-gray-500 mr-2">{topRightText}</span>}
              <Link
                href={topRightLinkHref}
                className="font-bold text-primary hover:underline py-2 min-h-[44px] inline-flex items-center"
              >
                {topRightLinkText}
              </Link>
            </div>
          )}
        </div>

        {/* Main Form Content Canvas */}
        <div className="w-full max-w-lg mx-auto my-auto py-4 sm:py-8">
          {children}
        </div>

        {/* Mobile & Desktop Security Disclaimer */}
        <div className="w-full max-w-lg mx-auto text-center text-[11.5px] sm:text-[12.5px] text-gray-500 pt-4 sm:pt-6 border-t border-gray-200/60 mt-4">
          <span>Protected by PersonaIQ Defensive Privacy Guard • </span>
          <Link href="/support" className="text-gray-700 font-semibold hover:underline min-h-[44px] inline-flex items-center">
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
