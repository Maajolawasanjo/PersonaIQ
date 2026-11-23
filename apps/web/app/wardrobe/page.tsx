'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Plus, Search, Shirt, Sparkles, X, AlertCircle } from 'lucide-react';
import { wardrobeApi } from '@/lib/api/services';
import type { WardrobeItem } from '@/lib/api/types';

const CATEGORY_CHOICES = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Footwear', 'Accessories', 'Traditional', 'Other'];

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tops');
  const [color, setColor] = useState('');
  const [formality, setFormality] = useState('Casual');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await wardrobeApi.listItems();
        if (active) setItems(result);
      } catch {
        if (active) setError('Your wardrobe could not be loaded. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ['All', 'Favorites', ...new Set(items.map(item => item.category).filter(Boolean))], [items]);
  const visible = useMemo(() => items.filter(item => {
    const matchesFilter = filter === 'All' || (filter === 'Favorites' ? item.is_favorite : item.category === filter);
    const matchesSearch = [item.name, item.color ?? '', item.category].join(' ').toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }), [items, filter, query]);

  const setFavorite = async (item: WardrobeItem) => {
    if (pendingFavorite) return;
    setError(null);
    setPendingFavorite(item.id);
    try {
      const saved = await wardrobeApi.setFavorite(item.id, !item.is_favorite);
      setItems(previous => previous.map(existing => existing.id === item.id ? saved : existing));
    } catch {
      setError('The favorite change could not be saved. Please try again.');
    } finally {
      setPendingFavorite(null);
    }
  };

  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !name.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const item = await wardrobeApi.createItem({
        name: name.trim(),
        category,
        color: color.trim() || undefined,
        formality,
      });
      setItems(previous => [item, ...previous]);
      setName('');
      setColor('');
      setShowCreate(false);
      setFilter('All');
      setQuery('');
    } catch {
      setError('Your clothing item could not be added. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-7 py-2">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">PERSONAIQ Wardrobe</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">My Wardrobe</h1>
          <p className="mt-2 text-sm text-gray-600">Organize the clothing you own and prepare outfits for your next event.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/wardrobe/style-me" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800">
            <Sparkles className="h-4 w-4 text-red-700" /> AI Stylist
          </Link>
          <button type="button" onClick={() => setShowCreate(current => !current)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
            {showCreate ? <X className="h-4 w-4"/> : <Plus className="h-4 w-4"/>}
            {showCreate ? 'Close form' : 'Add clothing'}
          </button>
        </div>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0"/>{error}
        </div>
      )}

      {showCreate && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-950">Add a wardrobe item</h2>
          <p className="mt-1 text-sm text-gray-600">Create a basic clothing record. Photo uploads will be available once private media storage is ready.</p>
          <form onSubmit={create} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Name
              <input required maxLength={255} value={name} onChange={event => setName(event.target.value)}
                placeholder="e.g. Navy blazer" className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900"/>
            </label>
            <label className="text-sm font-medium text-gray-700">Category
              <select value={category} onChange={event => setCategory(event.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900">
                {CATEGORY_CHOICES.map(choice => <option key={choice}>{choice}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">Color (optional)
              <input maxLength={50} value={color} onChange={event => setColor(event.target.value)}
                placeholder="e.g. Navy" className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900"/>
            </label>
            <label className="text-sm font-medium text-gray-700">Dress level
              <select value={formality} onChange={event => setFormality(event.target.value)}
                className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900">
                {['Casual','Smart Casual','Business Casual','Formal','Traditional'].map(choice => <option key={choice}>{choice}</option>)}
              </select>
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" disabled={saving || !name.trim()}
                className="min-h-11 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {saving ? 'Saving...' : 'Save to wardrobe'}
              </button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <div role="status" className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">Loading your clothing...</div>
      ) : items.length === 0 && !error ? (
        <section className="rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center">
          <Shirt className="mx-auto h-10 w-10 text-gray-400"/>
          <h2 className="mt-4 text-xl font-bold text-gray-950">Your wardrobe is empty</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">Add clothing you already own to build outfit combinations and access your collection when preparing for an event.</p>
          <button type="button" onClick={() => setShowCreate(true)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4"/> Add your first item
          </button>
        </section>
      ) : items.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your collection · {items.filter(item => item.is_favorite).length} favorites</p>
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-500"/>
              <span className="sr-only">Search wardrobe</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)}
                placeholder="Search items" className="w-44 bg-transparent text-sm text-gray-900 outline-none sm:w-64"/>
            </label>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Wardrobe filters">
            {categories.map(choice => <button key={choice} type="button" onClick={() => setFilter(choice)} aria-pressed={filter === choice}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${filter === choice ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700'}`}>
              {choice}
            </button>)}
          </div>
          {visible.length ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map(item => (
                <li key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex h-44 items-center justify-center bg-gray-50">
                    {item.photo_url ? <img src={item.photo_url} alt={item.name} loading="lazy" className="h-full w-full object-contain"/> : <Shirt className="h-12 w-12 text-gray-300" aria-hidden="true"/>}
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <h2 className="mt-1 text-base font-semibold text-gray-950">{item.name}</h2>
                      </div>
                      <button type="button" onClick={() => void setFavorite(item)} disabled={pendingFavorite === item.id}
                        aria-label={item.is_favorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
                        aria-pressed={item.is_favorite} className="rounded-full border border-gray-200 p-2 text-gray-600 disabled:opacity-50">
                        <Heart className={`h-4 w-4 ${item.is_favorite ? 'fill-red-600 text-red-600' : ''}`}/>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">{[item.color, item.formality].filter(Boolean).join(' · ') || 'No details added'}</p>
                    {item.wear_count > 0 && <p className="text-xs text-gray-500">Worn {item.wear_count} {item.wear_count === 1 ? 'time' : 'times'}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">No clothing matches your search or filter.</p>
          )}
        </>
      ) : null}

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-950 p-6 text-white">
        <div>
          <h2 className="text-lg font-semibold">Need help putting a look together?</h2>
          <p className="mt-1 text-sm text-gray-300">Explore styles for your next occasion.</p>
        </div>
        <Link href="/wardrobe/style-me" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-950">
          Open AI Stylist <ArrowRight className="h-4 w-4"/>
        </Link>
      </section>
    </main>
  );
}
