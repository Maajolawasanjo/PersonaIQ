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
            image: p.selected_outfit_url || '/images/brown-peaked-lapel-suit.jpg',
            tag: p.vibe_category || 'EXECUTIVE',
            score: `${p.overall_presence_score || 88}% PRESENCE INDEX`,
            title: p.title || 'Executive Session Strategy',
            description: p.executive_summary || 'Custom presence plan optimized for executive decision making.',
            requiredItems: p.checklist ? p.checklist.map((c: any) => ({ name: c.task, checked: c.is_completed })) : [
              { name: 'Tailored Blazer / Suit', checked: true },
              { name: 'High-contrast Crisp Shirt', checked: true },
            ],
          }));
          setPlans(mapped);
        } else {
          // Fallback to overview recent plans if available
          const overview = await dashboardApi.getOverview();
          if (overview?.recent_plans && overview.recent_plans.length > 0) {
            const mapped = overview.recent_plans.map((p: any) => ({
              id: p.id,
              image: '/images/brown-peaked-lapel-suit.jpg',
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

      {/* 2. Three Card Grid */}
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
    </div>
  );
}
