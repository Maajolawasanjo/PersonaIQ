'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Shield, Heart, Sparkles, X, Activity, Eye, Volume2, Shirt } from 'lucide-react';
import { wardrobeApi } from '@/lib/api/services';

const OUTFIT_CATEGORIES = ['All', 'Favorites', 'Formal', 'Business Casual', 'Keynote', 'Boardroom', 'Casual'];

interface Outfit {
  id: string;
  name: string;
  category: string;
  score: number;
  events: number;
  lastWorn: string;
  tag: string | null;
  favorite: boolean;
  image: string;
  details: {
    authority: number;
    trustworthiness: number;
    composure: number;
    colorNotes: string;
    vocalNotes: string;
  };
}

const INITIAL_OUTFITS: Outfit[] = [
  {
    id: '1',
    name: 'Navy Executive Blazer & Trousers',
    category: 'Boardroom',
    score: 94,
    events: 3,
    lastWorn: '2 days ago',
    tag: 'Top Pick',
    favorite: true,
    image: '/images/brown-peaked-lapel-suit.jpg',
    details: {
      authority: 95,
      trustworthiness: 93,
      composure: 94,
      colorNotes: 'Deep Navy matches cool skin undertones, reinforcing stability and high-level decision authority.',
      vocalNotes: 'Tailored shoulder silhouette supports open diaphragmatic posture, aiding projection stability.',
    },
  },
  {
    id: '2',
    name: 'Charcoal Wool Double-Breasted Suit',
    category: 'Formal',
    score: 88,
    events: 5,
    lastWorn: '1 week ago',
    tag: 'Most Used',
    favorite: false,
    image: '/images/african-senator-suit.jpg',
    details: {
      authority: 92,
      trustworthiness: 84,
      composure: 88,
      colorNotes: 'Charcoal presents strong formal neutrality, ideal for major announcements and risk communication.',
      vocalNotes: 'Double-breasted configuration restricts thoracic expansion slightly; maintain deliberate pacing.',
    },
  },
  {
    id: '3',
    name: 'Burgundy Structured Keynote Blazer',
    category: 'Keynote',
    score: 91,
    events: 2,
    lastWorn: '3 weeks ago',
    tag: 'High Impact',
    favorite: true,
    image: '/images/brown-peaked-lapel-suit.jpg',
    details: {
      authority: 89,
      trustworthiness: 92,
      composure: 92,
      colorNotes: 'Deep burgundy creates warm visual contrast under stage lighting, boosting engagement and charisma.',
      vocalNotes: 'Unbuttoned design facilitates full breathing flexibility for prolonged projection.',
    },
  },
  {
    id: '4',
    name: 'Slate Soft Business Ensemble',
    category: 'Business Casual',
    score: 82,
    events: 4,
    lastWorn: '4 days ago',
    tag: null,
    favorite: false,
    image: '/images/african-senator-suit.jpg',
    details: {
      authority: 80,
      trustworthiness: 85,
      composure: 81,
      colorNotes: 'Slate grey offers approachable professionalism, facilitating team-wide collaborative discussions.',
      vocalNotes: 'Relaxed structure optimizes comfort, lowering systemic heart rate and performance anxiety.',
    },
  },
  {
    id: '5',
    name: 'Ivory Structured Silk Blouse',
    category: 'Business Casual',
    score: 79,
    events: 6,
    lastWorn: '2 weeks ago',
    tag: null,
    favorite: true,
    image: '/images/brown-peaked-lapel-suit.jpg',
    details: {
      authority: 76,
      trustworthiness: 82,
      composure: 79,
      colorNotes: 'Ivory maximizes high-frequency facial light reflection, improving webcam clarity and focus.',
      vocalNotes: 'Light fabrication offers zero torso restriction, facilitating natural speaking cadence.',
    },
  },
  {
    id: '6',
    name: 'Midnight Peak Lapel Tuxedo',
    category: 'Formal',
    score: 96,
    events: 1,
    lastWorn: '1 month ago',
    tag: 'Best Score',
    favorite: false,
    image: '/images/african-senator-suit.jpg',
    details: {
      authority: 98,
      trustworthiness: 94,
      composure: 96,
      colorNotes: 'Midnight black with silk lapels provides maximum high-contrast presence and authority.',
      vocalNotes: 'Formal waistcoat limits abdominal breathing; rely on diaphragmatic support and pause frequently.',
    },
  },
];

const AI_RECOMMENDATIONS = [
  {
    title: 'Earth Tone Presentation Pack',
    desc: 'Based on your upcoming Q4 Strategy Keynote on stage. Recommend adding olive or beige layers to bridge the digital and physical contrast.',
    match: '94% Match',
  },
  {
    title: 'High-Contrast Virtual Setup',
    desc: 'Based on low lighting in your default room. Recommend wearing ivory or white tops to maximize light projection to webcams.',
    match: '91% Match',
  },
];

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [outfits, setOutfits] = useState<Outfit[]>(INITIAL_OUTFITS);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    async function loadWardrobe() {
      try {
        const res = await wardrobeApi.getItems();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Outfit[] = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category || 'Business Casual',
            score: 88,
            events: item.wear_count || 1,
            lastWorn: 'Recently',
            tag: item.is_favorite ? 'Favorite' : null,
            favorite: item.is_favorite || false,
            image: item.photo_url || '/images/brown-peaked-lapel-suit.jpg',
            details: {
              authority: 90,
              trustworthiness: 88,
              composure: 89,
              colorNotes: `${item.color || 'Classic'} tone aligned with executive presence benchmarks.`,
              vocalNotes: 'Tailored shoulder silhouette supports open diaphragmatic posture.',
            },
          }));
          setOutfits(mapped);
        }
      } catch (err) {
        console.warn('Backend wardrobe items unresolvable, using defaults:', err);
      }
    }
    loadWardrobe();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOutfits(prev =>
      prev.map(o => (o.id === id ? { ...o, favorite: !o.favorite } : o))
    );
  };

  const filtered = outfits.filter((o) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Favorites') return o.favorite;
    return o.category === activeCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn w-full">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-105 pb-5">
        <div className="space-y-1">
          <h1 className="text-[30px] sm:text-[36px] font-bold tracking-tight text-gray-950 font-sans leading-tight">
            Wardrobe
          </h1>
          <p className="text-[14.5px] text-gray-500 font-normal">
            Your saved outfits, virtual try-ons, and AI-ranked looks.
          </p>
        </div>
        <Link
          href="/journey/choose-outfit"
          className="h-10 px-5 bg-primary hover:bg-primary/90 text-white font-bold text-[13px] rounded-[10px] flex items-center space-x-2 shadow-sm transition-all"
        >
          <span>+ Add Outfit</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Outfits', value: outfits.length },
          { label: 'Avg. Score', value: Math.round(outfits.reduce((acc, curr) => acc + curr.score, 0) / outfits.length) },
          { label: 'Favorites', value: outfits.filter(o => o.favorite).length },
          { label: 'Best Score', value: Math.max(...outfits.map(o => o.score)) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-2xs text-center">
            <div className="text-[32px] font-extrabold font-sans text-gray-950 leading-none">{stat.value}</div>
            <div className="text-[11.5px] font-mono text-gray-500 mt-1.5 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left Items List vs Right AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Outfits (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {OUTFIT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-gray-950 text-white border-gray-950 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Outfit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => setSelectedOutfit(outfit)}
                className="bg-white border border-gray-205 hover:border-gray-300 rounded-[20px] p-4.5 shadow-2xs hover:shadow-xs transition-all group flex flex-col space-y-4 cursor-pointer"
              >
                {/* Outfit Visual Placeholder */}
                <div className="w-full h-44 bg-gray-50 border border-gray-150 rounded-[12px] flex items-center justify-center relative overflow-hidden">
                  <Shirt className="w-12 h-12 text-gray-400" />
                  <button
                    onClick={(e) => toggleFavorite(outfit.id, e)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs hover:scale-105 transition-all text-gray-400 hover:text-red-500"
                  >
                    <Heart className={`w-4.5 h-4.5 ${outfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  {outfit.tag && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary text-white border border-primary/20 shadow-xs">
                      {outfit.tag}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14.5px] font-bold text-gray-950 leading-snug group-hover:text-primary transition-colors">{outfit.name}</h3>
                    <span className="text-[22px] font-extrabold font-sans text-gray-950 leading-none shrink-0">
                      {outfit.score}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10.5px] font-mono text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                      {outfit.category}
                    </span>
                    <span className="text-[11px] text-gray-400">• {outfit.lastWorn}</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center space-x-2 pt-2.5 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href="/journey/virtual-try-on"
                    className="flex-1 h-9 bg-gray-950 hover:bg-gray-800 text-white text-[12px] font-bold rounded-[8px] flex items-center justify-center transition-colors"
                  >
                    Try On
                  </Link>
                  <Link
                    href="/journey/choose-outfit"
                    className="flex-1 h-9 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 text-[12px] font-bold rounded-[8px] flex items-center justify-center transition-colors"
                  >
                    Use in Journey
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-[24px] p-12 text-center flex flex-col items-center space-y-4">
              <Shirt className="w-16 h-16 text-gray-400" />
              <h3 className="text-[20px] font-bold text-gray-950 font-sans">No outfits in this category</h3>
              <p className="text-[14px] text-gray-500 max-w-xs">
                Start a Presence Journey to save outfits and build your wardrobe.
              </p>
              <Link
                href="/journey/start"
                className="h-10 px-6 bg-primary text-white font-bold text-[13px] rounded-[10px] flex items-center justify-center shadow-sm hover:bg-primary/90 transition-all"
              >
                Start New Analysis
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: AI Recommendations & Insights (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Recommendations Panel */}
          <div className="bg-white border border-gray-200 rounded-[22px] p-5.5 shadow-2xs space-y-4">
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>AI RECOMMENDATIONS</span>
            </span>

            <div className="space-y-4">
              {AI_RECOMMENDATIONS.map((rec, i) => (
                <div key={i} className="p-4 rounded-[14px] border border-gray-150 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-gray-950 font-sans">{rec.title}</span>
                    <span className="text-[10px] font-mono font-bold text-red-650 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{rec.match}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gray-950 text-white rounded-[22px] p-5.5 shadow-xs border border-white/10 space-y-3">
            <span className="text-[10px] font-mono font-bold text-primary block">❖ STYLE INSIGHT</span>
            <p className="text-[13px] text-gray-300 leading-relaxed font-normal">
              Wearing outfits featuring structured navy elements yields a statistical +5% elevation in visual authority scores compared to lighter neutral palettes.
            </p>
          </div>
        </div>

      </div>

      {/* Outfit Details Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[26px] border border-gray-200 max-w-xl w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="space-y-1">
                <span className="text-[10.5px] font-mono font-bold text-gray-400 uppercase tracking-widest block">{selectedOutfit.category}</span>
                <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-950 font-sans leading-tight">{selectedOutfit.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-[32px] font-extrabold font-sans text-gray-950 block leading-none">{selectedOutfit.score}</span>
                <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-widest block">PRESENCE SCORE</span>
              </div>
            </div>

            {/* Visual Image */}
            <div className="w-full h-56 bg-gray-50 border border-gray-200 rounded-[16px] flex items-center justify-center relative overflow-hidden">
              <Shirt className="w-16 h-16 text-gray-400" />
              <button
                onClick={(e) => toggleFavorite(selectedOutfit.id, e)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs hover:scale-105 transition-all text-gray-400 hover:text-red-500"
              >
                <Heart className={`w-5 h-5 ${selectedOutfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Presence Score Details */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[15px] font-bold text-gray-950 font-sans">AI Presence Heuristics</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Authority', score: selectedOutfit.details.authority },
                  { label: 'Trustworthiness', score: selectedOutfit.details.trustworthiness },
                  { label: 'Composure', score: selectedOutfit.details.composure },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-gray-50 border border-gray-150 rounded-[12px] text-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">{item.label}</span>
                    <span className="text-[20px] font-extrabold font-sans text-gray-950 block mt-0.5">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Explanations */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[12px] font-mono font-bold text-gray-400 uppercase block">COLOR & CONTRAST FIT</span>
                  <p className="text-[12.5px] text-gray-650 leading-relaxed font-normal">{selectedOutfit.details.colorNotes}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[12px] font-mono font-bold text-gray-400 uppercase block">VOCAL PROJECTION ALIGNMENT</span>
                  <p className="text-[12.5px] text-gray-650 leading-relaxed font-normal">{selectedOutfit.details.vocalNotes}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-150">
              <Link
                href="/journey/virtual-try-on"
                className="flex-1 h-11 bg-gray-950 hover:bg-gray-900 text-white text-[13px] font-bold rounded-[10px] flex items-center justify-center transition-colors"
              >
                Virtual Try-On
              </Link>
              <Link
                href="/journey/choose-outfit"
                className="flex-1 h-11 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-[13px] font-bold rounded-[10px] flex items-center justify-center transition-colors border"
              >
                Use in Current Journey
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
