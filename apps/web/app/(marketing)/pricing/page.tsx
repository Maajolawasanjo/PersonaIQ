'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Sandbox',
      price: '$0',
      desc: 'Test your composure and check basic parameters completely sign-up free.',
      features: [
        'Webcam framing validator',
        'Basic lighting contrast checks',
        'One-off style suitability scans',
        'Standard dashboard previews'
      ],
      cta: 'Try Sandbox Free',
      href: '/demo',
      popular: false
    },
    {
      name: 'Presence Pro',
      price: '$19',
      desc: 'Unlock continuous visual coaching, full diagnostic history, and custom training roadmaps.',
      features: [
        'Everything in Sandbox',
        'YouCam live overlay integration',
        'Clinical under-eye fatigue mapping',
        'Explainability panels deconstruction',
        '4-week habit change curriculum',
        'Multi-session progress tracking'
      ],
      cta: 'Go Pro Free',
      href: '/signup',
      popular: true
    }
  ];

  return (
    <div className="flex flex-col w-full py-24 bg-pattern-geom min-h-screen">
      <div className="max-w-6xl mx-auto px-6 space-y-20">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[13px] font-bold text-primary uppercase tracking-widest font-mono">MEMBERSHIP PLANS</span>
          <h1 className="text-[42px] sm:text-[52px] font-bold tracking-tight text-gray-950 leading-[1.08] font-sans">
            Transparent, value-driven pricing
          </h1>
          <p className="text-[17.5px] text-gray-500 leading-relaxed max-w-lg mx-auto">
            Select the plan designed to secure your authority and poise in every professional context.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`bg-white border rounded-[24px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-350 flex flex-col justify-between min-h-[490px] text-left relative ${
                tier.popular ? 'border-primary ring-1 ring-primary' : 'border-gray-150'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-8 bg-primary text-white text-[10.5px] font-bold font-mono px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-[22px] font-bold text-gray-950 font-sans">{tier.name}</h3>
                  <p className="text-[15.5px] text-gray-550 mt-2 leading-relaxed">{tier.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1.5">
                  <span className="text-[50px] font-black text-gray-950 tracking-tighter leading-none">{tier.price}</span>
                  <span className="text-gray-400 text-[15px] font-medium font-sans">/ month</span>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <span className="text-[11.5px] font-bold text-gray-400 uppercase tracking-widest font-mono block mb-4">WHAT'S INCLUDED</span>
                  <ul className="space-y-3.5">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-3 text-[15px] text-gray-655 leading-relaxed">
                        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={tier.href}>
                  <Button className={`w-full h-12 font-bold text-[15px] rounded-[8px] transition-all active:scale-[0.98] ${
                    tier.popular 
                      ? 'bg-primary hover:bg-primary/95 text-white shadow-sm' 
                      : 'bg-white hover:bg-gray-50 text-gray-850 border border-gray-250'
                  }`}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
