'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompareRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/journey/compare-looks');
  }, [router]);

  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4 font-mono text-xs text-gray-500">
      <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin mx-auto" />
      <p>Redirecting to canonical Compare Looks hub...</p>
    </div>
  );
}
