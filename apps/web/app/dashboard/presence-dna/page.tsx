'use client';

import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Shirt, 
  Lightbulb, 
  Target 
} from 'lucide-react';

export default function PresenceDNAAnalysisPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <h1 className="text-[32px] sm:text-[38px] font-bold text-gray-950 font-sans leading-tight">
          Personal Archive
        </h1>
        <p className="text-[13.5px] text-gray-500 font-normal">
          A comprehensive view of your long-term Presence Journey and professional development.
        </p>
      </div>

      {/* Top 4 Metrics Cards Grid (Matching Screenshots 3 & 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Avg Presence Index */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              @ AVG. PRESENCE INDEX
            </span>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              All Time
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <span className="text-[44px] font-extrabold text-red-600 font-sans leading-none">
                84.2
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1 pt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>+2.4 since last quarter</span>
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
              128
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
              92%
            </span>
            <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 w-[92%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Top Style */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-4 shadow-xs flex items-center space-x-3">
          <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <img
              src="/images/brown-peaked-lapel-suit.jpg"
              alt="Minimalist Corporate"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-wider flex items-center space-x-1">
              <Shirt className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>TOP STYLE</span>
            </span>
            <h3 className="text-[14px] font-bold text-gray-950 font-sans">
              Minimalist Corporate
            </h3>
            <p className="text-[10.5px] text-gray-500 font-normal leading-tight">
              Correlates with +4% higher authority scoring in recorded meetings.
            </p>
          </div>
        </div>

      </div>

      {/* Section 2: Trajectory Chart Card */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-gray-950 font-sans">
            Trajectory
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

      {/* Section 3: Milestones Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-gray-950 font-sans">
            Milestones
          </h2>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
            ACHIEVEMENTS
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

      {/* Section 4: Confidence Trends */}
      <div className="space-y-3 pt-2">
        <h2 className="text-[22px] font-bold text-gray-950 font-sans">Confidence Trends</h2>
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
                <div className="h-full bg-primary rounded-full" style={{ width: `${item.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Goals */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-gray-950 font-sans">Goals</h2>
          <button className="text-[12px] font-mono font-bold text-primary hover:underline">+ Add Goal</button>
        </div>
        <div className="space-y-3">
          {[
            { goal: 'Reach Presence Index™ 95', progress: 89, target: 95, deadline: 'Sep 30' },
            { goal: 'Complete 5 executive presentations', progress: 3, target: 5, deadline: 'Q4 2024' },
            { goal: 'Achieve consistent vocal clarity >90%', progress: 92, target: 90, deadline: 'Ongoing', done: true },
          ].map((g, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-gray-950">{g.goal}</span>
                <div className="flex items-center space-x-2">
                  {g.done && <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">✓ ACHIEVED</span>}
                  <span className="text-[11px] font-mono text-gray-400">Due {g.deadline}</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${g.done ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${Math.min((g.progress / g.target) * 100, 100)}%` }} />
              </div>
              <span className="text-[11.5px] font-mono text-gray-400">{g.progress} / {g.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Analytics */}
      <div className="space-y-3 pt-2">
        <h2 className="text-[22px] font-bold text-gray-950 font-sans">Analytics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Journeys', value: '128' },
            { label: 'Avg Session Time', value: '14m' },
            { label: 'Plans Exported', value: '34' },
            { label: 'Outfits Saved', value: '22' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-xs text-center">
              <div className="text-[30px] font-extrabold font-sans text-gray-950 leading-none">{stat.value}</div>
              <div className="text-[11px] font-mono text-gray-400 mt-1.5 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
