'use client';

import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function EmailSentPage() {
  return (
    <AuthLayout headline="Check your inbox." subheadline="Look for an email from PersonaIQ with instructions to continue." topRightText="Need another link?" topRightLinkText="Try again" topRightLinkHref="/forgot-password" badgeText="PASSWORD RECOVERY">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-gray-950">Request received</h1>
        <p className="text-sm leading-7 text-gray-600">
          If an account exists for your email address, password-reset instructions
          will be sent. Follow the link in that email to create a new password.
          For security, this page does not confirm whether an account exists.
        </p>
        <p className="text-sm leading-6 text-gray-600">
          Do not open the password-reset form without a valid link from your inbox.
        </p>
        <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">Return to sign in</Link>
      </div>
    </AuthLayout>
  );
}
