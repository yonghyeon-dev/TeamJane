'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugUserPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [status, setStatus] = useState('사용자 정보 확인 중...')

  useEffect(() => {
    async function getUserInfo() {
      const supabase = createClient()
      
      try {
        // 현재 사용자 정보 확인
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setStatus('사용자 인증 오류: ' + (userError?.message || 'No user'))
          return
        }
        
        console.log('사용자 ID:', user.id)
        console.log('사용자 이메일:', user.email)
        console.log('사용자 메타데이터:', user.user_metadata)
        
        setUserInfo({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        })
        
        setStatus('사용자 정보 로드 완료')
        
        // 실제 테이블 구조 확인
        console.log('클라이언트 테이블 스키마 확인...')
        const { data: clientsTest, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .limit(1)
          
        console.log('클라이언트 테이블 조회 결과:', { data: clientsTest, error: clientsError })
        
        console.log('프로필 테이블 스키마 확인...')
        const { data: profilesTest, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          
        console.log('프로필 테이블 조회 결과:', { data: profilesTest, error: profilesError })
        
        // 실제 데이터베이스 구조에 맞게 프로필 생성
        console.log('실제 구조로 프로필 생성 시도...')
        const { data: profileInsert, error: profileInsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,  // profiles 테이블의 기본 키는 id (user_id가 아님)
            email: user.email!,
            full_name: user.user_metadata?.full_name || '조용현',
            avatar_url: user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()

        if (profileInsertError) {
          console.error('프로필 삽입 오류:', profileInsertError)
          setStatus(prev => prev + ' | 프로필 삽입 오류: ' + profileInsertError.message)
        } else {
          console.log('프로필 삽입 성공:', profileInsert)
          setStatus(prev => prev + ' | 프로필 삽입 완료')
        }
        
      } catch (error) {
        console.error('오류:', error)
        setStatus('오류: ' + (error as Error).message)
      }
    }
    
    getUserInfo()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">사용자 디버그 페이지</h1>
      <p className="mb-4">상태: {status}</p>
      {userInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">사용자 정보:</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}