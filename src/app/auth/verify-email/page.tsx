"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Weave ERP
          </h1>
        </div>

        <Card className="mt-8">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 rounded-lg">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                이메일을 확인해주세요
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                회원가입을 완료하기 위해 이메일 인증이 필요합니다.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                인증 이메일을 보냈습니다
              </h3>
              <p className="text-sm text-blue-700">
                입력하신 이메일 주소로 인증 링크를 발송했습니다. 
                이메일을 확인하고 링크를 클릭하여 계정을 활성화해주세요.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">
                이메일이 오지 않았나요?
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 스팸 폴더를 확인해보세요</li>
                <li>• 이메일 주소를 정확히 입력했는지 확인해보세요</li>
                <li>• 몇 분 후에 다시 시도해보세요</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                인증 이메일 다시 보내기
              </Button>
              
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  로그인 페이지로 돌아가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            이메일 인증 후 자동으로 로그인됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}