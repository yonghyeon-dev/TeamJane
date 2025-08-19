import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../types/database'

export const createClient = () => {
  // 환경변수 체크
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // 개발 환경에서만 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase 환경변수 체크:', {
      url: url ? '설정됨' : '없음',
      key: key ? '설정됨' : '없음'
    })
  }
  
  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Supabase 환경변수가 설정되지 않았습니다')
    }
    throw new Error('Supabase configuration is missing')
  }
  
  try {
    const client = createClientComponentClient<Database>()
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase 클라이언트 생성 성공')
    }
    return client
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Supabase 클라이언트 생성 실패:', error)
    }
    throw new Error('Failed to create Supabase client')
  }
}