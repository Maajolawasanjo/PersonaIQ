'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetEvent, setTargetEvent] = useState('boardroom');
  const [selectedFocus, setSelectedFocus] = useState<string[]>(['composure', 'dresscode']);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisioningStatus, setProvisioningStatus] = useState('Initializing Defensive Privacy Guard...');

  // Step 4 Provisioning Simulation
  useEffect(() => {
    if (currentStep === 4) {
      setProvisionProgress(0);
      const interval = setInterval(() => {
        setProvisionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(5), 500);
            return 100;
          }
          const next = prev + 5;
          if (next === 25) setProvisioningStatus('Sandboxing local camera & image pipeline...');
          if (next === 55) setProvisioningStatus('Calibrating Presence Index™ algorithm...');
          if (next === 85) setProvisioningStatus('Finalizing executive telemetry workspace...');
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const toggleFocus = (id: string) => {
    setSelectedFocus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-gray-950 text-white font-sans antialiased relative flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Background Geometric Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-pattern-geom opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/10 rounded-full blur-[140px] sm:blur-[180px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between relative z-10">
        <Link href="/" className="inline-flex items-center space-x-2.5 sm:space-x-3 group min-h-[44px]">
          <Image
            src="/icon.png"
            alt="PersonaIQ Logo"
            width={32}
            height={32}
            style={{ width: 32, height: 32 }}
            className="rounded-[6px] shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-bold tracking-tight text-[18px] sm:text-[22px] text-white">
            Persona<span className="text-primary">IQ</span>
          </span>
        </Link>

        {/* Progress Dots */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'w-6 sm:w-8 bg-primary'
                  : step < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {currentStep < 5 && (
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="text-[11px] sm:text-[13px] font-mono text-gray-400 hover:text-white transition-colors min-h-[44px] inline-flex items-center"
          >
            SKIP SETUP
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 my-auto">
        
        {/* STEP 1: WELCOME */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>EXECUTIVE PREPARATION</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-[32px] sm:text-[44px] md:text-[52px] font-extrabold tracking-tight leading-[1.1] text-white font-sans">
                Command your first impression.
              </h1>
              <p className="text-[15px] sm:text-[18px] text-gray-300 leading-relaxed max-w-xl font-normal">
                PersonaIQ evaluates your visual telemetry, posture, lighting, and wardrobe to ensure high-authority composure before key moments.
              </p>
            </div>

            <div className="pt-2 sm:pt-4 flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] sm:text-[15px] rounded-[12px] shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center space-x-3 active:scale-[0.99]"
              >
                <span>Initialize Workspace Setup</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTENT & TARGET EVENT */}
        {currentStep === 2 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] sm:text-[11px] font-mono text-primary font-bold uppercase tracking-widest">
                STEP 01 / 03
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[36px] font-extrabold tracking-tight text-white leading-tight">
                What key moment are you preparing for?
              </h2>
              <p className="text-[13.5px] sm:text-[15px] text-gray-400">
                Select your primary target event to calibrate the Presence Index™ algorithm.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'boardroom', title: 'C-Suite Boardroom', desc: 'Executive meetings, board presentations, organizational alignment.' },
                { id: 'keynote', title: 'Keynote & Conference', desc: 'Mainstage talks, industry summits, public speaking.' },
                { id: 'investor', title: 'Investor Pitch', desc: 'Venture funding, partner pitch, strategic capital.' },
                { id: 'media', title: 'Media & Broadcast', desc: 'Live interviews, podcasts, virtual broadcasts.' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTargetEvent(item.id)}
                  className={`p-4 sm:p-5 rounded-[14px] text-left border transition-all flex flex-col justify-between space-y-3 ${
                    targetEvent === item.id
                      ? 'bg-primary/10 border-primary text-white ring-2 ring-primary/20'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-[15px] sm:text-[16px] text-white">{item.title}</span>
                    {targetEvent === item.id && (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-primary"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </div>
                  <p className="text-[12.5px] sm:text-[13px] text-gray-400 leading-normal">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-[13px] sm:text-[14px] font-semibold text-gray-400 hover:text-white min-h-[44px] inline-flex items-center"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="h-11 sm:h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] rounded-[10px] flex items-center space-x-2"
              >
                <span>Continue</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FOCUS AREAS */}
        {currentStep === 3 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] sm:text-[11px] font-mono text-primary font-bold uppercase tracking-widest">
                STEP 02 / 03
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[36px] font-extrabold tracking-tight text-white leading-tight">
                Select your diagnostic focus areas.
              </h2>
              <p className="text-[13.5px] sm:text-[15px] text-gray-400">
                Choose the parameters you wish to analyze before your session.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'composure', title: 'Composure & Lighting Telemetry', desc: 'Evaluates facial lighting ratio, camera angle, and posture alignment.' },
                { id: 'dresscode', title: 'Boardroom Dress Code Engine', desc: 'Matches wardrobe profile against target organizational standards.' },
                { id: 'skin', title: 'Skin Vitality & Hydration Scan', desc: 'Analyzes visual energy, hydration cues, and frame clarity.' },
                { id: 'tryon', title: 'Virtual Try-On & Look Comparison', desc: 'Side-by-side comparison of outfits before going live.' },
              ].map((item) => {
                const isSelected = selectedFocus.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFocus(item.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-[12px] text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="font-bold text-[14px] sm:text-[15px] text-white block">{item.title}</span>
                      <span className="text-[12px] sm:text-[13px] text-gray-400 block">{item.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-3 sm:ml-4 ${
                      isSelected ? 'bg-primary border-primary text-white' : 'border-white/30'
                    }`}>
                      {isSelected && (
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-[13px] sm:text-[14px] font-semibold text-gray-400 hover:text-white min-h-[44px] inline-flex items-center"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                disabled={selectedFocus.length === 0}
                className="h-11 sm:h-12 px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-[14px] rounded-[10px] flex items-center space-x-2"
              >
                <span>Provision Workspace</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROVISIONING ANIMATION */}
        {currentStep === 4 && (
          <div className="space-y-6 sm:space-y-8 text-center py-8 sm:py-12 animate-fadeIn">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/10 border border-primary/30 text-primary mx-auto flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-md mx-auto">
              <span className="text-[10px] sm:text-[11px] font-mono text-primary font-bold uppercase tracking-widest">
                PROVISIONING TELEMETRY WORKSPACE
              </span>
              <h2 className="text-[22px] sm:text-[28px] font-bold text-white">
                Calibrating Your Executive Profile...
              </h2>
              <p className="text-[12.5px] sm:text-[14px] font-mono text-gray-400 h-6">
                {provisioningStatus}
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-150"
                style={{ width: `${provisionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 5: ONBOARDING COMPLETE */}
        {currentStep === 5 && (
          <div className="space-y-6 sm:space-y-8 text-center py-6 animate-fadeIn">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-lg mx-auto">
              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                PROVISIONING COMPLETE
              </span>
              <h2 className="text-[28px] sm:text-[38px] font-extrabold text-white leading-tight">
                Your workspace is ready.
              </h2>
              <p className="text-[14px] sm:text-[16px] text-gray-300 leading-relaxed">
                PersonaIQ is initialized. You can now launch your first Presence Journey or explore your executive dashboard.
              </p>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                href="/journey/start"
                className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-bold text-[14px] sm:text-[15px] rounded-[10px] shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Start Presence Journey</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-12 sm:h-13 px-6 bg-white/10 hover:bg-white/15 text-white font-bold text-[14px] sm:text-[15px] rounded-[10px] flex items-center justify-center"
              >
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        )}

      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-[12px] font-mono text-gray-500 gap-2 relative z-10">
        <span className="flex items-center space-x-1">
          <Lock className="w-3.5 h-3.5 text-gray-500" />
          <span>Zero Data Retention Active</span>
        </span>
        <span>PersonaIQ Executive Engine v1.0</span>
      </footer>
    </div>
  );
}
