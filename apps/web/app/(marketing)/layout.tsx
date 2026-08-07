'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '../../components/ui/button';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Interactive Demo', href: '/demo' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
      {/* Scroll Progress Bar — sits above the sticky header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-900">
        <div
          className="h-full bg-primary transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Sticky Header - Solid Dark */}
      <header className="sticky top-0 z-40 w-full bg-gray-950 border-b border-white/[0.06]">
        <div className="w-full px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo (Far Left) */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/icon.png"
                alt="PersonaIQ Logo"
                width={26}
                height={26}
                style={{ width: 26, height: 26 }}
                className="rounded-[5px] shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-bold tracking-tight text-[21px] text-white transition-colors">
                Persona<span className="text-primary">IQ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 text-[14.5px] xl:text-[15.5px] font-medium shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-white transition-colors relative py-1 font-semibold tracking-wide ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs (Far Right) */}
          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="hidden lg:flex items-center space-x-5">
              <Link
                href="/login"
                className="text-[14.5px] xl:text-[15.5px] font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="h-10 px-5 bg-primary hover:bg-primary/90 text-white font-semibold text-[14px] rounded-md transition-all active:scale-[0.98]">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-30 bg-gray-950 md:hidden animate-fade-in">
          <div className="flex flex-col p-6 space-y-6 border-t border-white/[0.06]">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium border-b border-white/[0.06] pb-2 ${
                      isActive ? 'text-white font-bold border-primary' : 'text-gray-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 border border-white/10 hover:bg-white/5 text-gray-300 font-semibold text-[14px] rounded-md transition-colors flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-semibold text-[14px] rounded-md transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-[13.5px] shrink-0">
        
        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-5">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/icon.png" alt="PersonaIQ" width={26} height={26} style={{ width: 26, height: 26 }} className="rounded-[5px]" />
                <span className="font-bold text-white tracking-tight text-[20px]">Persona<span className="text-primary">IQ</span></span>
              </Link>
              <p className="text-gray-500 leading-relaxed max-w-[280px] text-[13.5px]">
                AI-powered presence diagnostics that help professionals show up with clinical confidence — from wardrobe to frame composition.
              </p>
              {/* Social Links */}
              <div className="flex items-center space-x-3 pt-1">
                {[
                  { label: 'Twitter / X', href: '#', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label: 'LinkedIn', href: '#', icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { label: 'Instagram', href: '#', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-mono mb-4">Product</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Features', href: '/features' },
                    { label: 'How It Works', href: '/how-it-works' },
                    { label: 'Interactive Demo', href: '/demo' },
                    { label: 'Pricing', href: '/pricing' },
                  ].map(l => <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-mono mb-4">Company</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'About Us', href: '#' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Blog', href: '#' },
                  ].map(l => <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-mono mb-4">Legal</h4>
                <ul className="space-y-3">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing'].map(l => (
                    <li key={l}><span className="hover:text-white transition-colors cursor-pointer">{l}</span></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-mono mb-4">Contact</h4>
                <ul className="space-y-3 text-gray-500">
                  <li className="leading-snug">6 Free Town Road,<br/>Apapa, Lagos, Nigeria</li>
                  <li><a href="mailto:maajolawasanjo@gmail.com" className="hover:text-white transition-colors break-all">maajolawasanjo@gmail.com</a></li>
                  <li><a href="tel:+2348105510626" className="hover:text-white transition-colors">+234 810 551 0626</a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-[12.5px]">
              © {new Date().getFullYear()} PersonaIQ Technologies. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] text-gray-600 font-mono">All systems operational</span>
            </div>
          </div>
        </div>

      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-primary/90 hover:scale-110 active:scale-95 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
