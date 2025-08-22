// 임시 스크립트: 사용자 및 프로필 데이터 생성
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fsumnnfbywndjegrvtku.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdW1ubmZieXduZGplZ3J2dGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3Mzg2MDUsImV4cCI6MjA3MTMxNDYwNX0.37c7-g7ze-Fg-v0u_HTNfWZ6NAMPi9GXNqoY1cII3CM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createUserProfile() {
  console.log('현재 사용자 확인...')
  
  // 현재 사용자 정보 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('사용자 인증 오류:', userError)
    return
  }
  
  console.log('사용자 정보:', {
    id: user.id,
    email: user.email,
    metadata: user.user_metadata
  })
  
  // users 테이블에 사용자 생성
  console.log('users 테이블에 사용자 생성 중...')
  const { data: userData, error: userCreateError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      auth_id: user.id,
    }, { 
      onConflict: 'auth_id',
      ignoreDuplicates: false 
    })
    .select()

  if (userCreateError) {
    console.error('사용자 생성 오류:', userCreateError)
  } else {
    console.log('사용자 생성 성공:', userData)
  }

  // profiles 테이블에 프로필 생성
  console.log('profiles 테이블에 프로필 생성 중...')
  const { data: profileData, error: profileCreateError } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || '조용현',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { 
      onConflict: 'user_id',
      ignoreDuplicates: false 
    })
    .select()

  if (profileCreateError) {
    console.error('프로필 생성 오류:', profileCreateError)
  } else {
    console.log('프로필 생성 성공:', profileData)
  }
  
  console.log('작업 완료!')
}

createUserProfile().catch(console.error)