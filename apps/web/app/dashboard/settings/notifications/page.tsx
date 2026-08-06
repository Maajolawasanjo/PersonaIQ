'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NotificationPreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);
  const [journeyReminders, setJourneyReminders] = useState<boolean>(true);
  const [upcomingEvents, setUpcomingEvents] = useState<boolean>(true);
  const [preparationAlerts, setPreparationAlerts] = useState<boolean>(false);
  const [weeklyInsights, setWeeklyInsights] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

      {/* Main Settings Card */}
      <div className="bg-white border border-gray-200 rounded-[22px] p-6 shadow-xs space-y-6">
        
        {/* CHANNELS */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            CHANNELS
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Email Notifications</h3>
                <p className="text-[12px] text-gray-500 font-normal">Receive updates, reports, and alerts directly to your inbox.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${emailNotifications ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${emailNotifications ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Push Notifications</h3>
                <p className="text-[12px] text-gray-500 font-normal">Real-time alerts sent directly to your device.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${pushNotifications ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${pushNotifications ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* JOURNEY ALERTS */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            JOURNEY ALERTS
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Journey Reminders</h3>
                <p className="text-[12px] text-gray-500 font-normal">Gentle nudges to complete your daily or weekly presence modules.</p>
              </div>
              <button
                type="button"
                onClick={() => setJourneyReminders(!journeyReminders)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${journeyReminders ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${journeyReminders ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Upcoming Events</h3>
                <p className="text-[12px] text-gray-500 font-normal">Notifications about scheduled coaching sessions or webinars.</p>
              </div>
              <button
                type="button"
                onClick={() => setUpcomingEvents(!upcomingEvents)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${upcomingEvents ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${upcomingEvents ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Preparation Alerts</h3>
                <p className="text-[12px] text-gray-500 font-normal">Timely prompts to prepare for critical meetings or presentations.</p>
              </div>
              <button
                type="button"
                onClick={() => setPreparationAlerts(!preparationAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${preparationAlerts ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${preparationAlerts ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
            INSIGHTS
          </span>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14.5px] font-bold text-gray-950 font-sans">Weekly Insights</h3>
              <p className="text-[12px] text-gray-500 font-normal">A curated summary of your Presence Index™ progress and AI analysis.</p>
            </div>
            <button
              type="button"
              onClick={() => setWeeklyInsights(!weeklyInsights)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${weeklyInsights ? 'bg-red-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${weeklyInsights ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          className="h-10 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[13px] rounded-[8px] transition-colors"
        >
          Discard Changes
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-[8px] shadow-sm transition-all"
        >
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>

    </div>
  );
}
