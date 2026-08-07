'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { userApi } from '@/lib/api/services';

export default function NotificationPreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      try {
        setLoading(true);
        const profile = await userApi.getProfile();
        if (profile?.preference) {
          setEmailNotifications(profile.preference.email_notifications);
        }
      } catch (err: any) {
        console.error('Failed to load user notification preferences:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);
    try {
      await userApi.updatePreferences({
        email_notifications: emailNotifications,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save notification preferences:', err);
      setErrorMessage(err?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <Link href="/dashboard/settings" className="text-[12px] font-mono text-gray-500 hover:text-gray-900 block mb-1">
          ← Settings
        </Link>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Notifications
        </h1>
        <p className="text-[13.5px] text-gray-600 font-normal leading-relaxed">
          Manage how PersonaIQ communicates with you regarding your Presence Journey.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 text-[13px] rounded-[12px] font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-6">
        
        {/* CHANNELS */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            NOTIFICATION CHANNELS
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Email Notifications</h3>
                <p className="text-[12px] text-gray-500 font-normal">Receive updates, reports, and transactional alerts directly to your inbox.</p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${emailNotifications ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${emailNotifications ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <span>{saved ? 'Saved to DB!' : saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>

    </div>
  );
}
