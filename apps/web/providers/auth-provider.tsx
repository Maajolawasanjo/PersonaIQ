'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { authApi } from '@/lib/api/services';
import type { AuthSession, UserProfile } from '@/lib/api/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<UserProfile | null>;
  updateUserLocally: (partial: Partial<UserProfile>) => void;
  signIn: (email: string, pass: string) => Promise<AuthSession>;
  signUp: (email: string, pass: string, firstName: string, lastName: string) => Promise<AuthSession>;
  verifyOtp: (email: string, code: string) => Promise<AuthSession>;
  resendOtp: (email: string) => Promise<{ success: boolean }>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (token: string, pass: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function broadcast(type: string, payload?: unknown) {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel('personaiq_auth_channel');
    channel.postMessage({ type, payload });
    channel.close();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = useCallback(async (retryCount = 0): Promise<UserProfile | null> => {
    try {
      // No client-side token check: cookies are HttpOnly and not readable here.
      const profile = await authApi.getMe();
      setUser(profile);
      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (
        (message.includes('BACKEND_WARMING') || message.includes('NETWORK_ERROR'))
        && retryCount < 2
      ) {
        await new Promise(resolve => setTimeout(resolve, 4000));
        return refetchUser(retryCount + 1);
      }
      if (message.includes('SESSION_EXPIRED')) {
        setUser(null);
        return null;
      }
      console.warn('[Auth] Profile is not currently available:', message);
      setUser(null);
      return null;
    }
  }, []);

  const updateUserLocally = useCallback((partial: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...partial } : null);
    broadcast('USER_UPDATED', partial);
  }, []);

  useEffect(() => {
    let active = true;
    // Remove legacy browser-readable tokens. Existing accounts may need
    // to sign in again to obtain server-managed cookies.
    apiClient.clearLegacyBrowserTokens();
    void (async () => {
      try {
        await refetchUser();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('personaiq_auth_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LOGOUT') setUser(null);
        else if (event.data?.type === 'LOGIN' || event.data?.type === 'USER_UPDATED') {
          void refetchUser();
        }
      };
      return () => { active = false; channel.close(); };
    }
    return () => { active = false; };
  }, [refetchUser]);

  const completeAuthentication = async (session: AuthSession): Promise<AuthSession> => {
    if (!session.authenticated) throw new Error('The server did not create a session.');
    const profile = session.user ?? await authApi.getMe();
    setUser(profile);
    broadcast('LOGIN');
    return { authenticated: true, user: profile };
  };

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      return await completeAuthentication(await authApi.signIn(email, pass));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      return await completeAuthentication(await authApi.signUp(email, pass, firstName, lastName));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      return await completeAuthentication(await authApi.verifyOtp(email, code));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('[Auth] Backend session revocation could not be confirmed:', error);
    } finally {
      apiClient.clearLegacyBrowserTokens();
      setUser(null);
      setIsLoading(false);
      broadcast('LOGOUT');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      refetchUser,
      updateUserLocally,
      signIn,
      signUp,
      verifyOtp,
      resendOtp: authApi.resendOtp,
      forgotPassword: authApi.forgotPassword,
      resetPassword: authApi.resetPassword,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
