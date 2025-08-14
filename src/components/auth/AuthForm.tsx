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

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        router.push('/dashboard')
      } else {
        if (!name.trim()) {
          setError('이름을 입력해주세요.')
          return
        }
        console.log('회원가입 폼 제출:', { email, name })
        await signUp(email, password, name)
        console.log('회원가입 성공, 인증 페이지로 이동')
        router.push('/auth/verify-email')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.'
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
            Weave ERP
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    8자 이상의 안전한 비밀번호를 사용하세요
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