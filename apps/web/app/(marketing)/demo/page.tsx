'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';

type StepId = 'context' | 'upload' | 'skin' | 'outfit' | 'result';

const steps: { id: StepId; label: string; sub: string }[] = [
  { id: 'context', label: 'Event Context', sub: 'Define your scenario' },
  { id: 'upload', label: 'Capture Look', sub: 'Frame validation' },
  { id: 'skin', label: 'Skin Diagnostics', sub: 'Physical metrics' },
  { id: 'outfit', label: 'Style Compare', sub: 'Wardrobe matching' },
  { id: 'result', label: 'Presence Plan', sub: 'Your action blueprint' },
];

export default function InteractiveDemoPage() {
  const [step, setStep] = useState<StepId>('context');
  const [eventType, setEventType] = useState('pitch');
  const [importance, setImportance] = useState('high');
  const [selectedPhoto, setSelectedPhoto] = useState<'poor' | 'good'>('good');
  const [checklist, setChecklist] = useState([
    { text: 'Adjust webcam to eye level', checked: false },
    { text: 'Verify collar symmetry', checked: true },
    { text: 'Steam blazer lapels', checked: false },
    { text: 'Position ring light at 45°', checked: true },
  ]);

  const toggleCheck = (idx: number) => {
    const next = [...checklist];
    next[idx].checked = !next[idx].checked;
    setChecklist(next);
  };

  const currentIdx = steps.findIndex(s => s.id === step);

  const goNext = () => {
    if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1].id);
  };
  const goBack = () => {
    if (currentIdx > 0) setStep(steps[currentIdx - 1].id);
  };

  const sideInfo: Record<StepId, { title: string; body: string; stat: string; statLabel: string }> = {
    context: { title: 'Audience Intelligence', body: 'We cross-reference your event type with industry dress-code standards, audience seniority, and cultural norms to build a precision profile.', stat: '200+', statLabel: 'Event archetypes' },
    upload: { title: 'Frame Validator', body: 'Before any AI scan runs, we verify lighting balance, background noise, and camera offset to guarantee diagnostic accuracy.', stat: '99.2%', statLabel: 'Frame accuracy' },
    skin: { title: 'Epidermal Analysis', body: 'Clinical-grade hydration, fatigue, and contrast metrics are extracted and translated into actionable preparation offsets.', stat: '12ms', statLabel: 'Scan latency' },
    outfit: { title: 'Wardrobe Geometry', body: 'Colour contrast, lapel symmetry, and fit alignment are rated against the contextual audience profile you defined in step one.', stat: '96%', statLabel: 'Match precision' },
    result: { title: 'Presence Index™', body: 'A single composite score derived from all four modules. Every point is traceable to a specific data vector.', stat: '94', statLabel: 'Sandbox score' },
  };

  const info = sideInfo[step];

  return (
    <div className="min-h-screen bg-pattern-geom flex flex-col">
      {/* Hero Header */}
      <div className="py-20 text-center px-6">
        <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] font-mono">SANDBOX EXPERIENCE</span>
        <h1 className="text-[48px] sm:text-[58px] font-extrabold tracking-tight text-gray-950 leading-[1.06] font-sans mt-3">
          Try the Presence Journey
        </h1>
        <p className="text-[17px] text-gray-500 leading-relaxed mt-4 max-w-xl mx-auto">
          No account needed. Walk through all five diagnostic steps and see your Presence Index calculated live.
        </p>
      </div>

      {/* Main 2-col Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Dark Panel */}
          <div className="lg:col-span-4 bg-gray-950 rounded-[24px] p-8 flex flex-col justify-between min-h-[600px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(163,31,52,0.18),transparent_60%)] pointer-events-none" />

            {/* Step tracker */}
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-mono mb-5">JOURNEY PROGRESS</p>
              {steps.map((s, idx) => {
                const isActive = s.id === step;
                const isDone = idx < currentIdx;
                return (
                  <button
                    key={s.id}
                    onClick={() => idx <= currentIdx && setStep(s.id)}
                    disabled={idx > currentIdx}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-[10px] text-left transition-all ${isActive ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'} disabled:opacity-30`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black transition-all ${isActive ? 'bg-primary text-white' : isDone ? 'bg-emerald-500 text-white' : 'border border-gray-700 text-gray-600'}`}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <div>
                      <p className={`text-[13.5px] font-bold leading-none ${isActive ? 'text-white' : 'text-gray-400'}`}>{s.label}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{s.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info block */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.06] space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] font-mono">{info.title}</p>
              <p className="text-[14px] text-gray-400 leading-relaxed">{info.body}</p>
              <div className="pt-2">
                <span className="text-[36px] font-black text-white tracking-tight leading-none">{info.stat}</span>
                <span className="text-[12px] text-gray-500 font-mono ml-2">{info.statLabel}</span>
              </div>
            </div>
          </div>

          {/* Right Step Panel */}
          <div className="lg:col-span-8 bg-white border border-gray-150/60 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col min-h-[600px] overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                Step {currentIdx + 1} of {steps.length} — {steps[currentIdx].label}
              </span>
              <div className="w-10" />
            </div>

            {/* Step content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div className="flex-1">

                {/* STEP 1 */}
                {step === 'context' && (
                  <div className="space-y-7">
                    <div>
                      <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Define your event parameters</h2>
                      <p className="text-[15.5px] text-gray-500 mt-2 leading-relaxed">Our engine maps your event type against industry dress expectations for your audience.</p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 font-mono">Event Category</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'pitch', label: 'Investor Pitch', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                          { id: 'interview', label: 'Job Interview', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
                          { id: 'keynote', label: 'Keynote Address', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> },
                          { id: 'board', label: 'Boardroom Meeting', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
                        ].map(item => (
                          <button
                            key={item.id}
                            onClick={() => setEventType(item.id)}
                            className={`p-4 rounded-[14px] border-2 text-left transition-all ${eventType === item.id ? 'border-primary bg-primary/5' : 'border-gray-150 hover:border-gray-300'}`}
                          >
                            <span className="text-2xl block mb-2">{item.icon}</span>
                            <span className="text-[15px] font-bold text-gray-900 leading-snug block">{item.label}</span>
                            {eventType === item.id && <span className="text-[11px] text-primary font-bold font-mono mt-1 block">SELECTED</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3 font-mono">Stakes Level</label>
                      <div className="flex space-x-3">
                        {['high', 'standard'].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setImportance(lvl)}
                            className={`flex-1 py-3 rounded-[10px] text-[14px] font-bold border-2 transition-all ${importance === lvl ? 'bg-primary border-primary text-white' : 'border-gray-150 text-gray-600 hover:border-gray-300'}`}
                          >
                            {lvl === 'high' ? 'High Stakes (Exec)' : 'Standard Meeting'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 'upload' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Frame composition validator</h2>
                      <p className="text-[15.5px] text-gray-500 mt-2 leading-relaxed">Select a sample to see how our validator scores lighting, contrast, and composure.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {([
                        { id: 'poor' as const, label: 'Sample A — Backlit', badge: 'Contrast Error', badgeColor: 'text-red-600 bg-red-50 border-red-100' },
                        { id: 'good' as const, label: 'Sample B — Balanced', badge: '✓ Optimized', badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                      ]).map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedPhoto(opt.id)}
                          className={`rounded-[16px] border-2 p-3.5 text-left transition-all ${selectedPhoto === opt.id ? 'border-primary bg-primary/5' : 'border-gray-150 hover:border-gray-250'}`}
                        >
                          <div className={`aspect-[4/3] rounded-[10px] mb-3 flex items-center justify-center ${opt.id === 'poor' ? 'bg-gray-900 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                            {opt.id === 'poor' ? (
                              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                            ) : (
                              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            )}
                          </div>
                          <p className="text-[14px] font-bold text-gray-900">{opt.label}</p>
                          <span className={`text-[11px] font-bold border px-2 py-0.5 rounded-md mt-1.5 inline-block ${opt.badgeColor}`}>{opt.badge}</span>
                        </button>
                      ))}
                    </div>
                    <div className={`p-4 rounded-[12px] border text-[14px] font-semibold leading-relaxed flex items-start space-x-3 ${selectedPhoto === 'poor' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                      <span className="shrink-0 mt-0.5">{selectedPhoto === 'poor' ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}</span>
                      <span>{selectedPhoto === 'poor' ? 'Backlight warning: Reposition your light source before proceeding.' : 'Validator OK: Frame composition and contrast levels are balanced.'}</span>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 'skin' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Skin Diagnostics Scan</h2>
                      <p className="text-[15.5px] text-gray-500 mt-2 leading-relaxed">Clinical metrics modelled from your frame — hydration, fatigue, and epidermal contrast.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-gray-950 rounded-[16px] p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,31,52,0.2),transparent)] pointer-events-none" />
                        <div className="relative z-10">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">SCAN TARGET</span>
                          <div className="mt-4 flex items-center space-x-3">
                            <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-primary/40 flex items-center justify-center text-primary"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                            <div>
                              <p className="text-[14px] font-bold text-white">Live subject detected</p>
                              <div className="flex items-center space-x-1.5 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[11px] text-emerald-400 font-mono">SCANNING...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative z-10 text-[11px] text-gray-600 font-mono">4 biomarkers • Frame lock: active</div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Hydration Index', val: 92, pct: '92%', color: 'bg-emerald-500', text: 'text-emerald-600' },
                          { label: 'Fatigue Index', val: 40, pct: '40%', color: 'bg-amber-400', text: 'text-amber-600' },
                          { label: 'Contrast Score', val: 78, pct: '78%', color: 'bg-primary', text: 'text-primary' },
                        ].map(m => (
                          <div key={m.label}>
                            <div className="flex justify-between text-[13.5px] font-semibold mb-1.5">
                              <span className="text-gray-600">{m.label}</span>
                              <span className={m.text}>{m.pct}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className={`${m.color} h-full rounded-full`} style={{ width: m.pct }} />
                            </div>
                          </div>
                        ))}
                        <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-[10px] text-[13px] text-primary font-semibold leading-relaxed">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                          <span>Apply hydration drops and a cold compress 15 min before the session.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 'outfit' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Style matching & comparison</h2>
                      <p className="text-[15.5px] text-gray-500 mt-2 leading-relaxed">Our engine rates outfit geometry against your audience context profile.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-primary bg-primary/5 rounded-[18px] p-5 flex flex-col space-y-4 relative">
                        <span className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase">RECOMMENDED</span>
                        <div className="w-full aspect-square bg-gray-900 rounded-[12px] flex items-center justify-center text-gray-400"><svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-950">Brown Peaked Lapel Suit</h3>
                          <span className="text-[13px] font-bold text-primary font-mono block mt-1">96% Suitability Match</span>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-primary h-full w-[96%]" /></div>
                        </div>
                      </div>
                      <div className="border border-gray-150 rounded-[18px] p-5 flex flex-col space-y-4">
                        <span className="inline-block bg-gray-100 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase w-fit">ALTERNATIVE</span>
                        <div className="w-full aspect-square bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-300"><svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg></div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-700">Polo & Shorts Set</h3>
                          <span className="text-[13px] font-bold text-gray-400 font-mono block mt-1">64% Suitability Match</span>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-gray-300 h-full w-[64%]" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {step === 'result' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-extrabold text-gray-950 font-sans">Your Sandbox Presence Plan</h2>
                      <p className="text-[15.5px] text-gray-500 mt-2 leading-relaxed">All five diagnostics complete. Here is your composite result and action checklist.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-4 bg-gray-950 rounded-[18px] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(163,31,52,0.3),transparent_60%)] pointer-events-none" />
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest relative z-10">PRESENCE INDEX</p>
                        <span className="text-[72px] font-black text-white leading-none relative z-10 mt-1">94</span>
                        <span className="text-[12px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mt-3 relative z-10">EXCELLENT</span>
                      </div>
                      <div className="md:col-span-8 bg-[#FAF9F6] border border-gray-150 rounded-[18px] p-5 space-y-3">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">REQUIRED CHECKS</p>
                        {checklist.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => toggleCheck(idx)}
                            className="w-full flex items-center space-x-3 text-[14px] font-medium text-gray-700 text-left p-2 rounded-[8px] hover:bg-white transition-all"
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border-2 ${item.checked ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                              {item.checked ? '✓' : ''}
                            </span>
                            <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/15 rounded-[14px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-950">Unlock real-time coaching</h4>
                        <p className="text-[13px] text-gray-500 mt-0.5">Track history, custom alerts, and live skin scanning overlay.</p>
                      </div>
                      <Link href="/signup">
                        <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] rounded-md transition-all shrink-0">
                          Create Free Account →
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Nav Controls */}
              <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-8">
                <button
                  onClick={goBack}
                  disabled={step === 'context'}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-[14px] rounded-[8px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <div className="flex space-x-1.5">
                  {steps.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === currentIdx ? 'w-6 bg-primary' : i < currentIdx ? 'w-3 bg-primary/40' : 'w-3 bg-gray-200'}`} />
                  ))}
                </div>
                {step !== 'result' ? (
                  <Button onClick={goNext} className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] rounded-[8px] transition-all">
                    Continue →
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button className="h-11 px-6 bg-gray-950 hover:bg-gray-800 text-white font-bold text-[14px] rounded-[8px] transition-all">
                      Register Free →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
