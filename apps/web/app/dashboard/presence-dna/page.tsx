'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Shirt, 
  Lightbulb, 
  Target,
  Award,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { presenceDnaApi } from '@/lib/api/services';

export default function PresenceDNAAnalysisPage() {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [dnaData, setDnaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const tabs = ['Overview', 'Progress', 'Growth Timeline', 'Achievements', 'Insights', 'Goals'];

  React.useEffect(() => {
    async function loadDna() {
      try {
        const data = await presenceDnaApi.getDna();
        setDnaData(data);
      } catch (e) {
        console.error('Failed to load Presence DNA:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDna();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header & Sub-Tabs */}
      <div className="space-y-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-red-650 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 uppercase">
              PRESENCE DNA™ ANALYTICS
            </span>
          </div>
          <h1 className="text-[32px] sm:text-[38px] font-bold text-gray-950 font-sans leading-tight">
            Personal Archive & Growth Model
          </h1>
          <p className="text-[13.5px] text-gray-500 font-normal">
            A unified view of your longitudinal presence index, vocal confidence, and wardrobe heuristics.
          </p>
        </div>

        {/* Priority 6 Sub-Tabbed Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-[10px] text-[12.5px] font-mono font-bold transition-all shrink-0 ${
                activeTab === t
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Avg Presence Index */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              AVG. PRESENCE INDEX
            </span>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              All Time
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <span className="text-[44px] font-extrabold text-red-600 font-sans leading-none">
                {dnaData?.avg_presence_index ? dnaData.avg_presence_index.toFixed(1) : '--'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1 pt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{dnaData?.avg_presence_index > 0 ? '+2.4 since baseline' : 'Baseline calculated'}</span>
            </span>
          </div>
        </div>

        {/* Card 2: Journeys Completed */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
              <BarChart3 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>JOURNEYS COMPLETED</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[42px] font-extrabold text-gray-950 font-sans leading-none block">
              {dnaData?.total_journeys_completed ?? 0}
            </span>
            <span className="text-[11px] font-mono text-gray-500 block pt-1">
              Total recorded sessions
            </span>
          </div>
        </div>

        {/* Card 3: Vocal Confidence Base */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>VOCAL CONFIDENCE BASE</span>
          </span>

          <div className="space-y-2">
            <span className="text-[36px] font-extrabold text-gray-950 font-sans leading-none block">
              {dnaData?.vocal_confidence_base ? `${Math.round(dnaData.vocal_confidence_base)}%` : '--'}
            </span>
            <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900" style={{ width: `${dnaData?.vocal_confidence_base || 0}%` }} />
            </div>
          </div>
        </div>

        {/* Card 4: Top Style */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-xs flex items-center space-x-3">
          <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <img
              src="/images/brown-peaked-lapel-suit.jpg"
              alt={dnaData?.top_style || 'Executive Baseline'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-wider flex items-center space-x-1">
              <Shirt className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>TOP STYLE</span>
            </span>
            <h3 className="text-[14px] font-bold text-gray-950 font-sans">
              {dnaData?.top_style || 'Not Established'}
            </h3>
            <p className="text-[10.5px] text-gray-500 font-normal leading-tight">
              Correlates with +4% higher authority scoring in recorded meetings.
            </p>
          </div>
        </div>

      </div>

      {/* Conditional Content based on activeTab */}
      {(activeTab === 'Overview' || activeTab === 'Progress' || activeTab === 'Growth Timeline') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-gray-950 font-sans">
              Presence Growth & Trajectory
            </h2>
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
              YTD ANALYSIS
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-6">
            <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
              ANALYSIS
            </span>

            {/* Bar Chart Simulation */}
            <div className="h-44 flex items-end justify-around border-b border-gray-200 pb-3 px-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-gray-200 rounded-t h-[40%]" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">JAN</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-gray-200 rounded-t h-[45%]" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">FEB</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-gray-200 rounded-t h-[52%]" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">MAR</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-gray-200 rounded-t h-[58%]" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">APR</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-gray-200 rounded-t h-[58%]" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">MAY</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 bg-red-600 rounded-t h-[82%]" />
                <span className="text-[10px] font-mono font-bold text-gray-900 uppercase">JUN</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'Overview' || activeTab === 'Achievements') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-gray-950 font-sans">
              Achievements
            </h2>
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
              MILESTONES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50/70 border border-gray-200 rounded-[18px] p-5 flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                <Lightbulb className="w-4 h-4 text-blue-650" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-gray-950 font-sans">
                  Consistent Clarity
                </h3>
                <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
                  Maintained &gt;85% enunciation clarity across 10 consecutive high-stakes presentations.
                </p>
              </div>
            </div>

            <div className="bg-gray-50/70 border border-gray-200 rounded-[18px] p-5 flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">
                <Target className="w-4 h-4 text-red-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-gray-950 font-sans">
                  Global Resonance
                </h3>
                <p className="text-[12.5px] text-gray-600 font-normal leading-relaxed">
                  Adapted pacing successfully for international cross-functional team alignment sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'Overview' || activeTab === 'Insights') && (
        <div className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-gray-950 font-sans">Confidence Trends & Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Vocal Confidence', value: '92%', delta: '+3%', bar: 92 },
              { label: 'Visual Authority', value: '87%', delta: '+5%', bar: 87 },
              { label: 'Executive Presence', value: '89%', delta: '+2%', bar: 89 },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-gray-200 rounded-[18px] p-5 shadow-xs space-y-3">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">{item.label}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-[34px] font-extrabold font-sans text-gray-950 leading-none">{item.value}</span>
                  <span className="text-[12px] font-mono font-bold text-green-600">{item.delta}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: `${item.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'Overview' || activeTab === 'Goals') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-gray-950 font-sans font-medium">Goals</h2>
            <button className="text-[12px] font-mono font-bold text-red-600 hover:underline">+ Add Goal</button>
          </div>
          <div className="space-y-3">
            {[
              { goal: 'Reach Presence Index™ 95', progress: 89, target: 95, deadline: 'Sep 30' },
              { goal: 'Complete 5 executive presentations', progress: 3, target: 5, deadline: 'Q4 2026' },
              { goal: 'Achieve consistent vocal clarity >90%', progress: 92, target: 90, deadline: 'Ongoing', done: true },
            ].map((g, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14.5px] font-bold text-gray-950">{g.goal}</span>
                  <div className="flex items-center space-x-2">
                    {g.done && <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">ACHIEVED</span>}
                    <span className="text-[11px] font-mono text-gray-400">Due {g.deadline}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${g.done ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${Math.min((g.progress / g.target) * 100, 100)}%` }} />
                </div>
                <span className="text-[11.5px] font-mono text-gray-400">{g.progress} / {g.target}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
