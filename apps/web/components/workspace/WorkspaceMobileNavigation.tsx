'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import {
  accountNavigation,
  isWorkspaceRouteActive,
  mobilePrimaryNavigation,
} from '@/lib/workspace/navigation';

export function WorkspaceMobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && menuRef.current) {
        const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      setOpen(false);
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden="true">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-gray-950/40"
          />
        </div>
      )}

      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="More workspace navigation"
          className="fixed inset-x-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-50 max-h-[65dvh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-xl lg:hidden"
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-sm font-semibold text-gray-950">Your workspace</h2>
            <button type="button" onClick={() => { setOpen(false); menuButtonRef.current?.focus(); }} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Additional navigation" className="space-y-1">
            {accountNavigation.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}
                aria-current={isWorkspaceRouteActive(pathname, href) ? 'page' : undefined}
                className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-gray-500" />
                {label}
              </Link>
            ))}
            <Link href="/faq" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-800 hover:bg-gray-50">
              <HelpCircle aria-hidden="true" className="h-4 w-4 text-gray-500" /> Help
            </Link>
            <button type="button" onClick={signOut} disabled={signingOut}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
              <LogOut aria-hidden="true" className="h-4 w-4" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </nav>
        </div>
      )}

      <nav aria-label="Mobile workspace" className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-[4.7rem] max-w-lg items-stretch justify-between px-2">
          {mobilePrimaryNavigation.map(({ href, label, icon: Icon }) => {
            const active = isWorkspaceRouteActive(pathname, href);
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined}
                className={'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ' + (active ? 'text-primary' : 'text-gray-600')}>
                <Icon aria-hidden="true" className="h-5 w-5" />
                <span className="truncate">{label === 'Prepare for an Event' ? 'Prepare' : label === 'My Wardrobe' ? 'Wardrobe' : label}</span>
              </Link>
            );
          })}
          <button
            ref={menuButtonRef} type="button" aria-expanded={open} aria-haspopup="dialog"
            aria-label={open ? 'Close more navigation' : 'More navigation'}
            onClick={() => setOpen(value => !value)}
            className={'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold ' + (open ? 'text-primary' : 'text-gray-600')}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
