'use client';

import React, { useState } from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordField } from '../../components/auth/PasswordField';
import { PasswordStrengthMeter, validatePasswordRules } from '../../components/auth/PasswordStrengthMeter';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRules = validatePasswordRules(password);
  const passwordsMatch = Boolean(confirmPassword && password === confirmPassword);
  const isFormValid = passwordRules.isValid && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }, 1200);
  };

  return (
    <AuthLayout
      headline="Set your new password."
      subheadline="Ensure your new password meets all security rules to protect your executive workspace."
      topRightText="Remembered password?"
      topRightLinkText="Sign In"
      topRightLinkHref="/login"
      badgeText="SECURITY UPDATE"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            Reset Password
          </h2>
          <p className="text-[15px] text-gray-600">
            Create a strong, unique password for your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] font-medium p-4 rounded-[12px] space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 font-bold text-emerald-900">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-emerald-600"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
              <span>Password Reset Successful!</span>
            </div>
            <p className="text-[13px] text-emerald-700">Redirecting you to the sign in page in 2 seconds...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <PasswordField
              id="password"
              label="New Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
            />

            <PasswordStrengthMeter password={password} />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="confirmPassword" className="text-[14px] font-bold text-gray-900 block">
                  Confirm New Password
                </label>
                {passwordsMatch && confirmPassword && (
                  <span className="text-[12px] font-bold text-emerald-600 flex items-center space-x-1">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>Passwords Match</span>
                  </span>
                )}
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`w-full h-12 bg-white border rounded-[10px] px-4 text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-[12px] font-bold text-red-600 pt-0.5">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 mt-4 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save New Password</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
