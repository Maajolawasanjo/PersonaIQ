'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What happens to my photos?',
      a: 'We enforce absolute privacy. All uploaded images are processed dynamically inside a secure, sandboxed session, and are permanently deleted from our cache the moment the analysis completes or you close your browser. We never persist your photos on server storage.'
    },
    {
      q: 'How accurate is the Presence Index?',
      a: 'The Presence Index is based on objective, standardized parameters (contrast values, facial hydration, posture grids, and wardrobe outline alignment). It serves as a visual diagnostic tool to help you present yourself professionally rather than a subjective evaluation of style.'
    },
    {
      q: 'Can I use it for virtual/hybrid presentations?',
      a: 'Yes. PersonaIQ was specifically designed to help users prepare for both virtual meetings (Zoom, Teams, Meet) and in-person interviews. The recommendations include specific ring light placement angle configurations and webcam alignments to maximize virtual composure.'
    },
    {
      q: 'Does it diagnose skin conditions?',
      a: 'No. Our Skin Intelligence scanner maps superficial cosmetic metrics—specifically under-eye fatigue circles, surface dehydration, and skin tone consistency—to suggest rapid preparation boosts. It is not a clinical medical scanner and does not diagnose skin conditions.'
    },
    {
      q: 'How long does the analysis take?',
      a: 'The frame validator is instant, and the multimodal AI scan takes less than 15 seconds. The entire Presence Plan checklist and score are compiled and ready for you in under a minute.'
    },
    {
      q: 'Is my data private?',
      a: 'Absolutely. We authenticate user identity via secure Clerk OIDC and route data through secure HTTPS protocols. We enforce a zero-model-training retention policy, ensuring that none of your personal visual diagnostics are used to train future AI models.'
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
            Learn more about our strict privacy safeguards, analysis metrics, and clinical-grade verification parameters.
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
            <p className="text-[14px] text-gray-400 font-semibold">Our support engineers are available to clarify authentication protocols.</p>
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
