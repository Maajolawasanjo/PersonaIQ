'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import { PasswordField } from '../../components/auth/PasswordField';

import { useAuth } from '@/providers/auth-provider';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const formattedEmail = email.trim().toLowerCase();

    if (!validateEmail(formattedEmail)) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn(formattedEmail, password);
      if (res && res.requires_2fa) {
        window.location.href = `/2fa?email=${encodeURIComponent(formattedEmail)}`;
        return;
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Welcome back to PersonaIQ."
      subheadline="Sign in to access your executive presence diagnostics, boardroom wardrobe matchers, and session telemetry."
      topRightText="Don't have an account?"
      topRightLinkText="Create Account"
      topRightLinkHref="/signup"
      badgeText="AUTHENTICATION"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Sign In
          </h2>
          <p className="text-[15px] text-gray-600">
            Enter your credentials to continue to your workspace.
          </p>
        </div>

        {/* Social SSO Connectors */}
        <SocialAuthButtons />

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2.5 animate-fadeIn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-red-600"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[14px] font-bold text-gray-900 block">
              Work Email
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

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            rightElement={
              <Link href="/forgot-password" className="text-[13px] font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            }
          />

          <div className="flex items-center space-x-2.5 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-[13.5px] text-gray-700 font-medium select-none cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 mt-4 active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
