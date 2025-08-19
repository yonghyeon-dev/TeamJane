import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Supabase 환경변수가 없으면 middleware를 건너뛰기
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // 인증이 필요한 경로들
    const protectedPaths = ['/dashboard', '/projects', '/clients', '/documents', '/invoices', '/settings']
    const authPaths = ['/auth/login', '/auth/register']
    
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => req.nextUrl.pathname.startsWith(path))

    // 인증이 필요한 페이지에 비로그인 사용자가 접근
    if (isProtectedPath && !session) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 로그인된 사용자가 인증 페이지에 접근
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 루트 경로 리다이렉트
    if (req.nextUrl.pathname === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    // 인증 처리 중 오류 발생 시 안전한 처리
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error)
    }
    
    // 보호된 경로에서 오류 발생 시 로그인 페이지로 리다이렉트
    const protectedPaths = ['/dashboard', '/projects', '/clients', '/documents', '/invoices', '/settings']
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    
    if (isProtectedPath) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      redirectUrl.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(redirectUrl)
    }
    
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.svg$).*)',
  ],
}