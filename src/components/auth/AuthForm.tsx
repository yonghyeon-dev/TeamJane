"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { GoogleSignInButton } from '@/components/ui'
import { useAuth } from '@/lib/auth/auth-context'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { LogIn, UserPlus } from 'lucide-react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Google OAuth 로그인 시도')
      await signInWithGoogle()
      
      // OAuth 리다이렉트가 발생하므로 여기서는 router.push를 하지 않음
      // 콜백 페이지에서 처리됨
    } catch (err: unknown) {
      console.error('Google OAuth 오류:', err)
      
      let errorMessage = 'Google 로그인 중 오류가 발생했습니다.'
      
      if (err instanceof Error) {
        if (err.message.includes('popup_blocked')) {
          errorMessage = '팝업이 차단되었습니다. 팝업을 허용하고 다시 시도해주세요.'
        } else if (err.message.includes('access_denied')) {
          errorMessage = 'Google 로그인이 취소되었습니다.'
        } else if (err.message.includes('network')) {
          errorMessage = '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
        } else {
          errorMessage = err.message || 'Google 로그인 중 알 수 없는 오류가 발생했습니다.'
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  const isSignUp = mode === 'signup'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            WEAVE
          </h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            {isSignUp ? '계정 만들기' : '로그인'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? '프리랜서를 위한 올인원 워크스페이스를 시작하세요'
              : '간편하게 로그인하여 계속하세요'
            }
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-lg">
              {isSignUp ? (
                <UserPlus className="w-6 h-6 text-primary-600" />
              ) : (
                <LogIn className="w-6 h-6 text-primary-600" />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 소셜 로그인만 지원 */}
            <div className="space-y-4">
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                disabled={loading}
                text={isSignUp ? "Google로 계정 만들기" : "Google로 로그인"}
              />


              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  소셜 계정을 사용하여 {isSignUp ? '가입하면' : '로그인하면'}
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 복잡한 비밀번호 설정 불필요</li>
                  <li>• 기존 계정의 보안 시스템 활용</li>
                  <li>• 빠르고 간편한 인증</li>
                </ul>
              </div>
            </div>

            {/* 개발 환경 안내 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>개발 모드:</strong> 소셜 로그인 설정 확인이 필요합니다.
                  <br />
                  Supabase Dashboard에서 Provider를 활성화해주세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
          </p>
          <Link
            href={isSignUp ? '/auth/login' : '/auth/register'}
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            {isSignUp ? '로그인하기' : '계정 만들기'}
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            계속 진행하면 Weave의{' '}
            <Link href="#terms" className="text-primary-600 hover:underline">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="#privacy" className="text-primary-600 hover:underline">
              개인정보처리방침
            </Link>
            에 동의한 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}