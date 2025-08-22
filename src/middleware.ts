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

    // 경로 분류
    const protectedPaths = ['/dashboard', '/projects', '/clients', '/documents', '/invoices', '/settings']
    const authPaths = ['/auth/login', '/auth/register']
    const callbackPaths = ['/auth/callback'] // 인증 콜백 경로
    
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => req.nextUrl.pathname.startsWith(path))
    const isCallbackPath = callbackPaths.some(path => req.nextUrl.pathname.startsWith(path))

    // 콜백 경로는 인증 처리를 위해 항상 허용 (OAuth 토큰 교환 중)
    if (isCallbackPath) {
      return res
    }

    // 세션 가져오기
    let session = null
    try {
      const { data } = await supabase.auth.getSession()
      session = data.session
    } catch (sessionError) {
      console.warn('Middleware: 세션 조회 오류:', sessionError)
      
      // 운영환경에서 세션 오류 시 재시도
      if (process.env.NODE_ENV === 'production') {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          const { data: retryData } = await supabase.auth.getSession()
          session = retryData.session
        } catch (retryError) {
          console.warn('Middleware: 세션 재시도 실패:', retryError)
        }
      }
    }

    // 보호된 경로 접근 검증
    if (isProtectedPath && !session) {
      // 운영환경에서 세션 부재 시 한 번 더 확인 (OAuth 직후 지연 대응)
      if (process.env.NODE_ENV === 'production') {
        try {
          await new Promise(resolve => setTimeout(resolve, 200))
          const { data: finalData } = await supabase.auth.getSession()
          session = finalData.session
        } catch (finalError) {
          console.warn('Middleware: 최종 세션 확인 실패:', finalError)
        }
      }
      
      // 여전히 세션이 없으면 로그인 페이지로 리다이렉트
      if (!session) {
        const redirectUrl = new URL('/auth/login', req.url)
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // 로그인된 사용자가 인증 페이지에 접근
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // 루트 경로에서 로그인된 사용자는 대시보드로 리다이렉트
    if (req.nextUrl.pathname === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    // 인증 처리 중 오류 발생 시 안전한 처리
    const logError = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'
    if (logError) {
      console.error('Middleware error:', error)
    }
    
    // 보호된 경로에서 오류 발생 시에만 로그인 페이지로 리다이렉트
    const protectedPaths = ['/dashboard', '/projects', '/clients', '/documents', '/invoices', '/settings']
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    
    if (isProtectedPath) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      redirectUrl.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(redirectUrl)
    }
    
    // 보호되지 않은 경로는 그대로 진행
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.svg$).*)',
  ],
}