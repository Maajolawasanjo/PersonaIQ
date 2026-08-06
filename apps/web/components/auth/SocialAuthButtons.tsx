'use client';

import React from 'react';

interface SocialAuthButtonsProps {
  onSocialSelect?: (provider: string) => void;
}

export function SocialAuthButtons({ onSocialSelect }: SocialAuthButtonsProps) {
  const handleClick = (provider: string) => {
    if (onSocialSelect) {
      onSocialSelect(provider);
    } else {
      window.location.href = '/demo';
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        {/* Google SSO */}
        <button
          type="button"
          onClick={() => handleClick('Google')}
          className="h-12 flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-semibold text-[13.5px] rounded-[10px] shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none active:scale-[0.98]"
          aria-label="Continue with Google"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span className="hidden sm:inline">Google</span>
        </button>

        {/* Apple SSO */}
        <button
          type="button"
          onClick={() => handleClick('Apple')}
          className="h-12 flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-semibold text-[13.5px] rounded-[10px] shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none active:scale-[0.98]"
          aria-label="Continue with Apple"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.68-.83 1.14-1.99.01-3.09-1.06-.07-2.3.61-3.03 1.46-.64.74-1.2 1.93-1.04 3.06 1.19.09 2.37-.6 3.06-1.43z"/></svg>
          <span className="hidden sm:inline">Apple</span>
        </button>

        {/* Microsoft SSO */}
        <button
          type="button"
          onClick={() => handleClick('Microsoft')}
          className="h-12 flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-semibold text-[13.5px] rounded-[10px] shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none active:scale-[0.98]"
          aria-label="Continue with Microsoft"
        >
          <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
          <span className="hidden sm:inline">Microsoft</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center pt-1">
        <div className="border-t border-gray-300 w-full" />
        <span className="bg-[#FAF9F6] px-3 text-[11px] font-mono text-gray-500 uppercase tracking-widest relative">
          OR WITH EMAIL
        </span>
      </div>
    </div>
  );
}
