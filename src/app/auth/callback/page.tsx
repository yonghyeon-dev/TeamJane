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
        console.log('OAuth 콜백 처리 시작')
        
        // URL 해시에서 토큰 교환 처리
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 콜백 오류:', error)
          // Supabase는 자동으로 URL의 code를 처리하므로 잠시 대기
          setTimeout(() => {
            router.push('/auth/login?error=callback_error')
          }, 2000)
          return
        }

        if (data.session) {
          console.log('인증 완료:', data.session.user.email)
          router.push('/dashboard')
        } else {
          // 토큰 교환이 아직 진행중일 수 있으므로 잠시 대기 후 재시도
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession()
            if (retryData.session) {
              router.push('/dashboard')
            } else {
              router.push('/auth/login')
            }
          }, 1000)
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