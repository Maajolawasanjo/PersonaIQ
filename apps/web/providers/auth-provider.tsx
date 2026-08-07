'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { authApi } from '@/lib/api/services';
import { UserProfile } from '@/lib/api/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string) => Promise<void>;
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
      apiClient.setTokens(tokens.access_token, tokens.refresh_token);
      const profile = await authApi.getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    setIsLoading(true);
    try {
      const tokens = await authApi.signUp(email, pass, fullName);
      apiClient.setTokens(tokens.access_token, tokens.refresh_token);
      const profile = await authApi.getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
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
