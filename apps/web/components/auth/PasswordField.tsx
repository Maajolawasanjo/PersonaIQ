'use client';

import React, { useState, useRef } from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
  error?: string;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••••••',
  autoComplete = 'current-password',
  required = true,
  rightElement,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = () => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPassword((prev) => !prev);

    // Maintain cursor position after toggle re-render
    requestAnimationFrame(() => {
      if (input && start !== null && end !== null) {
        input.setSelectionRange(start, end);
        input.focus();
      }
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-[14px] font-bold text-gray-900 block">
          {label}
        </label>
        {rightElement}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-12 bg-white border rounded-[10px] px-4 text-[15px] text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all shadow-sm pr-12 ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
          }`}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            /* Eye Off Icon */
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            /* Eye Open Icon */
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p className="text-[12px] font-bold text-red-600 pt-0.5">{error}</p>
      )}
    </div>
  );
}
