'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../providers/auth-provider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await forgotPassword(email);
      window.location.href = `/email-sent?type=password-reset&email=${encodeURIComponent(email)}`;
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <AuthLayout
      headline="Reset your password securely."
      subheadline="Enter the email address associated with your PersonaIQ account and we'll send you an instant reset link."
      topRightText="Remember password?"
      topRightLinkText="Sign In"
      topRightLinkHref="/login"
      badgeText="ACCOUNT RECOVERY"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Forgot Password
          </h2>
          <p className="text-[15px] text-gray-600">
            We will email you a secure link to reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-600 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[14px] font-bold text-gray-900 block">
              Work Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
              placeholder="name@organization.com"
              autoComplete="email"
              className="w-full h-12 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-[10px] px-4 text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 mt-4 active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/login" className="text-[13.5px] font-bold text-gray-600 hover:text-gray-900 transition-colors">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
