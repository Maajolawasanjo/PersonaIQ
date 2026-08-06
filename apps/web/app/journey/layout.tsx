'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

// ─── Mobile Nav Items (mirror dashboard 7-item structure) ────────────────────
const MOBILE_NAV = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Analysis',
    href: '/journey/start',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'History',
    href: '/dashboard/history',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'Wardrobe',
    href: '/wardrobe',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H7v13a1 1 0 001 1h8a1 1 0 001-1V10h3.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    label: 'Insights',
    href: '/dashboard/presence-dna',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-pattern-geom text-gray-900 font-sans antialiased flex flex-col justify-between selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">

      {/* Watermark Overlay */}
      <div className="fixed -left-16 top-1/3 font-mono font-black text-[130px] text-gray-900/[0.015] tracking-[0.25em] whitespace-nowrap pointer-events-none select-none uppercase rotate-90 origin-left z-0">
        PRESENCE JOURNEY • STEP GUIDED
      </div>

      {/* ── COMPACT DARK TOP BAR ──────────────────────────────────────────────── */}
      <header className="w-full bg-gray-950/95 backdrop-blur-md text-white border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard" className="inline-flex items-center space-x-2.5 group">
            <Image
              src="/icon.png"
              alt="PersonaIQ Logo"
              width={26}
              height={26}
              style={{ width: 26, height: 26 }}
              className="rounded-[5px] shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold tracking-tight text-[18px] text-white">
              Persona<span className="text-primary">IQ</span>
            </span>
          </Link>

          {/* Right: Badge + Exit */}
          <div className="flex items-center space-x-3">
            <span className="text-[10.5px] font-mono font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/15 uppercase tracking-wider">
              PRESENCE JOURNEY
            </span>
            <Link
              href="/dashboard"
              className="h-8 px-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] rounded-[8px] border border-white/15 transition-colors flex items-center space-x-1"
            >
              <span>Exit</span>
              <X className="w-3 h-3 text-white/85" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN STEP CONTENT ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-6 pb-24 lg:pb-6 flex flex-col justify-center">
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV (7 items, matches dashboard) ───────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md text-white border-t border-white/10 shadow-2xl">
        <div className="flex items-center justify-around px-1 py-1.5">
          {MOBILE_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-[8px] transition-all min-w-0 ${
                  active ? 'text-primary scale-105' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-[9.5px] font-mono leading-none tracking-tight truncate max-w-[44px] text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── DESKTOP FOOTER SECURITY NOTE ─────────────────────────────────────── */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-3 border-t border-gray-200/60 hidden lg:flex items-center justify-between text-[11.5px] font-mono text-gray-500">
        <div className="flex items-center space-x-2">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span>Defensive Privacy Guard Active</span>
        </div>
        <span>Step Guided Experience</span>
      </footer>
    </div>
  );
}
