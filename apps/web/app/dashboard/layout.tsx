'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconAnalysis = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconHistory = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconWardrobe = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H7v13a1 1 0 001 1h8a1 1 0 001-1V10h3.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
  </svg>
);
const IconInsights = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconProfile = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconSettings = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IconHelp = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconLogout = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconPlans = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconProgress = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

// ─── Primary Nav Items ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',              icon: <IconDashboard /> },
  { label: 'New Analysis', href: '/journey/start',          icon: <IconAnalysis /> },
  { label: 'History',      href: '/dashboard/history',      icon: <IconHistory /> },
  { label: 'Plans',        href: '/dashboard/plans',        icon: <IconPlans /> },
  { label: 'Progress',     href: '/dashboard/progress',     icon: <IconProgress /> },
  { label: 'Wardrobe',     href: '/wardrobe',               icon: <IconWardrobe /> },
  { label: 'Insights',     href: '/dashboard/presence-dna', icon: <IconInsights /> },
  { label: 'Profile',      href: '/dashboard/profile',      icon: <IconProfile /> },
  { label: 'Settings',     href: '/dashboard/settings',     icon: <IconSettings /> },
];

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
const MOBILE_NAV = [
  { label: 'Home',     href: '/dashboard',              icon: <IconDashboard /> },
  { label: 'Analysis', href: '/journey/start',          icon: <IconAnalysis /> },
  { label: 'History',  href: '/dashboard/history',      icon: <IconHistory /> },
  { label: 'Plans',    href: '/dashboard/plans',        icon: <IconPlans /> },
  { label: 'Progress', href: '/dashboard/progress',     icon: <IconProgress /> },
  { label: 'Wardrobe', href: '/wardrobe',               icon: <IconWardrobe /> },
  { label: 'Insights', href: '/dashboard/presence-dna', icon: <IconInsights /> },
  { label: 'Profile',  href: '/dashboard/profile',      icon: <IconProfile /> },
  { label: 'Settings', href: '/dashboard/settings',     icon: <IconSettings /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-pattern-geom text-gray-900 font-sans antialiased selection:bg-primary/10 selection:text-primary">

      {/* ══════════════════════════════════════════════════════════════════════
          FULL-WIDTH TOP HEADER — PersonaIQ | Search | User
          Fixed at top, spans the entire viewport width (desktop + mobile)
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-gray-950 border-b border-white/10 flex items-center px-5 shadow-md">

        {/* Left: Brand */}
        <Link href="/dashboard" className="flex items-center space-x-2.5 group shrink-0">
          <Image
            src="/icon.png"
            alt="PersonaIQ"
            width={28}
            height={28}
            style={{ width: 28, height: 28 }}
            className="rounded-[6px] group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-[18px] text-white tracking-tight">
            Persona<span className="text-primary">IQ</span>
          </span>
        </Link>

        {/* Right: Search + User */}
        <div className="ml-auto flex items-center space-x-2">

          {/* Search */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="h-9 px-3 flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-[8px] border border-white/10 transition-all text-[13px] font-medium"
            aria-label="Search"
          >
            <IconSearch />
            <span className="hidden sm:inline text-[12.5px]">Search</span>
            <span className="hidden sm:inline text-[11px] text-gray-500 font-mono border border-white/10 rounded px-1">⌘K</span>
          </button>

          {/* User Avatar */}
          <Link
            href="/dashboard/profile"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-primary transition-all shrink-0"
          >
            <img
              src="/images/professional-female-headshot.jpg"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          BODY — below the fixed header (pt-14)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex pt-14 min-h-screen">

        {/* ── DESKTOP LEFT SIDEBAR ────────────────────────────────────────────
            Fixed, starts at top-14 (below header), full height below
        ─────────────────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex fixed top-14 bottom-0 left-0 w-60 bg-gray-950 text-white border-r border-white/10 flex-col justify-between z-30 overflow-y-auto">

          {/* Primary Nav */}
          <nav className="px-4 pt-6 pb-4 space-y-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-[10px] text-[15px] font-medium transition-all ${
                    active
                      ? 'bg-white/12 text-white font-semibold border border-white/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.label === 'New Analysis' && (
                    <span className="ml-auto text-[9.5px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section: divider → Help → Logout */}
          <div className="px-4 pt-4 pb-5 space-y-1 border-t border-white/10">
            <Link
              href="/faq"
              className="flex items-center space-x-3 px-3 py-3 rounded-[10px] text-[15px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <IconHelp />
              <span>Help</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center space-x-3 px-3 py-3 rounded-[10px] text-[15px] font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all group"
            >
              <span className="group-hover:text-red-400"><IconLogout /></span>
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ───────────────────────────────────────────────
            Offset left by sidebar width on desktop
        ─────────────────────────────────────────────────────────────────── */}
        <div className="flex-1 lg:pl-60 flex flex-col min-w-0 min-h-[calc(100vh-3.5rem)]">

          {/* Mobile: Thin sub-header with quick CTA */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white/60 backdrop-blur-sm border-b border-gray-200/80">
            <span className="text-[12px] font-mono text-gray-400">Executive Workspace</span>
            <Link
              href="/journey/start"
              className="h-7 px-3 bg-primary text-white font-bold text-[11.5px] rounded-[6px] flex items-center shadow-sm"
            >
              + Analysis
            </Link>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV — 7 items, fixed at bottom
      ══════════════════════════════════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-950/97 backdrop-blur-md text-white border-t border-white/10 shadow-2xl">
        <div className="flex items-center justify-around px-0.5 py-1">
          {MOBILE_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-[8px] transition-all min-w-0 flex-1 ${
                  active ? 'text-primary' : 'text-gray-500 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-mono leading-none truncate w-full text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
