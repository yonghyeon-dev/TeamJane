# 다중 인증 시스템 (Multi-Authentication System)

Weave ERP 시스템의 다중 인증 아키텍처 문서입니다.

## 개요

기존의 이메일/비밀번호 인증 시스템을 유지하면서 Google OAuth와 네이버 OAuth를 추가한 다중 인증 시스템을 구현했습니다. 사용자는 선호하는 인증 방식을 자유롭게 선택할 수 있습니다.

## 지원하는 인증 방식

### 1. 이메일/비밀번호 인증 (기존)
- 전통적인 이메일 기반 회원가입 및 로그인
- 이메일 인증을 통한 계정 활성화
- 비밀번호 보안 정책 적용

### 2. Google OAuth
- Google 계정을 통한 소셜 로그인
- 별도 비밀번호 설정 불필요
- Google의 보안 시스템 활용

### 3. 네이버 OAuth (준비 중)
- 네이버 계정을 통한 소셜 로그인
- 현재 placeholder 구현 (향후 완전 구현 예정)

## 아키텍처

### 핵심 컴포넌트

#### 1. AuthContext (`src/lib/auth/auth-context.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  // 이메일/비밀번호 인증
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  // 소셜 인증
  signInWithGoogle: () => Promise<{ provider: string; url: string } | void>;
  signInWithNaver: () => Promise<{ provider: string; url: string } | void>;
  // 공통
  signOut: () => Promise<void>;
}
```

#### 2. 통합 인증 UI (`src/components/auth/AuthForm.tsx`)
- 탭 기반 인증 방식 선택 (소셜 로그인 / 이메일)
- 동적 버튼 텍스트 (로그인 / 회원가입 모드)
- 일관된 사용자 경험

#### 3. 소셜 로그인 버튼
- `GoogleSignInButton`: Google OAuth 전용 버튼
- `NaverSignInButton`: 네이버 OAuth 전용 버튼

### 인증 플로우

#### 이메일/비밀번호 인증 플로우
```
1. 사용자가 이메일 탭 선택
2. 이메일, 비밀번호 (+ 회원가입시 이름) 입력
3. 로그인: signIn() → 대시보드 이동
4. 회원가입: signUp() → 이메일 인증 페이지 이동
```

#### 소셜 인증 플로우
```
1. 사용자가 소셜 로그인 탭 선택
2. Google/네이버 버튼 클릭
3. OAuth 제공자 사이트로 리다이렉트
4. 인증 완료 후 콜백 URL로 복귀
5. 자동 로그인 및 대시보드 이동
```

## 사용자 인터페이스

### 탭 기반 인증 선택
- **소셜 로그인 탭**: Google, 네이버 OAuth 버튼과 장점 설명
- **이메일 탭**: 기존 이메일/비밀번호 폼

### 동적 텍스트
- 로그인 모드: "Google로 로그인", "네이버로 로그인"
- 회원가입 모드: "Google로 계정 만들기", "네이버로 계정 만들기"

### 개발 환경 안내
- 소셜 로그인: Supabase Provider 설정 안내
- 이메일 인증: 이메일 인증 건너뛰기 가능 안내

## 기술 구현

### Supabase 인증
```typescript
// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${baseUrl}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
});

// 이메일/비밀번호
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### 환경별 설정
- 개발 환경: `http://localhost:3001/auth/callback`
- 프로덕션: `https://weave-erp.vercel.app/auth/callback`

## 보안 고려사항

### 이메일/비밀번호 인증
- 최소 6자 이상 비밀번호 정책
- 이메일 인증을 통한 계정 활성화
- 개발 환경에서는 이메일 미확인 사용자도 로그인 허용

### 소셜 인증
- OAuth 2.0 표준 준수
- 인증 토큰 안전한 처리
- CSRF 방지를 위한 state 파라미터 사용

## 에러 처리

### 한국어 에러 메시지
```typescript
if (err.message.includes('Invalid login credentials')) {
  errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다.';
} else if (err.message.includes('Email not confirmed')) {
  errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.';
} else if (err.message.includes('User already registered')) {
  errorMessage = '이미 가입된 이메일입니다.';
}
```

### 소셜 로그인 에러 처리
- 팝업 차단 에러
- 액세스 거부 에러
- 네트워크 에러
- 알 수 없는 에러

## 향후 개선사항

### 네이버 OAuth 완전 구현
현재 placeholder로 구현된 네이버 OAuth를 완전히 구현:
1. 네이버 개발자 센터에서 애플리케이션 등록
2. Supabase에서 custom OAuth provider 설정
3. 네이버 OAuth 2.0 API 연동

### 추가 소셜 로그인 제공자
- 카카오톡
- 페이스북
- GitHub

### 2단계 인증 (2FA)
- SMS 인증
- TOTP (Time-based One-Time Password)
- 이메일 인증 코드

## 테스트 시나리오

### 기능 테스트
1. ✅ 이메일/비밀번호 로그인
2. ✅ 이메일/비밀번호 회원가입
3. ✅ Google OAuth 버튼 표시
4. ✅ 네이버 OAuth 버튼 표시 (준비 중 메시지)
5. ✅ 탭 전환 기능
6. ✅ 동적 텍스트 변경
7. ✅ 에러 메시지 표시

### UI 테스트
1. ✅ 반응형 디자인
2. ✅ 일관된 스타일링
3. ✅ 접근성 (아이콘, 레이블)
4. ✅ 로딩 상태 표시

## 배포 체크리스트

### 환경 변수 설정
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### Supabase 설정
- Google OAuth Provider 활성화
- 콜백 URL 등록
- 이메일 템플릿 설정

### 도메인 설정
- OAuth 리다이렉트 URL 등록
- CORS 설정
- SSL 인증서 확인

---

*문서 작성일: 2024년 8월 21일*  
*최종 업데이트: 다중 인증 시스템 구현 완료*