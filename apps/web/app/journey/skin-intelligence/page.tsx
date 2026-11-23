'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Shirt } from 'lucide-react';

export default function StylePreparationPage() {
  const router = useRouter();

  const continueToOutfits = () => {
    localStorage.setItem('personaiq_active_draft_step', '/journey/choose-outfit');
    router.push('/journey/choose-outfit');
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 py-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <Shirt className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-red-700">Your next step</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">Let's plan your outfit</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          Your photo is available for visual outfit previews. Choose clothing for
          your occasion and review the result when the try-on provider returns a real image.
        </p>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
            <p className="text-sm leading-6 text-gray-700">
              PERSONAIQ does not currently provide clinically validated skin,
              fatigue, or facial health assessments. Image-quality checks are not
              measurements of confidence, competence, or personal worth.
            </p>
          </div>
        </div>
        <button type="button" onClick={continueToOutfits}
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
          Choose my outfit <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mt-5">
          <Link href="/journey/capture-look" className="text-sm font-medium text-gray-600 hover:text-gray-950">
            Change photo
          </Link>
        </div>
      </section>
    </main>
  );
}
