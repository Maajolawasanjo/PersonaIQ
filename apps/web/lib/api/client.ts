import { StandardResponse } from './types';

// Browser requests are same-origin. Access/refresh tokens live only in
// server-managed HttpOnly cookies and must not be copied into localStorage.
const API_BASE_URL = '/api/backend';

class ApiClient {
  public clearLegacyBrowserTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'personaiq_access_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(options.headers);
    // Never send an access token from JavaScript to the API proxy.
    headers.delete('Authorization');
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        ...options,
        credentials: 'same-origin',
        headers,
        cache: 'no-store',
        signal: controller.signal,
      });

      const body = await response.json().catch(() => ({
        success: false,
        message: 'The server returned an unreadable response.',
        data: null,
      })) as StandardResponse<T> & {
        error?: { message?: string };
      };

      if (!response.ok || !body.success) {
        const publicEndpoint = [
          '/auth/sign-in', '/auth/sign-up', '/auth/refresh',
          '/auth/verify-otp', '/auth/resend-otp',
          '/auth/reset-password', '/auth/forgot-password',
        ].some(path => endpoint === path);

        if (response.status === 401 && !publicEndpoint) {
          throw new Error('SESSION_EXPIRED: Please sign in to continue.');
        }
        if (response.status === 503) {
          throw new Error('BACKEND_WARMING: PERSONAIQ services are currently unavailable. Please retry.');
        }
        throw new Error(body.error?.message || body.message || 'Request failed (' + response.status + ').');
      }

      return body.data;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('BACKEND_WARMING: The PERSONAIQ server is taking longer than expected. Please retry.');
      }
      if (err instanceof TypeError) {
        throw new Error('NETWORK_ERROR: Unable to reach PERSONAIQ services. Check your connection and retry.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  }

  public patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  public put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  public upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: formData });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
