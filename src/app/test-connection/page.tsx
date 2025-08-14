"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnectionPage() {
  const [status, setStatus] = useState('테스트 중...')
  const [details, setDetails] = useState<any>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('연결 테스트 시작')
        
        // 환경변수 확인
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        setDetails({
          url: url ? '설정됨' : '없음',
          key: key ? '설정됨' : '없음',
          urlValue: url,
          keyValue: key ? key.substring(0, 20) + '...' : '없음'
        })

        // 클라이언트 생성
        const supabase = createClient()
        
        if (!supabase) {
          setStatus('❌ Supabase 클라이언트 생성 실패')
          return
        }

        // 간단한 연결 테스트
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('❌ 연결 실패: ' + error.message)
          console.error('연결 오류:', error)
        } else {
          setStatus('✅ Supabase 연결 성공!')
          console.log('연결 성공:', data)
        }
        
      } catch (err) {
        setStatus('❌ 오류: ' + (err as Error).message)
        console.error('테스트 오류:', err)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase 연결 테스트</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">연결 상태</h2>
          <p className="text-lg">{status}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">환경변수 정보</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>URL: {details.url}</div>
            <div>Key: {details.key}</div>
            <div>URL 값: {details.urlValue}</div>
            <div>Key 값: {details.keyValue}</div>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href="/auth/register" 
            className="text-blue-600 hover:underline"
          >
            ← 회원가입 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}