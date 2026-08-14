'use client';

import React from 'react';
import Link from 'next/link';
import { plansApi, dashboardApi } from '@/lib/api/services';

export default function SavedPlansPage() {
  const [plans, setPlans] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadPlans() {
      try {
        const res = await plansApi.listPlans();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p: any) => ({
            id: p.id,
            image: p.selected_outfit_url || p.outfit_image || '/vto/clothing/professional/01_navy_suit.jpg',
            tag: p.vibe_category || 'EXECUTIVE',
            score: `${p.overall_presence_score || p.presence_score || 88}% PRESENCE INDEX`,
            title: p.title || 'Executive Session Strategy',
            description: p.executive_summary || 'Custom presence plan optimized for executive decision making.',
            requiredItems: p.checklist ? p.checklist.map((c: any) => ({ name: c.task, checked: c.is_completed })) : [
              { name: 'Tailored Blazer / Suit', checked: true },
              { name: 'High-contrast Crisp Shirt', checked: true },
            ],
          }));
          setPlans(mapped);
        } else {
          // Check locally saved journeys if server returns empty
          let localSaved: any[] = [];
          if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('personaiq_saved_journeys');
            if (raw) {
              try { localSaved = JSON.parse(raw); } catch (e) {}
            }
          }

          if (localSaved.length > 0) {
            const mapped = localSaved.map((j: any) => ({
              id: j.id,
              image: j.outfit_image || '/vto/clothing/professional/01_navy_suit.jpg',
              tag: j.occasion ? j.occasion.toUpperCase() : 'STRATEGY',
              score: `${j.presence_score || 92}% PRESENCE INDEX`,
              title: j.title || `${j.outfit_name || 'Executive'} Plan`,
              description: `Analyzed for ${j.dress_code || 'Business Formal'} attire with ${j.target_vibe || 'Confident'} tone.`,
              requiredItems: [
                { name: `${j.outfit_name || 'Tailored Suit'}`, checked: true },
                { name: 'High-contrast Crisp Shirt', checked: true },
              ],
            }));
            setPlans(mapped);
          } else {
            // Fallback to overview recent plans if available
            const overview = await dashboardApi.getOverview().catch(() => null);
            if (overview?.recent_plans && overview.recent_plans.length > 0) {
              const mapped = overview.recent_plans.map((p: any) => ({
                id: p.id,
                image: p.outfit_image || '/vto/clothing/professional/01_navy_suit.jpg',
                tag: 'STRATEGY',
                score: `${p.overall_presence_score || 85}% PRESENCE INDEX`,
                title: p.executive_summary ? p.executive_summary.substring(0, 30) + '...' : 'Presence Session',
                description: p.vibe_analysis || 'AI-generated presence alignment strategy.',
                requiredItems: [
                  { name: 'Posture alignment review', checked: true },
                  { name: 'Color contrast check', checked: true },
                ],
              }));
              setPlans(mapped);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load presence plans from API:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-[34px] sm:text-[40px] font-bold tracking-tight text-gray-950 font-sans">
          Saved Journeys
        </h1>
        <p className="text-[15px] text-gray-600 font-medium max-w-2xl">
          Your curated presence strategies and analytical recommendations. Review and refine your professional presentation.
        </p>
      </div>

      {/* 2. Content Grid or Empty State */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-12 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[13.5px] font-mono text-gray-500 font-medium">Loading your saved presence strategies...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-[28px] p-8 sm:p-12 shadow-xs text-center space-y-8 animate-fadeIn">
          
          {/* Top Badge Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 border border-primary/20 text-primary mx-auto flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <h2 className="text-[26px] font-bold text-gray-950 font-sans">
              No Saved Journeys Yet
            </h2>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              Your executive presence strategies, skin analysis reports, and AI outfit recommendations will automatically be archived here once you complete an analysis.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/journey/start"
              className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/95 text-white font-bold text-[13.5px] rounded-[12px] shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Start First Presence Journey</span>
              <span>→</span>
            </Link>
            <Link
              href="/wardrobe/style-me"
              className="w-full sm:w-auto h-12 px-7 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-bold text-[13.5px] rounded-[12px] transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch AI Stylist & VTO</span>
            </Link>
          </div>

          {/* Feature Preview Cards */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            <div className="bg-gray-50/70 border border-gray-200/70 rounded-[16px] p-4 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider block">
                01. PRESENCE STRATEGY
              </span>
              <p className="text-[12.5px] text-gray-700 font-normal leading-relaxed">
                Stores your calculated Presence Index, executive posture feedback, and event objectives.
              </p>
            </div>
            <div className="bg-gray-50/70 border border-gray-200/70 rounded-[16px] p-4 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider block">
                02. SKIN DIAGNOSTICS
              </span>
              <p className="text-[12.5px] text-gray-700 font-normal leading-relaxed">
                Archives your skin hydration levels, facial fatigue markers, and undertone recommendations.
              </p>
            </div>
            <div className="bg-gray-50/70 border border-gray-200/70 rounded-[16px] p-4 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider block">
                03. VTO OUTFITS
              </span>
              <p className="text-[12.5px] text-gray-700 font-normal leading-relaxed">
                Saves high-scoring outfit combinations rendered live in the Virtual Fitting Room.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner + Red Bookmark Badge */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-primary">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  {/* Tag & Score */}
                  <div className="flex items-center space-x-2 text-[11px] font-mono">
                    <span className="font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-[5px]">
                      {plan.tag}
                    </span>
                    <span className="font-extrabold text-primary">
                      {plan.score}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-bold text-gray-950 font-sans leading-tight">
                    {plan.title}
                  </h3>
                  <p className="text-[13px] text-gray-600 font-normal leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>

                  {/* Required Items Box */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-[12px] p-3.5 space-y-2 mt-4">
                    <span className="text-[10px] font-mono font-extrabold text-gray-700 tracking-wider uppercase block">
                      ⇆ REQUIRED ITEMS
                    </span>
                    <div className="space-y-1.5 text-[12px]">
                      {plan.requiredItems.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          {item.checked ? (
                            <div className="w-4 h-4 rounded-full bg-red-50 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                              ✓
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                          )}
                          <span className={item.checked ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
