'use client';

import React, { useState } from 'react';

export default function SecuritySettingsPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">

      <div className="space-y-1 border-b border-gray-100 pb-4">
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">Security</h1>
        <p className="text-[13.5px] text-gray-500 font-normal">Manage your password, two-factor authentication, and active sessions.</p>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <h3 className="text-[18px] font-bold text-gray-950 font-sans">Change Password</h3>
        {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
          <div key={label} className="space-y-1">
            <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">{label}</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all"
            />
          </div>
        ))}
        <button type="button" className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all">
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">Two-Factor Authentication</h3>
            <p className="text-[12.5px] text-gray-500 mt-0.5">Add an extra layer of security to your account.</p>
          </div>
          <button
            onClick={() => setTwoFAEnabled((v) => !v)}
            className={`w-12 h-6 rounded-full transition-colors relative ${twoFAEnabled ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${twoFAEnabled ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {twoFAEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-[12px] p-4 text-[13px] text-green-700 font-medium flex items-center space-x-2">
            <span>✓</span>
            <span>2FA is active via Authenticator App (TOTP)</span>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <h3 className="text-[18px] font-bold text-gray-950 font-sans">Active Sessions</h3>
        {[
          { device: 'MacBook Pro — Chrome', location: 'London, UK', time: 'Active now', current: true },
          { device: 'iPhone 15 Pro — Safari', location: 'London, UK', time: '2 hours ago', current: false },
          { device: 'Windows PC — Edge', location: 'Manchester, UK', time: '3 days ago', current: false },
        ].map((session, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-[14px] border border-gray-200 bg-gray-50/50">
            <div>
              <span className="text-[14px] font-bold text-gray-950 block leading-tight">{session.device}</span>
              <span className="text-[11.5px] text-gray-400 font-mono">{session.location} · {session.time}</span>
            </div>
            {session.current ? (
              <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">THIS DEVICE</span>
            ) : (
              <button type="button" className="text-[12px] font-mono font-bold text-red-500 hover:text-red-700 transition-colors">Revoke</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
