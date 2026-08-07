'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { userApi } from '@/lib/api/services';
import { UserSession } from '@/lib/api/types';

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await userApi.getSessions();
        setSessions(data || []);
      } catch (err) {
        console.error('Failed to load active sessions:', err);
      } finally {
        setSessionsLoading(false);
      }
    }
    loadSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await userApi.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setStatusMessage({ type: 'success', text: 'Device session revoked successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to revoke session.' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    try {
      await userApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setStatusMessage({
        type: 'success',
        text: 'Password updated successfully! All other active sessions have been revoked for your security.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      const updated = await userApi.getSessions();
      setSessions(updated || []);
    } catch (err: any) {
      console.error('Failed to change password:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Current password is incorrect or request failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2 bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-gray-150">

      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-950 font-bold transition-colors">
          ←
        </Link>
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-950 font-sans leading-tight">Security</h1>
          <p className="text-[13.5px] text-gray-500 font-normal">Manage your password, two-factor authentication, and active device sessions.</p>
        </div>
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

      {/* Change Password Form */}
      <form onSubmit={handleUpdatePassword} className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <h3 className="text-[18px] font-bold text-gray-950 font-sans">Change Password</h3>

        <div className="space-y-1">
          <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">CURRENT PASSWORD</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">NEW PASSWORD</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            disabled={loading}
            className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10.5px] font-mono font-bold text-gray-500 uppercase tracking-widest block">CONFIRM NEW PASSWORD</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            disabled={loading}
            className="w-full h-11 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary rounded-[10px] px-4 text-[13.5px] text-gray-900 font-medium outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] rounded-[10px] shadow-sm transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <span>{loading ? 'Updating...' : 'Update Password'}</span>
        </button>
      </form>

      {/* Active Device Sessions */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-[18px] font-bold text-gray-950 font-sans">Active Device Sessions</h3>
          <p className="text-[12.5px] text-gray-500 mt-0.5">Authorized browser and device sessions authenticated with your account.</p>
        </div>

        {sessionsLoading ? (
          <div className="p-4 text-center text-gray-400 text-xs font-mono">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-150 text-center text-[13px] text-gray-500">
            No active secondary device sessions. Current session active.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess, idx) => (
              <div key={sess.id} className="p-4 bg-gray-50 border border-gray-150 rounded-[14px] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[14px] text-gray-900">{sess.device_info || 'Web Session'}</span>
                    {idx === 0 && (
                      <span className="text-[9.5px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase">
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-gray-500 font-mono mt-0.5">
                    IP: {sess.ip_address || '127.0.0.1'} • Created: {new Date(sess.created_at).toLocaleDateString()}
                  </div>
                </div>
                {idx !== 0 && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="h-8 px-3 text-[11.5px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-[8px] transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-gray-950 font-sans">Two-Factor Authentication (OTP)</h3>
            <p className="text-[12.5px] text-gray-500 mt-0.5">Enforced via Email OTP code verification during sign in.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
            ENFORCED BY DEFAULT
          </span>
        </div>
      </div>

    </div>
  );
}
