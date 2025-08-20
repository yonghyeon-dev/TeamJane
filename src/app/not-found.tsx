"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Home className="mr-2 w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <button 
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  )
}