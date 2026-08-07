'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import { PasswordField } from '../../components/auth/PasswordField';
import { PasswordStrengthMeter, validatePasswordRules } from '../../components/auth/PasswordStrengthMeter';

import { useAuth } from '@/providers/auth-provider';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formattedEmail = email.trim().toLowerCase();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail);
  
  const passwordRules = validatePasswordRules(password, formattedEmail);
  const passwordsMatch = Boolean(confirmPassword && password === confirmPassword);
  const isConfirmError = Boolean(confirmPassword && !passwordsMatch);

  const isFormValid = 
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isEmailValid &&
    passwordRules.isValid &&
    passwordsMatch &&
    agreedTerms &&
    agreedPrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isFormValid) {
      if (!isEmailValid) setErrorMessage('Please enter a valid work email.');
      else if (!passwordRules.isValid) setErrorMessage('Password does not meet all security requirements.');
      else if (!passwordsMatch) setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await signUp(formattedEmail, password, fullName);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Command your visual presence."
      subheadline="Create your account to unlock real-time composure metrics, boardroom outfit profiles, and executive session telemetry."
      topRightText="Already registered?"
      topRightLinkText="Sign In"
      topRightLinkHref="/login"
      badgeText="REGISTRATION"
    >
      <div className="space-y-5 w-full">
        <div className="space-y-1.5">
          <h2 className="text-[26px] sm:text-[32px] md:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans leading-tight">
            Create Account
          </h2>
          <p className="text-[13.5px] sm:text-[15px] text-gray-600">
            Provision your PersonaIQ diagnostic workspace in seconds.
          </p>
        </div>

        {/* Social SSO Connectors */}
        <SocialAuthButtons />

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3.5 rounded-[10px] flex items-center space-x-2.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-red-600"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full" autoComplete="on">
          
          {/* First & Last Name Split - Reflows on Extra Small Screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 block">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ma'ajo"
                autoComplete="given-name"
                className="w-full h-11 sm:h-12 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-[10px] px-3.5 sm:px-4 text-[14px] sm:text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 block">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Lawasanjo"
                autoComplete="family-name"
                className="w-full h-11 sm:h-12 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-[10px] px-3.5 sm:px-4 text-[14px] sm:text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 block">
              Work Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
              placeholder="maajolawasanjo@gmail.com"
              autoComplete="email"
              className="w-full h-11 sm:h-12 bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-[10px] px-3.5 sm:px-4 text-[14px] sm:text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Password Field + Live Strength Checklist */}
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
          />

          <PasswordStrengthMeter password={password} email={formattedEmail} />

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="confirmPassword" className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 block">
                Confirm Password
              </label>
              {passwordsMatch && confirmPassword && (
                <span className="text-[11.5px] sm:text-[12px] font-bold text-emerald-600 flex items-center space-x-1">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>Passwords Match</span>
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`w-full h-11 sm:h-12 bg-white border rounded-[10px] px-3.5 sm:px-4 text-[14px] sm:text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm ${
                  isConfirmError
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
            </div>
            {isConfirmError && (
              <p className="text-[12px] font-bold text-red-600 pt-0.5">Passwords do not match.</p>
            )}
          </div>

          {/* Checkboxes: Terms & Privacy */}
          <div className="space-y-2 pt-1">
            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="terms"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-[12.5px] sm:text-[13px] text-gray-700 font-medium select-none cursor-pointer leading-snug">
                I agree to the <span className="text-gray-950 font-bold underline">Terms & Conditions</span>.
              </label>
            </div>

            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="privacy"
                required
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="privacy" className="text-[12.5px] sm:text-[13px] text-gray-700 font-medium select-none cursor-pointer leading-snug">
                I acknowledge the <span className="text-gray-950 font-bold underline">Privacy Policy</span> and data processing practices.
              </label>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-[14px] sm:text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 mt-4 active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account & Continue</span>
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
