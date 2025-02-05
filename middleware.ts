import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value;
  const appid = request.cookies.get('appid')?.value;
  const noid = request.cookies.get('noid')?.value;
  const username = request.cookies.get('username')?.value;

  // Exclude Next.js static files and API routes from middleware processing
  if (request.nextUrl.pathname.startsWith('/_next/') || request.nextUrl.pathname.startsWith('/images/') || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If no token is found and not public path, redirect the user to the login page.
  if (!token && !appid && !noid && !username && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && appid && noid && username && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home or dashboard
  }

  // if has token and access protected path
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], // Apply middleware to all routes
};