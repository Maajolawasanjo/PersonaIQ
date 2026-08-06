'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Users, FileText, CheckCircle2, Star } from 'lucide-react';

export default function BillingSettingsPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Essential',
      price: billingCycle === 'monthly' ? '$29' : '$24',
      period: '/mo',
      desc: 'Ideal for emerging leaders looking to audit and scale their baseline presence.',
      features: ['10 AI Presence scans / mo', 'Full Skin Intelligence analysis', 'Standard Virtual Try-On', 'Email support'],
      current: false,
    },
    {
      name: 'Executive',
      price: billingCycle === 'monthly' ? '$79' : '$64',
      period: '/mo',
      desc: 'Optimized for senior researchers, professionals, and high-frequency speakers.',
      features: ['Unlimited AI Presence scans', 'Comprehensive Vocal Confidence analytics', 'Premium styling & wardrobe recommendations', 'Priority processing & expert feedback', 'Long-term progress charts'],
      current: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Bespoke integration for institutions, organizations, and team-wide intelligence.',
      features: ['Custom heuristics & scoring metrics', 'Dedicated account strategist', 'SLA-backed API access', 'Clerk & custom SSO integrations', 'Full telemetry & security dashboard'],
      current: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <Link href="/dashboard/settings" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 flex items-center space-x-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Settings</span>
        </Link>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Plans & Billing
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Manage subscriptions, invoices, payment options, and professional seat authorization.
        </p>
      </div>

      {/* Subscription Plans Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-[20px] font-bold text-gray-950 font-sans">Subscription Plans</h3>
            <p className="text-[12.5px] text-gray-500">Choose the optimal plan to scale your digital presence.</p>
          </div>

          {/* Toggle Monthly/Yearly */}
          <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-mono font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-mono font-bold transition-all flex items-center space-x-1 ${
                billingCycle === 'yearly' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] font-mono text-red-650 font-extrabold bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-[22px] p-6 flex flex-col justify-between relative transition-all ${
                plan.current
                  ? 'border-2 border-red-600 bg-red-50/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 text-[9.5px] font-mono font-bold text-white bg-red-600 border border-red-700 px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                  <Star className="w-3 h-3 fill-white" />
                  <span>MOST POPULAR</span>
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">{plan.name}</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-[34px] font-extrabold text-gray-950 font-sans leading-none">{plan.price}</span>
                    <span className="text-[12px] text-gray-500 font-mono">{plan.period}</span>
                  </div>
                </div>

                <p className="text-[12.5px] text-gray-600 leading-relaxed font-normal">{plan.desc}</p>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2 text-[12.5px] text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {plan.current ? (
                  <div className="w-full py-2.5 text-center text-[12.5px] font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-[10px] select-none">
                    Current Active Plan
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`w-full py-2.5 text-center text-[12.5px] font-bold rounded-[10px] transition-all border ${
                      plan.name === 'Enterprise'
                        ? 'bg-gray-950 hover:bg-gray-900 text-white border-gray-950'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                    }`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Institutional Sales' : 'Upgrade Plan'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-700" />
            <span>Saved Payment Method</span>
          </span>
          <button className="text-[12px] font-mono font-bold text-primary hover:underline">Update Method</button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-[14px] border border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-8 bg-gray-950 rounded-[6px] flex items-center justify-center font-bold text-white text-[12px] font-mono tracking-widest shrink-0">
              VISA
            </div>
            <div>
              <span className="text-[14px] font-bold text-gray-950 block leading-tight">Visa Ending in 4242</span>
              <span className="text-[11.5px] text-gray-400 font-mono">Expires 12 / 2028</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">ACTIVE</span>
        </div>
      </div>

      {/* Team Seat Authorization */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-700" />
            <span>Institutional Seats</span>
          </span>
          <button className="text-[12px] font-mono font-bold text-primary hover:underline">+ Buy Seats</button>
        </div>
        <p className="text-[12.5px] text-gray-500 font-normal">Authorize seats for team members to collaborate on Presence Journeys and share styling reports.</p>
        <div className="p-4 rounded-[14px] border border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <span className="text-[13.5px] font-medium text-gray-750">Authorized seats in use:</span>
          <span className="text-[16px] font-bold font-sans text-gray-950">3 / 5 Seats</span>
        </div>
      </div>

      {/* Billing Invoices History */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
        <span className="text-[14px] font-bold text-gray-950 font-sans flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-700" />
          <span>Billing History & Invoices</span>
        </span>
        <div className="space-y-3">
          {[
            { id: 'INV-0428', date: 'Jul 24, 2026', amount: '$64.00', status: 'Paid' },
            { id: 'INV-0391', date: 'Jun 24, 2026', amount: '$64.00', status: 'Paid' },
            { id: 'INV-0352', date: 'May 24, 2026', amount: '$64.00', status: 'Paid' },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3.5 rounded-[12px] border border-gray-150 bg-white hover:border-gray-300 transition-all">
              <div className="flex items-center space-x-3">
                <span className="text-[13.5px] font-bold text-gray-950 font-mono">{inv.id}</span>
                <span className="text-[12.5px] text-gray-400 font-mono">{inv.date}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[13.5px] font-bold text-gray-950 font-mono">{inv.amount}</span>
                <span className="text-[10px] font-mono font-bold text-green-650 bg-green-50 border border-green-200 px-2 py-0.2 rounded-full">{inv.status}</span>
                <button type="button" className="text-[12px] font-mono font-bold text-primary hover:underline">PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
