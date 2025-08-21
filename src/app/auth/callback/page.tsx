"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 토큰 처리
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 콜백 오류:', error)
          router.push('/auth/login?error=callback_error')
          return
        }

        if (data.session) {
          console.log('인증 완료:', data.session.user.email)
          // 성공적으로 인증된 경우 대시보드로 이동
          router.push('/dashboard')
        } else {
          // 세션이 없는 경우 로그인 페이지로 이동
          router.push('/auth/login')
        }
      } catch (err) {
        console.error('콜백 처리 중 오류:', err)
        router.push('/auth/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">인증 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요</p>
      </div>
    </div>
  )
}