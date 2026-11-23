'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What happens to photos I upload?',
      a: 'Your uploaded photos are stored with your account when private media storage is available. PERSONAIQ uses private storage and temporary access links rather than public image links. Photos are not automatically deleted when you close your browser. You can request account deletion; if storage cleanup fails, the deletion request is not marked complete.'
    },
    {
      q: 'What does the Presence Journey do?',
      a: 'It helps you prepare clothing and visual presentation for an upcoming event. You can enter occasion details, organize outfits, and request a virtual try-on when the rendering service is available. A verified automated Presence Index is not currently available.'
    },
    {
      q: 'Can I plan outfits for online or in-person events?',
      a: 'Yes. You can prepare looks for video calls, interviews, weddings, meetings, and other occasions. Check your room lighting and camera framing yourself; PERSONAIQ does not currently measure your composure, confidence, or professionalism from an image.'
    },
    {
      q: 'Does PERSONAIQ diagnose skin conditions or fatigue?',
      a: 'No. PERSONAIQ is not a medical device and does not assess dehydration, skin disease, fatigue, or mental state. The photo check only confirms that an image can be opened and meets basic size requirements.'
    },
    {
      q: 'How long will a virtual try-on take?',
      a: 'Processing time depends on your connection and the availability of the rendering provider. A successful generated image is shown only when the provider supplies one. If rendering fails, your original image remains available and you can retry.'
    },
    {
      q: 'How do I protect or delete my data?',
      a: 'Account sessions use server-managed HttpOnly cookies. Protected uploads require authenticated access and temporary image links. When a try-on provider is enabled, your selected images may be sent to that provider for rendering. Account deletion is designed to remove stored uploaded media before deleting account records. Existing legacy files and production retention settings still require verification before full release.'
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col w-full py-24 bg-pattern-waves min-h-screen">
      <div className="max-w-3xl mx-auto px-6 space-y-16 text-left">
        
        {/* Header Title */}
        <div className="space-y-4">
          <span className="text-[13px] font-bold text-primary uppercase tracking-widest font-mono">SUPPORT & TRUST</span>
          <h1 className="text-[42px] sm:text-[52px] font-bold tracking-tight text-gray-950 leading-[1.08] font-sans">
            Frequently Asked Questions
          </h1>
          <p className="text-[17.5px] text-gray-500 leading-relaxed max-w-xl">
            Find clear answers about account security, your images, event preparation, and current feature availability.
          </p>
        </div>

        {/* Accordion Questions */}
        <div className="border-t border-gray-150/60 divide-y divide-gray-150/60">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex justify-between items-center text-left py-2.5 focus:outline-none group"
                >
                  <span className="text-[18px] font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {faq.q}
                  </span>
                  <span className={`text-[20px] text-gray-400 group-hover:text-primary transition-all duration-300 transform ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                    ↓
                  </span>
                </button>
                
                {/* Accordion Body */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[15.5px] text-gray-550 leading-relaxed pb-2 max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Contact block */}
        <div className="bg-white border border-gray-150 rounded-[20px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.005)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-[16.5px] font-bold text-gray-900 font-sans">Still have questions?</h4>
            <p className="text-[14px] text-gray-400 font-semibold">Explore the available features or contact the team for assistance.</p>
          </div>
          <Link href="/signup">
            <Button className="h-11 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[14px] rounded-[6px] transition-all">
              Get Started Free
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
