'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { WorkspaceBrand } from '@/components/workspace/WorkspaceBrand';

const STEP_LABELS: Array<{ route: string; label: string }> = [
  { route: '/journey/start', label: 'Start' },
  { route: '/journey/event-type', label: 'Occasion' },
  { route: '/journey/event-details', label: 'Event details' },
  { route: '/journey/dress-code', label: 'Dress code' },
  { route: '/journey/capture-look', label: 'Your photo' },
  { route: '/journey/validation', label: 'Photo check' },
  { route: '/journey/skin-intelligence', label: 'Style planning' },
  { route: '/journey/choose-outfit', label: 'Choose outfit' },
  { route: '/journey/virtual-try-on', label: 'Try-on preview' },
];

export default function JourneyLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStep = STEP_LABELS.findIndex(step => step.route === pathname);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-950">
      <a href="#journey-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3">
        Skip to journey content
      </a>

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-7">
          <WorkspaceBrand compact />
          <span className="hidden truncate text-sm font-semibold text-gray-600 sm:block">Prepare for your occasion</span>
          <Link href="/dashboard" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50" aria-label="Exit journey to dashboard">
            <X aria-hidden="true" className="h-4 w-4" />
            <span>Exit</span>
          </Link>
        </div>
      </header>

      {currentStep >= 0 && (
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-7">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">Step {currentStep + 1} of {STEP_LABELS.length}</p>
              <p className="truncate text-sm font-semibold text-gray-950">{STEP_LABELS[currentStep].label}</p>
            </div>
            <div aria-label={'Step ' + (currentStep + 1) + ' of ' + STEP_LABELS.length} className="flex items-center gap-1.5">
              {STEP_LABELS.map((step, index) => (
                <span key={step.route} aria-hidden="true" className={'h-1.5 w-4 rounded-full sm:w-6 ' + (index <= currentStep ? 'bg-primary' : 'bg-gray-200')} />
              ))}
            </div>
          </div>
        </div>
      )}

      <main id="journey-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-7 sm:pt-9">
        {children}
      </main>

      <footer className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-8 sm:px-7">
        <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-950">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to workspace
        </Link>
        <span className="text-xs text-gray-500">PersonaIQ</span>
      </footer>
    </div>
  );
}
