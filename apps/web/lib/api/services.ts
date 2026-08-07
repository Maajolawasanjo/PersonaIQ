import { apiClient } from './client';
import {
  AuthTokens,
  DashboardOverview,
  Journey,
  OutfitUpload,
  PaginatedResponse,
  PresencePlan,
  SelfieUpload,
  UserProfile,
} from './types';

export const authApi = {
  signUp: (email: string, password: string, fullName: string): Promise<AuthTokens> =>
    apiClient.post<AuthTokens>('/auth/sign-up', {
      email,
      password,
      full_name: fullName,
    }),

  signIn: (email: string, password: string): Promise<AuthTokens> =>
    apiClient.post<AuthTokens>('/auth/sign-in', {
      email,
      password,
    }),

  verifyOtp: (email: string, code: string): Promise<AuthTokens> =>
    apiClient.post<AuthTokens>('/auth/verify-otp', {
      email,
      code,
    }),

  resendOtp: (email: string): Promise<{ success: boolean }> =>
    apiClient.post<{ success: boolean }>('/auth/resend-otp', {
      email,
    }),

  forgotPassword: (email: string): Promise<{ success: boolean }> =>
    apiClient.post<{ success: boolean }>('/auth/forgot-password', {
      email,
    }),

  resetPassword: (token: string, newPassword: string): Promise<{ success: boolean }> =>
    apiClient.post<{ success: boolean }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    }),

  logout: (refreshToken: string): Promise<{ logged_out: boolean }> =>
    apiClient.post<{ logged_out: boolean }>('/auth/logout', {
      refresh_token: refreshToken,
    }),

  getMe: (): Promise<UserProfile> => apiClient.get<UserProfile>('/auth/me'),
};

export const userApi = {
  getProfile: (): Promise<UserProfile> => apiClient.get<UserProfile>('/user/profile'),

  updateProfile: (data: { full_name?: string; avatar_url?: string }): Promise<UserProfile> =>
    apiClient.put<UserProfile>('/user/profile', data),
};

export const journeyApi = {
  createJourney: (title: string): Promise<Journey> =>
    apiClient.post<Journey>('/journeys', { title }),

  updateEventContext: (
    journeyId: string,
    eventData: {
      event_type: string;
      dress_code: string;
      target_vibe: string;
      event_date?: string;
      location?: string;
    }
  ): Promise<Journey> =>
    apiClient.patch<Journey>(`/journeys/${journeyId}/event`, eventData),

  getJourney: (journeyId: string): Promise<Journey> =>
    apiClient.get<Journey>(`/journeys/${journeyId}`),

  listJourneys: (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Journey>> => {
    let url = `/journeys?page=${page}&limit=${limit}`;
    if (status) url += `&status_filter=${status}`;
    return apiClient.request<PaginatedResponse<Journey>>(url, { method: 'GET' });
  },

  archiveJourney: (journeyId: string): Promise<Journey> =>
    apiClient.post<Journey>(`/journeys/${journeyId}/archive`),
};

export const uploadApi = {
  uploadSelfie: (journeyId: string, file: File): Promise<SelfieUpload> => {
    const formData = new FormData();
    formData.append('journey_id', journeyId);
    formData.append('file', file);
    return apiClient.upload<SelfieUpload>('/uploads/selfie', formData);
  },

  uploadOutfits: (journeyId: string, files: File[]): Promise<OutfitUpload[]> => {
    const formData = new FormData();
    formData.append('journey_id', journeyId);
    files.forEach((file) => formData.append('files', file));
    return apiClient.upload<OutfitUpload[]>('/uploads/outfits', formData);
  },
};

export const presenceApi = {
  analyzeJourney: (journeyId: string): Promise<PresencePlan> =>
    apiClient.post<PresencePlan>(`/journeys/${journeyId}/analyze`),

  getPresencePlan: (journeyId: string): Promise<PresencePlan> =>
    apiClient.get<PresencePlan>(`/journeys/${journeyId}/plan`),
};

export const dashboardApi = {
  getOverview: (): Promise<DashboardOverview> =>
    apiClient.get<DashboardOverview>('/dashboard'),
};
