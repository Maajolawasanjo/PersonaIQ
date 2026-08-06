'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  BarChart3, 
  Eye, 
  History, 
  Info, 
  Search, 
  Sliders, 
  Shirt,
  ArrowRight
} from 'lucide-react';

export default function JourneyArchivePage() {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isEmptyArchive, setIsEmptyArchive] = useState<boolean>(false);

  const journeys = [
    {
      id: 'j1',
      date: 'OCT 24, 2023',
      title: 'Venture Capital Pitch',
      target: 'Tech Investors',
      score: 94,
      isLatest: true,
      outfitName: 'Navy Unstructured Blazer & Grey Trousers',
      outfitDesc: 'AI noted this combination projected authoritative calm without appearing overly rigid, perfect for...',
      image: '/images/brown-peaked-lapel-suit.jpg',
      category: 'Interview',
      archived: false,
    },
    {
      id: 'j2',
      date: 'SEP 12, 2023',
      title: 'Series B Board Meeting',
      target: 'Existing Board',
      score: 88,
      isLatest: false,
      outfitName: 'Charcoal Suit & Blue Oxford',
      outfitDesc: 'A conservative but sharp choice. The system suggested loosening the tie slightly for a more...',
      image: '/images/african-senator-suit.jpg',
      category: 'Presentation',
      archived: false,
    },
    {
      id: 'j3',
      date: 'AUG 05, 2023',
      title: 'Academic Symposium Keynote',
      target: 'Peers & Researchers',
      score: 91,
      isLatest: false,
      outfitName: '',
      outfitDesc: '',
      image: '',
      category: 'Networking',
      archived: true,
    },
  ];

  const categories = ['All', 'Interview', 'Presentation', 'Networking'];

  const filtered = journeys.filter((j) => {
    const matchesFilter = filter === 'All' || j.category === filter;
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.target.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header & State Toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
            Journey Archive
          </h1>
          <p className="text-[13.5px] text-gray-500 font-normal">
            A chronological record of your simulated presence evaluations and outfit analyses.
          </p>
        </div>

        {/* Toggle Empty vs Populated State */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-2">
          <Link
            href="/journey/compare"
            className="h-9 px-4 bg-gray-950 hover:bg-gray-800 text-white font-bold text-[12px] rounded-[8px] flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare Reports</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsEmptyArchive(!isEmptyArchive)}
            className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-250 px-3 py-1 rounded-full shrink-0 flex items-center space-x-1"
          >
            {isEmptyArchive ? (
              <>
                <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                <span>Show Populated Archive</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span>Show Empty History State</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EMPTY ARCHIVE STATE */}
      {isEmptyArchive ? (
        <div className="bg-white border border-gray-200 rounded-[24px] p-10 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px] shadow-xs">
          
          {/* Centered Node Icon Graphic */}
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
            <ArrowLeftRight className="w-8 h-8 text-gray-400" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 max-w-md">
            <h2 className="text-[32px] font-bold text-gray-950 font-sans leading-tight">
              No Journey History
            </h2>
            <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
              Your archive is currently empty. The Presence Journey records your analytical pathways and cognitive models over time. Begin a new analysis to establish your baseline.
            </p>
          </div>

          {/* Primary CTA */}
          <Link
            href="/journey/start"
            className="h-11 px-7 bg-red-600 hover:bg-red-700 text-white font-bold text-[13.5px] rounded-[10px] shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <span>Create Your First Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Information Card: About The Archive */}
          <div className="bg-gray-50/80 border border-gray-150 rounded-[16px] p-5 text-left max-w-lg w-full space-y-1.5 mt-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-gray-550" />
              <span>ABOUT THE ARCHIVE</span>
            </span>
            <p className="text-[12px] text-gray-600 font-normal leading-relaxed">
              Historical data enables longitudinal tracking of your intelligence models. Once generated, your journey maps will be securely stored here, allowing for comparative analysis against MIT-inspired heuristic benchmarks.
            </p>
          </div>

        </div>
      ) : (
        /* POPULATED ARCHIVE STATE */
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-[20px] p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events, themes, or dates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-250 rounded-[10px] text-[13px] text-gray-800 focus:outline-none focus:border-red-600 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-mono font-bold transition-all ${
                    filter === cat
                      ? 'bg-gray-950 text-white shadow-xs'
                      : 'bg-white border border-gray-250 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-[12px] font-mono font-bold bg-white border border-gray-250 text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Vertical Timeline List */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {filtered.map((j) => (
              <div key={j.id} className="relative group">
                <div
                  className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all ${
                    j.isLatest ? 'border-red-600 bg-red-600 ring-4 ring-red-100' : 'border-gray-400'
                  }`}
                />

                <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10.5px] font-mono text-gray-400 uppercase tracking-wider block">
                        {j.date}
                      </span>
                      <h3 className="text-[22px] font-bold text-gray-950 font-sans leading-tight">
                        {j.title}
                      </h3>
                      <p className="text-[12.5px] text-gray-500 font-mono">
                        Target Audience: <span className="text-gray-800 font-medium">{j.target}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[32px] font-extrabold text-gray-950 font-sans leading-none block">
                        {j.score}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                        PRESENCE INDEX
                      </span>
                    </div>
                  </div>

                  {!j.archived ? (
                    <div className="bg-gray-50/70 border border-gray-150 rounded-[16px] p-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                        <Shirt className="w-3.5 h-3.5 text-gray-500" />
                        <span>SELECTED OUTFIT</span>
                      </span>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                        <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={j.image} alt={j.outfitName} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-[14.5px] font-bold text-gray-950 font-sans">
                            {j.outfitName}
                          </h4>
                          <p className="text-[12px] text-gray-600 font-normal leading-relaxed">
                            {j.outfitDesc}
                          </p>
                          <Link
                            href={`/dashboard/history/${j.id}`}
                            className="text-[12px] font-mono font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1 pt-1"
                          >
                            <span>View Full Analysis</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50/70 border border-gray-150 rounded-[16px] p-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                        <History className="w-3.5 h-3.5 text-gray-500" />
                        <span>ARCHIVED DATA</span>
                      </span>
                      <p className="text-[12px] text-gray-500 font-normal italic">
                        Outfit imagery archived for privacy policy compliance (older than 90 days). Metric data retained.
                      </p>
                      <Link
                        href={`/dashboard/history/${j.id}`}
                        className="text-[12px] font-mono font-bold text-red-600 hover:text-red-700 inline-flex items-center space-x-1 pt-1"
                      >
                        <span>View Metric Summary</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              className="h-10 px-6 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[13px] rounded-[8px] border border-gray-300 transition-colors shadow-2xs"
            >
              Load Older Journeys
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
