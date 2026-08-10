'use client';

import React from 'react';
import Link from 'next/link';
import { User, Palette, Bell, Shield, Link2, Lock, Accessibility, CreditCard, HelpCircle, Info, ChevronRight } from 'lucide-react';

import { userApi } from '@/lib/api/services';
import { UserProfile } from '@/lib/api/types';

export default function SettingsMainHubPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const user = await userApi.getProfile();
        setProfile(user);
      } catch (err) {
        console.warn('Could not fetch user profile for settings:', err);
      }
    }
    loadProfile();
  }, []);

  const sections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      desc: 'Name, email, occupation, and country.',
      icon: <User className="w-5 h-5" />,
      href: '/dashboard/settings/profile',
    },
    {
      id: 'security',
      title: 'Security',
      desc: 'Password, 2FA, and login history.',
      icon: <Lock className="w-5 h-5" />,
      href: '/dashboard/settings/security',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Alerts and communication preferences.',
      icon: <Bell className="w-5 h-5" />,
      href: '/dashboard/settings/notifications',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      desc: 'Data control and security policies.',
      icon: <Shield className="w-5 h-5" />,
      href: '/dashboard/settings/privacy',
    },
    {
      id: 'appearance',
      title: 'Theme',
      desc: 'Interface themes and typography.',
      icon: <Palette className="w-5 h-5" />,
      href: '/dashboard/settings/appearance',
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      desc: 'Motion, contrast, and font preferences.',
      icon: <Accessibility className="w-5 h-5" />,
      href: '/dashboard/settings/accessibility',
    },
    {
      id: 'accounts',
      title: 'Connected Accounts',
      desc: 'Integrations and third-party access.',
      icon: <Link2 className="w-5 h-5" />,
      href: '/dashboard/settings/accounts',
    },
    {
      id: 'billing',
      title: 'Billing',
      desc: 'Plans, payments, and seat management.',
      icon: <CreditCard className="w-5 h-5" />,
      href: '/dashboard/settings/billing',
      badge: 'Future',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">
          Settings & Account
        </h1>
        <p className="text-[13.5px] text-gray-500 font-normal">
          Manage your account profile and presence configuration.
        </p>
      </div>

      {/* Live Profile Header Banner */}
      {profile && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-[18px] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {(profile.first_name?.[0] || profile.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                {profile.full_name || profile.first_name ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Executive'}
              </h3>
              <p className="text-[12.5px] text-gray-500 font-mono">
                {profile.email}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Active Account
          </span>
        </div>
      )}

      {/* Main Preference Cards List */}
      <div className="space-y-3">
        {sections.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-[18px] shadow-2xs flex items-center justify-between transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:scale-105 transition-transform shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-950 font-sans leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12px] text-gray-500 font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {'badge' in item && item.badge && (
                <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          href="/support"
          className="p-4 bg-white border border-gray-200 rounded-[16px] flex items-center justify-between text-[13px] font-sans font-bold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <span>Help Center</span>
          </div>
          <span className="text-gray-400 font-mono text-[12px]">↗</span>
        </Link>
        <Link
          href="/about"
          className="p-4 bg-white border border-gray-200 rounded-[16px] flex items-center justify-between text-[13px] font-sans font-bold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span>About PersonaIQ</span>
          </div>
          <span className="text-gray-400 font-mono text-[12px]">↗</span>
        </Link>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-gray-150 space-y-3">
        <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
          DANGER ZONE
        </span>

        <div className="bg-red-50/20 border border-red-200 rounded-[18px] p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-gray-950 font-sans">
              Delete Account
            </h3>
            <p className="text-[12px] text-gray-500 font-normal">
              Permanently remove your presence data and configuration.
            </p>
          </div>

          <Link
            href="/system/account-deleted"
            className="px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold text-[12.5px] rounded-[8px] transition-colors shrink-0"
          >
            Delete Account
          </Link>
        </div>
      </div>

    </div>
  );
}
