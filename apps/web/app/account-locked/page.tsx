'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthLayout } from '../../components/auth/AuthLayout';

export default function AccountLockedPage() {
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 minutes cooldown

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AuthLayout
      headline="Account Temporarily Locked."
      subheadline="Defensive security triggered following multiple failed login attempts."
      topRightText="Need help?"
      topRightLinkText="Contact Security"
      topRightLinkHref="/contact"
      badgeText="SECURITY LOCKOUT"
    >
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Account Locked
          </h2>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Your account has been temporarily locked to prevent unauthorized access after 5 consecutive failed password attempts.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-[12px] p-5 space-y-3">
          <div className="flex justify-between items-center text-[13px] font-bold text-red-900">
            <span>Cooldown Period Remaining:</span>
            <span className="font-mono text-[18px] text-red-600">{formatTime(secondsLeft)}</span>
          </div>
          <p className="text-[12.5px] text-red-700 leading-normal">
            You may attempt to log in again once the timer reaches zero, or request a password reset link to unlock your workspace immediately.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/forgot-password"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>Reset Password to Unlock</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>

          <Link
            href="/login"
            className="w-full h-12 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-[14px] rounded-[10px] shadow-sm flex items-center justify-center space-x-2"
          >
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
