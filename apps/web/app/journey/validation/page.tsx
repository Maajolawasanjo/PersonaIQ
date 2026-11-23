'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ImageOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { uploadApi } from '@/lib/api/services';

type PhotoState =
  | { status: 'loading' }
  | { status: 'error'; reason: string }
  | { status: 'ready'; src: string; width: number; height: number };

export default function PhotoValidationPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<PhotoState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const load = async () => {
      const journeyId = localStorage.getItem('personaiq_active_journey_id');
      if (!journeyId) {
        setPhoto({ status: 'error', reason: 'Start a journey before checking a photo.' });
        return;
      }
      try {
        const link = await uploadApi.getSelfiePreview(journeyId);
        if (!link.url.startsWith('https://')) throw new Error('No private image link');
        const image = new Image();
        image.onload = () => {
          if (!active) return;
          if (image.naturalWidth < 400 || image.naturalHeight < 400) {
            setPhoto({ status: 'error', reason: 'Please upload a photo at least 400 × 400 pixels.' });
          } else {
            setPhoto({ status: 'ready', src: link.url, width: image.naturalWidth, height: image.naturalHeight });
          }
        };
        image.onerror = () => {
          if (active) setPhoto({ status: 'error', reason: 'The photo could not be displayed. Please upload it again.' });
        };
        image.src = link.url;
      } catch {
        if (active) setPhoto({
          status: 'error',
          reason: 'Your saved photo could not be accessed securely. Please return to capture and retry.',
        });
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const next = () => {
    if (photo.status !== 'ready') return;
    localStorage.setItem('personaiq_active_draft_step', '/journey/skin-intelligence');
    router.push('/journey/skin-intelligence');
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 py-6">
      <header className="rounded-2xl bg-gray-950 px-6 py-5 text-white">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Private photo preview
        </p>
        <h1 className="mt-3 text-3xl font-bold">Check your photo</h1>
        <p className="mt-2 text-sm text-gray-300">
          Confirm that the image is clear and large enough for outfit planning.
          This check does not detect a face or diagnose skin, fatigue, or health.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {photo.status === 'loading' ? (
          <p role="status" className="py-10 text-center text-sm text-gray-600">Loading your private image...</p>
        ) : photo.status === 'error' ? (
          <div role="alert" className="space-y-4 py-8 text-center">
            <ImageOff className="mx-auto h-10 w-10 text-red-600" />
            <p className="text-sm text-gray-700">{photo.reason}</p>
            <Link href="/journey/capture-look"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
              Choose another photo
            </Link>
          </div>
        ) : (
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <img src={photo.src} alt="Your securely uploaded photo" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <div>
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              <h2 className="mt-3 text-xl font-bold text-gray-950">Photo loaded successfully</h2>
              <p className="mt-3 text-sm text-gray-600">Image dimensions: {photo.width} × {photo.height} pixels.</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                This confirms the image can be displayed and meets the minimum size.
                It does not evaluate personal appearance, personality, or medical characteristics.
              </p>
              <button type="button" onClick={next}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
