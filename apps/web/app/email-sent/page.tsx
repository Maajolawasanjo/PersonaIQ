'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../components/auth/AuthLayout';

export default function EmailSentPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const typeParam = params.get('type');
      if (emailParam) setEmail(emailParam);
      if (typeParam === 'password-reset') {
        setIsPasswordReset(true);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPasswordReset) {
        router.push('/reset-password');
      } else {
        router.push('/2fa');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isPasswordReset, router]);

  return (
    <AuthLayout
      headline={isPasswordReset ? "Reset link dispatched." : "Action required in your inbox."}
      subheadline={
        isPasswordReset
          ? "We sent a secure link to reset your credentials. Check your inbox to continue."
          : "Follow the instructions inside the email to complete your request."
      }
      topRightText="Need help?"
      topRightLinkText="Support"
      topRightLinkHref="/contact"
      badgeText={isPasswordReset ? "PASSWORD RESET" : "NOTIFICATION SENT"}
    >
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-gray-950 font-sans">
            {isPasswordReset ? 'Reset Email Sent' : 'Email Sent'}
          </h2>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            {isPasswordReset
              ? `We sent a password reset link to ${email || 'your email'}. Redirecting you to set a new password in a few seconds...`
              : 'We sent a verification link to your email. Redirecting you to security verification in a few seconds...'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={isPasswordReset ? "/reset-password" : "/2fa"}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>{isPasswordReset ? 'Proceed to Reset Password' : 'Proceed to 2FA'}</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
