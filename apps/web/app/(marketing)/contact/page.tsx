'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* Hero */}
      <div className="py-24 text-center px-6 bg-pattern-waves">
        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] font-mono">GET IN TOUCH</span>
        <h1 className="text-[48px] sm:text-[60px] font-extrabold tracking-tight text-gray-950 leading-[1.06] font-sans mt-3">
          We would love<br />to hear from you.
        </h1>
        <p className="text-[17px] text-gray-500 leading-relaxed mt-4 max-w-lg mx-auto">
          Whether you have a question about our platform, pricing, or want to book a live walkthrough — our team is ready.
        </p>
      </div>

      {/* Info Cards Row */}
      <div className="bg-gray-950 py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              ),
              label: 'Office Location',
              value: '6 Free Town Road',
              sub: 'Apapa, Lagos, Nigeria',
            },
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              ),
              label: 'Email Us',
              value: 'maajolawasanjo@gmail.com',
              sub: 'We reply within 24 hours',
            },
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11 19.79 19.79 0 0 1 1.61 2.18 2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              ),
              label: 'Call Us',
              value: '+234 810 551 0626',
              sub: 'Mon – Fri, 9am – 5pm WAT',
            },
          ].map((card) => (
            <div key={card.label} className="bg-white/[0.04] border border-white/[0.07] rounded-[18px] p-6 flex items-start space-x-4">
              <div className="w-11 h-11 rounded-[10px] bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                {card.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">{card.label}</p>
                <p className="text-[15px] font-bold text-white mt-1">{card.value}</p>
                <p className="text-[13px] text-gray-500 mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Form Section */}
      <div className="py-24 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Map */}
          <div className="space-y-4">
            <h2 className="text-[30px] font-extrabold text-gray-950 font-sans tracking-tight">Find Us</h2>
            <p className="text-[15px] text-gray-500">6 Free Town Road, Apapa, Lagos, Nigeria</p>
            <div className="rounded-[20px] overflow-hidden border border-gray-200 shadow-sm h-[420px] bg-gray-100">
              <iframe
                title="PersonaIQ Office Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.3538%2C6.4295%2C3.4038%2C6.4695&layer=mapnik&marker=6.4495%2C3.3788"
              />
            </div>
            <div className="bg-white border border-gray-150 rounded-[14px] p-5 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-950">PersonaIQ HQ</p>
                <p className="text-[13px] text-gray-500 mt-0.5">6 Free Town Road, Apapa, Lagos 101212, Nigeria</p>
                <a
                  href="https://maps.google.com/?q=6+Free+Town+Road,+Apapa,+Lagos,+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-primary font-bold mt-1.5 block hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-150 rounded-[24px] p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-[22px] font-bold text-gray-950 font-sans">Message Sent!</h3>
                <p className="text-[15px] text-gray-500 max-w-xs">Our team will get back to you within 24 hours. Check your inbox.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="text-primary font-bold text-[14px] hover:underline mt-2">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Send a Message</h2>
                  <p className="text-[14.5px] text-gray-500 mt-1">Fill in the form and we will get back to you promptly.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full h-11 px-4 border border-gray-200 rounded-[10px] text-[14.5px] text-gray-900 placeholder:text-gray-350 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50/50"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full h-11 px-4 border border-gray-200 rounded-[10px] text-[14.5px] text-gray-900 placeholder:text-gray-350 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Subject</label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full h-11 px-4 border border-gray-200 rounded-[10px] text-[14.5px] text-gray-900 placeholder:text-gray-350 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-[10px] text-[14.5px] text-gray-900 placeholder:text-gray-350 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50/50 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-[10px] transition-all active:scale-[0.98]">
                  Send Message →
                </Button>
                <p className="text-[12px] text-gray-400 text-center">We typically respond within 24 hours during business days.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
