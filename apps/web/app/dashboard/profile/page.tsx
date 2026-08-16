'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { userApi } from '@/lib/api/services';
import { UserProfile } from '@/lib/api/types';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Safe client-only localStorage read — avoids SSR hydration mismatch
    if (typeof window !== 'undefined') {
      setSelfiePreview(localStorage.getItem('personaiq_user_selfie_preview'));
    }

    async function loadProfile() {
      try {
        setLoading(true);
        const data = await userApi.getProfile();
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setOccupation(data.occupation || '');
        setCountry(data.country || '');
        setTimezone(data.timezone || 'UTC');
      } catch (err: any) {
        console.error('Failed to load user profile:', err);
        setStatusMessage({
          type: 'error',
          text: err?.message || "We couldn't connect to PersonaIQ. Please check your network connection.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const updated = await userApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        occupation,
        country,
        timezone,
      });
      setProfile(updated);
      setStatusMessage({ type: 'success', text: 'Your profile has been saved successfully.' });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'Loading User...';

  return (
    <div className="max-w-2xl mx-auto space-y-7 animate-fadeIn py-4">
      
      {/* Header with Back Arrow */}
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-950 font-bold transition-colors">
          ←
        </Link>
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-gray-950 font-sans">
          Profile Settings
        </h1>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-[12px] text-[13.5px] font-medium flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold uppercase tracking-wider opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Executive Hero Profile Card */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-xs flex items-center space-x-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-600/30 shrink-0 bg-red-650 text-white flex items-center justify-center font-mono font-bold text-2xl shadow-xs">
          {profile?.avatar_url || selfiePreview ? (
            <img
              src={profile?.avatar_url || selfiePreview!}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{((firstName[0] || '') + (lastName[0] || '' || email[0] || 'U')).toUpperCase()}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <h2 className="text-[24px] font-bold text-gray-950 font-sans leading-tight">
            {loading ? 'Loading...' : displayName}
          </h2>
          <p className="text-[13.5px] text-gray-600 font-medium">
            {occupation || 'PersonaIQ Member'}
          </p>
          <div className="inline-flex items-center space-x-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Authenticated Session</span>
          </div>
        </div>
      </div>

      {/* Personal Information Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 rounded-[20px] p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-950 font-sans">
            Personal Information
          </h3>
          <span className="text-xs font-mono font-semibold text-gray-400">
            Source: PostgreSQL DB
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                placeholder="Enter first name"
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                placeholder="Enter last name"
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              EMAIL ADDRESS (READ-ONLY)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-11 bg-gray-100 border border-gray-200 text-gray-500 rounded-[10px] px-4 text-[13.5px] font-mono font-medium outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
              OCCUPATION / TITLE
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              disabled={loading}
              placeholder="e.g. Executive Director, Product Lead"
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                COUNTRY
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
                placeholder="e.g. United States, United Kingdom"
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                TIMEZONE
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={loading}
                placeholder="UTC"
                className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <button
            type="submit"
            disabled={saving || loading}
            className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {saving && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
