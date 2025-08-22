"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [attempts, setAttempts] = useState(0)
  const [status, setStatus] = useState('토큰 교환 중...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('OAuth 콜백 처리 시작')
        setStatus('OAuth 토큰 교환 중...')
        
        // 운영환경 감지
        const isProduction = process.env.NODE_ENV === 'production' || 
                            window.location.hostname !== 'localhost'
        
        // URL 프래그먼트에서 직접 토큰 추출 (운영환경 우선 처리)
        let accessToken = null
        let refreshToken = null
        
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1))
          accessToken = hashParams.get('access_token')
          refreshToken = hashParams.get('refresh_token')
          
          // URL 정리
          window.history.replaceState({}, document.title, window.location.pathname)
          
          if (accessToken && refreshToken) {
            console.log('URL 프래그먼트에서 토큰 발견, 직접 세션 설정')
            setStatus('세션 설정 중...')
            
            // 직접 세션 설정
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (setSessionError) {
              console.error('세션 설정 오류:', setSessionError)
            } else {
              console.log('세션 직접 설정 완료')
            }
          }
        }

        // 세션 검증 및 대기 (운영환경에서 더 긴 대기시간)
        const maxAttempts = isProduction ? 15 : 10
        const waitTime = isProduction ? 800 : 500
        
        setStatus('세션 검증 중...')
        const session = await waitForSession(maxAttempts, waitTime)
        
        if (session?.user) {
          console.log('인증 완료:', session.user.email)
          setStatus('사용자 정보 설정 중...')
          
          // 사용자 프로필 자동 생성 또는 업데이트
          try {
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email!,
                auth_id: session.user.id,
              }, { 
                onConflict: 'auth_id',
                ignoreDuplicates: false 
              })

            if (upsertError) {
              console.warn('사용자 정보 생성/업데이트 실패:', upsertError)
            } else {
              console.log('사용자 정보 생성/업데이트 완료')
            }

            // 프로필 자동 생성 또는 업데이트
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                user_id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, { 
                onConflict: 'user_id',
                ignoreDuplicates: false 
              })

            if (profileError) {
              console.warn('프로필 생성/업데이트 실패:', profileError)
            } else {
              console.log('프로필 생성/업데이트 완료')
            }
          } catch (profileSetupError) {
            console.error('프로필 설정 중 오류:', profileSetupError)
          }
          
          setStatus('대시보드로 이동 중...')
          
          // 운영환경에서 추가 검증 대기
          if (isProduction) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // replace 사용하여 뒤로가기 방지
          router.replace('/dashboard')
        } else {
          console.error('세션 획득 실패')
          setStatus('로그인 실패...')
          setTimeout(() => {
            router.push('/auth/login?error=session_failed')
          }, 2000)
        }
      } catch (err) {
        console.error('콜백 처리 중 오류:', err)
        setStatus('인증 오류 발생')
        setTimeout(() => {
          router.push('/auth/login?error=callback_error')
        }, 2000)
      }
    }

    // 세션 대기 함수
    const waitForSession = async (maxAttempts: number, waitTime: number) => {
      for (let i = 0; i < maxAttempts; i++) {
        setAttempts(i + 1)
        setStatus(`세션 확인 중... (${i + 1}/${maxAttempts})`)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error(`세션 확인 오류 (시도 ${i + 1}):`, error)
        }
        
        if (session?.user) {
          console.log(`세션 확인 완료 (시도 ${i + 1})`)
          return session
        }
        
        if (i < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
      
      throw new Error(`세션 타임아웃 (${maxAttempts}회 시도)`)
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">인증 처리 중...</h2>
        <p className="text-gray-600 mb-2">{status}</p>
        {attempts > 0 && (
          <p className="text-sm text-gray-500">
            세션 검증 시도: {attempts}회
          </p>
        )}
        <div className="mt-4 text-xs text-gray-400">
          운영환경에서는 더 안전한 인증 처리를 위해<br />
          조금 더 시간이 걸릴 수 있습니다.
        </div>
      </div>
    </div>
  )
}