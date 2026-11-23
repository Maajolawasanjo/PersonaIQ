import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/journey',
  '/plans',
  '/presence-dna',
  '/settings',
  '/wardrobe',
  '/onboarding',
];

function matchesRoute(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Navigation convenience only: the backend still enforces data ownership
  // and signed access-token authorization on every protected API request.
  const hasSession = Boolean(
    request.cookies.get('personaiq_session_access')?.value
      || request.cookies.get('personaiq_session_refresh')?.value
  );

  if (PROTECTED_PREFIXES.some(prefix => matchesRoute(pathname, prefix)) && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Do not redirect users away from login just because an old cookie exists.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
