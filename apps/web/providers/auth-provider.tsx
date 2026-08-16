'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { authApi } from '@/lib/api/services';
import { UserProfile } from '@/lib/api/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<UserProfile | null>;
  updateUserLocally: (partial: Partial<UserProfile>) => void;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, firstName: string, lastName: string) => Promise<any>;
  verifyOtp: (email: string, code: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refetchUser = useCallback(async (retryCount = 0): Promise<UserProfile | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return null;
      }
      const profile = await authApi.getMe();
      setUser(profile);
      return profile;
    } catch (err: any) {
      const msg = err?.message || '';

      // Backend is cold-starting on Render — preserve session, retry after 5s
      if ((msg.includes('BACKEND_WARMING') || msg.includes('NETWORK_ERROR')) && retryCount < 3) {
        console.warn(`[Auth] Backend warming up, retrying in 5s (attempt ${retryCount + 1}/3)...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return refetchUser(retryCount + 1);
      }

      // Confirmed auth failure (401) — session is invalid, clear everything
      if (msg.includes('SESSION_EXPIRED') || msg.includes('session has expired')) {
        apiClient.clearTokens();
        setUser(null);
        return null;
      }

      // Any other error (parse errors, 5xx, etc.) — preserve session, just return null user
      // Don't touch tokens — the backend may just be temporarily unhealthy
      console.warn('[Auth] Could not fetch user profile, preserving session:', msg);
      setUser(null);
      return null;
    }
  }, []);

  const updateUserLocally = useCallback((partial: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
    // Broadcast change across browser tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('personaiq_auth_channel');
      channel.postMessage({ type: 'USER_UPDATED', payload: partial });
      channel.close();
    }
  }, []);

  // Initial authentication load & cross-tab synchronization
  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      await refetchUser();
      setIsLoading(false);
    }
    loadUser();

    // 1. Cross-Tab Sync via BroadcastChannel & Storage Event
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('personaiq_auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LOGOUT') {
          setUser(null);
        } else if (event.data?.type === 'USER_UPDATED') {
          refetchUser();
        } else if (event.data?.type === 'LOGIN') {
          refetchUser();
        }
      };
      return () => channel.close();
    }
  }, [refetchUser]);

  // 2. Proactive Session Token Refresh (Every 12 minutes)
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://personaiq-3suq.onrender.com/api/v1';
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const data = await res.json();
          if (data.success && data.data?.access_token) {
            apiClient.setTokens(data.data.access_token, data.data.refresh_token);
          }
        } catch (e) {
          console.warn('Proactive token refresh attempt skipped.');
        }
      }
    }, 12 * 60 * 1000); // 12 mins

    return () => clearInterval(interval);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.signIn(email, pass);
      if (tokens.access_token && tokens.refresh_token) {
        apiClient.setTokens(tokens.access_token, tokens.refresh_token);
        const profile = await authApi.getMe();
        setUser(profile);

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('personaiq_auth_channel');
          channel.postMessage({ type: 'LOGIN' });
          channel.close();
        }
      }
      return tokens;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.signUp(email, pass, firstName, lastName);
      if (tokens.access_token && tokens.refresh_token) {
        apiClient.setTokens(tokens.access_token, tokens.refresh_token);
        const profile = await authApi.getMe();
        setUser(profile);

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('personaiq_auth_channel');
          channel.postMessage({ type: 'LOGIN' });
          channel.close();
        }
      }
      return tokens;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.verifyOtp(email, code);
      if (tokens.access_token && tokens.refresh_token) {
        apiClient.setTokens(tokens.access_token, tokens.refresh_token);
        const profile = await authApi.getMe();
        setUser(profile);

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('personaiq_auth_channel');
          channel.postMessage({ type: 'LOGIN' });
          channel.close();
        }
      }
      return tokens;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    return await authApi.resendOtp(email);
  };

  const forgotPassword = async (email: string) => {
    return await authApi.forgotPassword(email);
  };

  const resetPassword = async (token: string, pass: string) => {
    return await authApi.resetPassword(token, pass);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.clearTokens();
      setUser(null);
      setIsLoading(false);

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('personaiq_auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        refetchUser,
        updateUserLocally,
        signIn,
        signUp,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
