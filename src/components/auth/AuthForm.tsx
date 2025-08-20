"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { useAuth } from '@/lib/auth/auth-context'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User } from 'lucide-react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 기본 검증
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      setLoading(false)
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('이름을 입력해주세요.')
      setLoading(false)
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 주소를 입력해주세요.')
      setLoading(false)
      return
    }

    // 비밀번호 최소 길이 검증
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signin') {
        console.log('로그인 시도:', { email })
        await signIn(email, password)
        router.push('/dashboard')
      } else {
        console.log('회원가입 시도:', { email, name })
        const result = await signUp(email, password, name)
        console.log('회원가입 결과:', result)
        
        // 회원가입 성공 시 이메일 인증 페이지로 이동
        if (result && !result.error) {
          router.push('/auth/verify-email')
        }
      }
    } catch (err: unknown) {
      console.error('인증 오류:', err)
      
      let errorMessage = '오류가 발생했습니다.'
      
      if (err instanceof Error) {
        // Supabase 에러 메시지 한국어화
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다.'
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
        } else if (err.message.includes('User already registered')) {
          errorMessage = '이미 가입된 이메일입니다.'
        } else if (err.message.includes('rate limit')) {
          errorMessage = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
        } else if (err.message.includes('Password should be at least 6 characters')) {
          errorMessage = '비밀번호는 6자 이상이어야 합니다.'
        } else if (err.message.includes('Signup requires a valid password')) {
          errorMessage = '유효한 비밀번호를 입력해주세요.'
        } else {
          errorMessage = err.message || '알 수 없는 오류가 발생했습니다.'
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
              : '계속하려면 로그인하세요'
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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="pl-10"
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500">
                    6자 이상의 안전한 비밀번호를 사용하세요
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSignUp ? '계정 생성 중...' : '로그인 중...'}</span>
                  </div>
                ) : (
                  isSignUp ? '계정 만들기' : '로그인'
                )}
              </Button>
            </form>

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

            {!isSignUp && (
              <div className="mt-4 text-center">
                <Link
                  href="#forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            )}
            
            {/* 개발 환경에서만 표시되는 테스트 정보 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>개발 모드:</strong> 실제 이메일 인증이 필요하지 않을 수 있습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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