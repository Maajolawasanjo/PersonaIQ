'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { authApi } from '@/lib/api/services';
import { UserProfile } from '@/lib/api/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, fullName: string) => Promise<any>;
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

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const profile = await authApi.getMe();
          setUser(profile);
        }
      } catch {
        apiClient.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.signIn(email, pass);
      if (tokens.requires_2fa) {
        return tokens;
      }
      if (tokens.access_token && tokens.refresh_token) {
        apiClient.setTokens(tokens.access_token, tokens.refresh_token);
        const profile = await authApi.getMe();
        setUser(profile);
      }
      return tokens;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.signUp(email, pass, fullName);
      if (tokens.access_token && tokens.refresh_token) {
        apiClient.setTokens(tokens.access_token, tokens.refresh_token);
        const profile = await authApi.getMe();
        setUser(profile);
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
