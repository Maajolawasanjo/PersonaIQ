'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../providers/auth-provider';

export default function TwoFactorPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const { verifyOtp, resendOtp, isLoading } = useAuth();
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const otpCode = code.join('');
      await verifyOtp(email, otpCode);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setResendSuccess(false);
    try {
      await resendOtp(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.');
    }
  };

  return (
    <AuthLayout
      headline="Two-Factor Security Verification."
      subheadline="Protecting your executive telemetry with mandatory multi-factor authentication."
      topRightText="Having trouble?"
      topRightLinkText="Resend Code"
      topRightLinkHref="#"
      badgeText="2FA SECURITY"
    >
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Enter 2FA Code
          </h2>
          <p className="text-[15px] text-gray-600">
            We sent a verification code to <span className="font-bold text-gray-900">{email || 'your email'}</span>. Please enter it below.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-600 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-emerald-600 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            <span>Code resent successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoComplete="one-time-code"
                className="w-12 h-14 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-[10px] text-center text-[22px] font-bold font-mono text-gray-900 outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || code.join('').length < 6}
            className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[13px] pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-primary hover:underline"
          >
            Resend Code
          </button>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-semibold">
            Cancel
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
