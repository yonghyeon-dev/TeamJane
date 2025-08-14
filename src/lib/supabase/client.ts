import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types'

export const createClient = () => {
  // 환경변수 체크
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Supabase 환경변수 체크:', {
    url: url ? '설정됨' : '없음',
    key: key ? '설정됨' : '없음',
    urlValue: url,
    keyValue: key ? key.substring(0, 20) + '...' : '없음'
  })
  
  if (!url || !key) {
    console.error('Supabase 환경변수가 설정되지 않았습니다')
    return null as any
  }
  
  try {
    const client = createClientComponentClient<Database>()
    console.log('Supabase 클라이언트 생성 성공')
    return client
  } catch (error) {
    console.error('Supabase 클라이언트 생성 실패:', error)
    return null as any
  }
}