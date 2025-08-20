// Supabase 연결 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  const SUPABASE_URL = 'https://nmwvuxfhyroxczfsrgdn.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5td3Z1eGZoeXJveGN6ZnNyZ2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODYwMjAsImV4cCI6MjA3MDU2MjAyMH0.UpJ-oz3_T-gA1z2vBUjWCyJuOhSjD3P7MzONIruwwWo';

  console.log('Supabase 연결 테스트 시작...');
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase 클라이언트 생성 성공');

    // 1. 기본 연결 테스트 (auth 상태 확인)
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('세션 가져오기 오류:', sessionError);
    } else {
      console.log('세션 상태 확인 성공:', session ? '로그인됨' : '로그인되지 않음');
    }

    // 2. 사용자 조회 테스트
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('사용자 정보 가져오기 오류:', userError);
    } else {
      console.log('사용자 정보 조회 성공:', user ? user.user?.email : '사용자 없음');
    }

    // 3. 테스트 로그인 시도 (에러 확인용)
    console.log('\n테스트 로그인 시도...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    if (loginError) {
      console.log('예상된 로그인 오류:', loginError.message);
    } else {
      console.log('예상하지 못한 로그인 성공:', loginData);
    }

    // 4. 테스트 회원가입 시도 (실제로 생성하지 않음)
    console.log('\n테스트 회원가입 시도...');
    const testEmail = `test.${Date.now()}@example.com`;
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123'
    });
    
    if (signupError) {
      console.log('회원가입 오류:', signupError.message);
    } else {
      console.log('회원가입 시도 결과:', signupData);
    }

  } catch (error) {
    console.error('전체 테스트 실패:', error);
  }
}

testSupabaseConnection();