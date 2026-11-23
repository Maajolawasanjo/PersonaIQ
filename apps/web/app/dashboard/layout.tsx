'use client';

import { useEffect, type ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HelpCircle, LogOut, Plus } from 'lucide-react';
import { WorkspaceBrand } from '@/components/workspace/WorkspaceBrand';
import { WorkspaceMobileNavigation } from '@/components/workspace/WorkspaceMobileNavigation';
import {
  accountNavigation,
  isWorkspaceRouteActive,
  primaryNavigation,
  type WorkspaceNavItem,
} from '@/lib/workspace/navigation';
import { useAuth } from '@/providers/auth-provider';

function SidebarLink({ item, pathname }: { item: WorkspaceNavItem; pathname: string }) {
  const active = isWorkspaceRouteActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={
        'group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ' +
        (active ? 'bg-red-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950')
      }
    >
      <Icon aria-hidden="true" className={'h-[18px] w-[18px] shrink-0 ' + (active ? 'text-primary' : 'text-gray-500 group-hover:text-gray-800')} />
      <span>{item.label}</span>
    </Link>
  );
}

function ProfileAvatar() {
  const { user } = useAuth();
  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-800">
      {initials}
    </span>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading, sessionState, refetchUser } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoading && sessionState === 'unauthenticated') {
      router.replace('/login?redirect=' + encodeURIComponent(pathname || '/dashboard'));
    }
  }, [isLoading, sessionState, pathname, router]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  };

  if (isLoading || sessionState !== 'authenticated' || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FB] px-5 text-center">
        <p role="status" className="text-sm text-gray-700">
          {sessionState === 'unavailable'
            ? 'Your account could not be checked because the service is unavailable.'
            : sessionState === 'unauthenticated'
              ? 'Redirecting to sign in…'
              : 'Checking your session…'}
        </p>
        {sessionState === 'unavailable' && (
          <button type="button" onClick={() => { void refetchUser(); }}
            className="min-h-11 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-950">
            Try again
          </button>
        )}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-950">
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-primary">
        Skip to content
      </a>

      <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-7 lg:pl-[17rem]">
        <div className="lg:hidden"><WorkspaceBrand compact /></div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-gray-600">Your personal styling workspace</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/journey/start" className="hidden min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 sm:inline-flex">
            <Plus aria-hidden="true" className="h-4 w-4" /> New preparation
          </Link>
          <Link href="/dashboard/profile" aria-label="Open profile" className="flex min-h-11 items-center gap-2 rounded-xl px-2 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <ProfileAvatar />
            <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-800 sm:block">{user?.first_name || 'Profile'}</span>
          </Link>
        </div>
      </header>

      <aside aria-label="Desktop workspace navigation" className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-[4.5rem] items-center border-b border-gray-100 px-6">
          <WorkspaceBrand />
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          <nav aria-label="Main navigation" className="space-y-1">
            {primaryNavigation.map(item => <SidebarLink key={item.href} item={item} pathname={pathname} />)}
          </nav>
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Your account</p>
            <nav aria-label="Account navigation" className="space-y-1">
              {accountNavigation.map(item => <SidebarLink key={item.href} item={item} pathname={pathname} />)}
            </nav>
          </div>
        </div>
        <div className="space-y-1 border-t border-gray-100 px-4 py-4">
          <Link href="/faq" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <HelpCircle aria-hidden="true" className="h-[18px] w-[18px]" /> Help
          </Link>
          <button type="button" onClick={handleSignOut} disabled={signingOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50">
            <LogOut aria-hidden="true" className="h-[18px] w-[18px]" />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main id="workspace-content" className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-7 sm:px-8 sm:pt-9 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-12 lg:pt-10" tabIndex={-1}>
        {children}
      </main>

      <WorkspaceMobileNavigation />
    </div>
  );
}
