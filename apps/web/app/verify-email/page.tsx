'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../components/auth/AuthLayout';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('maajolawasanjo@gmail.com');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Parse query param email if available
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Simulate verification completion and redirect to onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 4500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendSuccess(true);
    setCountdown(60);
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <AuthLayout
      headline="Check your inbox."
      subheadline="We have dispatched an encrypted verification link to your work email address."
      topRightText="Wrong email?"
      topRightLinkText="Change Email"
      topRightLinkHref="/signup"
      badgeText="EMAIL VERIFICATION"
    >
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Verify your email
          </h2>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            We sent a verification link to <span className="font-bold text-gray-900">{email}</span>. Please click the link to activate your account and start onboarding.
          </p>
        </div>

        {resendSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-emerald-600 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            <span>Verification email re-sent successfully!</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            <span>Verify & Start Onboarding</span>
          </Link>

          <div className="flex items-center justify-between text-[13.5px] pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className="font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              Resend Email
            </button>

            {!canResend ? (
              <span className="font-mono text-gray-400 font-medium">Resend in {countdown}s</span>
            ) : (
              <span className="text-emerald-600 font-bold">Ready to resend</span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-[13px]">
          <Link href="/signup" className="text-gray-600 hover:text-gray-900 font-semibold">
            ← Change email address
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
