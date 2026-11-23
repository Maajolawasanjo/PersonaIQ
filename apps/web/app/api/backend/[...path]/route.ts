import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE_URL = (
  process.env.PERSONAIQ_API_URL
  || process.env.NEXT_PUBLIC_API_URL
  || 'https://personaiq-3suq.onrender.com/api/v1'
).replace(/\/+$/, '');

const ACCESS_COOKIE = 'personaiq_session_access';
const REFRESH_COOKIE = 'personaiq_session_refresh';
const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

const TOKEN_ISSUERS = new Set(['auth/sign-in', 'auth/sign-up', 'auth/verify-otp']);
const PUBLIC_ROUTES = new Set([
  ...TOKEN_ISSUERS,
  'auth/forgot-password',
  'auth/reset-password',
  'auth/resend-otp',
  'auth/refresh',
]);

type RouteContext = { params: Promise<{ path: string[] }> };
type BackendPayload = {
  success?: boolean;
  message?: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: unknown;
    [key: string]: unknown;
  };
};

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    { success: false, message, error: { message }, data: null },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

function isSafeOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (origin) return origin === request.nextUrl.origin;
  // Unsafe requests without Origin must prove same-origin provenance.
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

function cookieSettings(maxAge: number) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

function setSessionCookies(response: NextResponse, access: string, refresh: string) {
  response.cookies.set(ACCESS_COOKIE, access, cookieSettings(ACCESS_TTL_SECONDS));
  response.cookies.set(REFRESH_COOKIE, refresh, cookieSettings(REFRESH_TTL_SECONDS));
  response.cookies.delete('personaiq_access_token');
  response.cookies.delete('access_token');
  response.cookies.delete('token');
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  response.cookies.delete('personaiq_access_token');
  response.cookies.delete('access_token');
  response.cookies.delete('token');
}

function privateHeaders(contentType?: string): Headers {
  const headers = new Headers({
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
  });
  if (contentType) headers.set('Content-Type', contentType);
  return headers;
}

async function refreshSession(refreshToken: string): Promise<BackendPayload['data'] | null> {
  try {
    const response = await fetch(API_BASE_URL + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as BackendPayload;
    if (!body.success
      || typeof body.data?.access_token !== 'string'
      || typeof body.data?.refresh_token !== 'string'
    ) return null;
    return body.data;
  } catch {
    return null;
  }
}

async function proxy(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  if (!Array.isArray(path) || !path.length || path.some(
    part => !/^[a-zA-Z0-9._~-]+$/.test(part) || part === '..' || part === '.'
  )) return errorResponse('Invalid API path.', 400);

  const endpoint = path.join('/');
  const method = request.method.toUpperCase();
  const isMutation = !['GET', 'HEAD'].includes(method);
  // Session mutations must never be invokable with safe HTTP methods.
  if (
    (endpoint === 'auth/logout'
      || endpoint === 'auth/refresh'
      || TOKEN_ISSUERS.has(endpoint))
    && method !== 'POST'
  ) return errorResponse('Method not allowed.', 405);
  if (isMutation && !isSafeOrigin(request)) {
    return errorResponse('Request origin was not verified.', 403);
  }

  if (Number(request.headers.get('content-length') || '0') > 64 * 1024 * 1024) {
    return errorResponse('Request is too large.', 413);
  }

  const refreshCookie = request.cookies.get(REFRESH_COOKIE)?.value;
  let accessCookie = request.cookies.get(ACCESS_COOKIE)?.value;
  let refreshedCredentials: BackendPayload['data'] | null = null;
  const target = API_BASE_URL + '/' + path.map(encodeURIComponent).join('/') + request.nextUrl.search;
  const contentType = request.headers.get('content-type');

  // Logout revokes the server-managed refresh token. Never trust an incoming
  // token supplied in JSON by the browser.
  if (endpoint === 'auth/logout') {
    let outcome: NextResponse;
    if (refreshCookie) {
      try {
        const backend = await fetch(API_BASE_URL + '/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ refresh_token: refreshCookie }),
        });
        outcome = new NextResponse(await backend.arrayBuffer(), {
          status: backend.status,
          headers: privateHeaders(backend.headers.get('content-type') || 'application/json'),
        });
      } catch {
        outcome = errorResponse('The server could not confirm logout. Your browser session has been cleared.', 503);
      }
    } else {
      outcome = NextResponse.json({
        success: true, message: 'Signed out.', data: { logged_out: true },
      }, { headers: privateHeaders('application/json') });
    }
    clearSessionCookies(outcome);
    return outcome;
  }

  // Refresh tokens come exclusively from HttpOnly cookies.
  if (endpoint === 'auth/refresh') {
    if (!refreshCookie) return errorResponse('No active session.', 401);
    const renewed = await refreshSession(refreshCookie);
    if (!renewed?.access_token || !renewed.refresh_token) {
      return errorResponse('Session could not be renewed.', 401);
    }
    const response = NextResponse.json({
      success: true, message: 'Session renewed.', data: { authenticated: true },
    }, { headers: privateHeaders('application/json') });
    setSessionCookies(response, renewed.access_token, renewed.refresh_token);
    return response;
  }

  // Never forward browser-supplied Authorization headers.
  let requestBody: ArrayBuffer | undefined;
  if (isMutation) requestBody = await request.arrayBuffer();
  const callBackend = (token: string | undefined) => {
    const headers = new Headers({ Accept: 'application/json' });
    if (contentType) headers.set('Content-Type', contentType);
    if (token) headers.set('Authorization', 'Bearer ' + token);
    return fetch(target, {
      method,
      headers,
      body: requestBody,
      cache: 'no-store',
      redirect: 'manual',
    });
  };

  if (!accessCookie && refreshCookie && !PUBLIC_ROUTES.has(endpoint)) {
    refreshedCredentials = await refreshSession(refreshCookie);
    accessCookie = refreshedCredentials?.access_token;
  }

  try {
    let upstream = await callBackend(accessCookie);
    if (upstream.status === 401 && refreshCookie && !PUBLIC_ROUTES.has(endpoint) && !refreshedCredentials) {
      refreshedCredentials = await refreshSession(refreshCookie);
      if (refreshedCredentials?.access_token) {
        upstream = await callBackend(refreshedCredentials.access_token);
      }
    }

    // Never expose access/refresh JWTs in browser-visible response bodies.
    if (TOKEN_ISSUERS.has(endpoint) && upstream.ok) {
      const payload = (await upstream.json()) as BackendPayload;
      const tokens = payload.data;
      if (!payload.success || !tokens?.access_token || !tokens.refresh_token) {
        return errorResponse('Authentication service returned an invalid session.', 502);
      }
      const response = NextResponse.json({
        success: true,
        message: payload.message || 'Signed in.',
        data: { authenticated: true, user: tokens.user || null },
      }, { status: upstream.status, headers: privateHeaders('application/json') });
      setSessionCookies(response, tokens.access_token, tokens.refresh_token);
      return response;
    }

    const response = new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: privateHeaders(upstream.headers.get('content-type') || undefined),
    });
    if (refreshedCredentials?.access_token && refreshedCredentials.refresh_token) {
      setSessionCookies(response, refreshedCredentials.access_token, refreshedCredentials.refresh_token);
    }
    return response;
  } catch {
    return errorResponse('PERSONAIQ services could not be reached.', 503);
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
