"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 실제 로깅 서비스 사용)
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">문제가 발생했습니다</h1>
          <p className="text-gray-600">
            예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-red-50 border border-red-200 rounded p-4 mt-4">
              <summary className="cursor-pointer font-medium text-red-800">
                개발자 정보 (개발 모드에서만 표시)
              </summary>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={reset}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            다시 시도
          </button>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            <Home className="mr-2 w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}