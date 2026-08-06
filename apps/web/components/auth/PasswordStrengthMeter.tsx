'use client';

import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
  email?: string;
}

export function validatePasswordRules(password: string, email: string = '') {
  const trimmed = password.trim();
  const lowerPass = password.toLowerCase();
  const lowerEmail = email.toLowerCase().trim();

  const minLength = password.length >= 8 && password.length <= 128;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?\/\\~`]/.test(password);
  const noSurroundingSpaces = password.length > 0 && password === trimmed;
  
  // Rejection checks
  const isEmailMatch = Boolean(lowerEmail && lowerEmail.includes(lowerPass) && password.length > 3);
  const commonPatterns = ['password', '123456', 'qwerty', 'abcdef', '111111', 'admin', 'letmein', 'personaiq'];
  const containsCommon = commonPatterns.some(p => lowerPass.includes(p));
  const hasSequentialRep = /(.)\1{3,}/.test(password); // e.g. aaaa or 1111

  const isRejected = isEmailMatch || containsCommon || hasSequentialRep || !noSurroundingSpaces;

  // Calculate Entropy Score
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 32;

  const entropyBits = Math.floor(password.length * (poolSize > 0 ? Math.log2(poolSize) : 0));

  // Determine Level (0 to 4)
  let satisfiedCount = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (isRejected && satisfiedCount > 1) satisfiedCount = 1;

  let level: 0 | 1 | 2 | 3 | 4 = 0;
  let label = 'Very Weak';
  let colorClass = 'bg-gray-200';

  if (password.length > 0) {
    if (satisfiedCount <= 2 || isRejected) {
      level = 0;
      label = isRejected ? 'Rejected (Common/Invalid)' : 'Very Weak';
      colorClass = 'bg-red-500';
    } else if (satisfiedCount === 3) {
      level = 1;
      label = 'Weak';
      colorClass = 'bg-amber-500';
    } else if (satisfiedCount === 4) {
      level = 2;
      label = 'Fair';
      colorClass = 'bg-yellow-500';
    } else if (satisfiedCount === 5 && password.length < 12) {
      level = 3;
      label = 'Strong';
      colorClass = 'bg-emerald-500';
    } else if (satisfiedCount === 5 && password.length >= 12) {
      level = 4;
      label = 'Excellent';
      colorClass = 'bg-emerald-600';
    }
  }

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    noSurroundingSpaces,
    isRejected,
    entropyBits,
    level,
    label,
    colorClass,
    isValid: satisfiedCount === 5 && !isRejected,
  };
}

export function PasswordStrengthMeter({ password, email }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const rules = validatePasswordRules(password, email);

  const checklistItems = [
    { label: '8+ Characters (Max 128)', satisfied: rules.minLength },
    { label: 'Uppercase Letter (A-Z)', satisfied: rules.hasUpper },
    { label: 'Lowercase Letter (a-z)', satisfied: rules.hasLower },
    { label: 'Number (0-9)', satisfied: rules.hasNumber },
    { label: 'Special Character (!@#$...)', satisfied: rules.hasSpecial },
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Progress Bar & Rating Header */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[12px] font-mono">
          <span className="text-gray-600 font-semibold">Password Strength:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${rules.isRejected ? 'text-red-600' : 'text-gray-900'}`}>
              {rules.label}
            </span>
            {rules.entropyBits > 0 && !rules.isRejected && (
              <span className="text-gray-400 font-normal">({rules.entropyBits} bits entropy)</span>
            )}
          </div>
        </div>

        {/* 5 Segmented Strength Bar */}
        <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
          {[0, 1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                step <= rules.level ? rules.colorClass : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live Requirement Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11.5px] font-medium">
        {checklistItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center space-x-1.5 ${
              item.satisfied ? 'text-emerald-700 font-bold' : 'text-gray-400'
            }`}
          >
            {item.satisfied ? (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="text-emerald-600 shrink-0">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mx-1" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Rejection Error Alert if patterns detected */}
      {rules.isRejected && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium p-2.5 rounded-[8px] flex items-center space-x-2">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-red-600"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          <span>Avoid common words, email matches, or repeated characters.</span>
        </div>
      )}
    </div>
  );
}
