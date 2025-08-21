# Google OAuth 인증 설정 가이드

Weave 프로젝트가 기존 이메일/비밀번호 인증에서 Google OAuth로 완전히 마이그레이션되었습니다.

## 🔧 설정 완료 항목

### ✅ 프론트엔드 변경사항

1. **인증 컨텍스트 리팩토링**
   - `signIn`, `signUp` → `signInWithGoogle`로 변경
   - OAuth 리다이렉트 플로우 지원
   - 자동 토큰 관리

2. **UI 컴포넌트 업데이트**
   - `GoogleSignInButton` 컴포넌트 추가
   - AuthForm을 Google OAuth 전용으로 교체
   - 로딩 상태 및 에러 처리 개선

3. **페이지 업데이트**
   - 로그인/회원가입 페이지 통합
   - 이메일 인증 페이지를 성공 페이지로 변경
   - 자동 대시보드 리다이렉트

## 🚀 Supabase 설정 방법

### 1. Google Cloud Console 설정

#### A. 프로젝트 생성 및 API 활성화
```bash
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Library" 이동
4. "Google+ API" 검색 및 활성화
```

#### B. OAuth 2.0 클라이언트 ID 생성
```bash
1. "APIs & Services" → "Credentials" 이동
2. "Create Credentials" → "OAuth 2.0 Client ID" 선택
3. Application type: "Web application" 선택
4. Name: "Weave App" (또는 원하는 이름)
```

#### C. 승인된 리디렉션 URI 설정
```
개발 환경:
http://localhost:54321/auth/v1/callback

운영 환경:
https://nmwvuxfhyioxcfstgdn.supabase.co/auth/v1/callback
```

⚠️ **중요**: Supabase 프로젝트의 실제 URL로 교체해야 합니다.

### 2. Supabase Dashboard 설정

#### A. Google Provider 활성화
```bash
1. Supabase Dashboard → Authentication → Providers
2. Google 토글 활성화
3. Google Cloud Console에서 생성한 Client ID 입력
4. Google Cloud Console에서 생성한 Client Secret 입력
5. Save 클릭
```

#### B. URL 설정 확인
```bash
Authentication → URL Configuration에서:
- Site URL: https://weave-erp.vercel.app (운영 환경)
- Redirect URLs: https://weave-erp.vercel.app/auth/callback
```

## 💻 개발 환경 테스트

### 1. 로컬 개발 설정
```bash
# .env.local 파일 확인
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 테스트 플로우
1. http://localhost:3000/auth/login 접속
2. "Google로 로그인" 버튼 클릭
3. Google 인증 팝업에서 계정 선택
4. 권한 승인 후 자동 리다이렉트
5. 대시보드 접속 확인

## 🌐 운영 환경 배포

### 1. Vercel 환경 변수 설정
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://weave-erp.vercel.app
NODE_ENV=production
```

### 2. 배포 확인 사항
- [ ] Google Cloud Console에서 운영 환경 리다이렉트 URI 추가
- [ ] Supabase에서 운영 환경 URL 설정
- [ ] Vercel 환경 변수 모두 설정
- [ ] HTTPS 인증서 확인

## 🔒 보안 고려사항

### 1. OAuth 스코프
기본적으로 다음 정보에 접근:
- 이메일 주소
- 기본 프로필 정보 (이름, 프로필 사진)

### 2. 토큰 관리
- Access Token: Supabase가 자동 관리
- Refresh Token: 자동 갱신
- 세션 만료: 기본 1시간 (Supabase 설정에서 변경 가능)

### 3. 사용자 데이터
```typescript
// Google OAuth로 인증된 사용자 정보
{
  id: "uuid",
  email: "user@example.com",
  user_metadata: {
    avatar_url: "https://lh3.googleusercontent.com/...",
    email: "user@example.com",
    email_verified: true,
    full_name: "사용자 이름",
    iss: "https://accounts.google.com",
    name: "사용자 이름",
    picture: "https://lh3.googleusercontent.com/...",
    provider_id: "123456789",
    sub: "123456789"
  }
}
```

## 🐛 문제 해결

### 일반적인 오류

#### 1. "popup_blocked" 오류
```bash
원인: 브라우저에서 팝업이 차단됨
해결: 브라우저 팝업 허용 설정
```

#### 2. "redirect_uri_mismatch" 오류
```bash
원인: Google Cloud Console의 리다이렉트 URI 불일치
해결: 
1. Google Cloud Console → Credentials 확인
2. 올바른 Supabase callback URL 추가
```

#### 3. "access_denied" 오류
```bash
원인: 사용자가 OAuth 권한을 거부함
해결: 사용자에게 권한 승인 안내
```

### 개발 환경 디버깅

#### 1. 콘솔 로그 확인
```javascript
// 브라우저 개발자 도구에서 확인할 로그들
'Google OAuth 로그인 시도'
'Google OAuth 요청 성공'
'Google OAuth 오류: [error message]'
```

#### 2. 네트워크 탭 확인
- `signInWithOAuth` API 호출
- Google OAuth 리다이렉트
- Supabase callback 처리

#### 3. Supabase Dashboard 로그
```bash
Supabase Dashboard → Authentication → Logs에서:
- OAuth 요청 로그
- 사용자 생성 로그
- 오류 로그 확인
```

## 📋 체크리스트

### 설정 완료 확인
- [ ] Google Cloud Console 프로젝트 설정
- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] 리다이렉트 URI 설정 (개발/운영)
- [ ] Supabase Google Provider 활성화
- [ ] Client ID/Secret 입력
- [ ] 환경 변수 설정 (개발/운영)

### 테스트 완료 확인
- [ ] 로컬 개발 환경 로그인 테스트
- [ ] 운영 환경 로그인 테스트
- [ ] 로그아웃 기능 테스트
- [ ] 사용자 세션 지속성 테스트
- [ ] 에러 핸들링 테스트

## 🔄 마이그레이션 히스토리

### 변경 전 (이메일/비밀번호)
- 복잡한 비밀번호 요구사항
- 이메일 인증 필요
- 비밀번호 복구 기능 필요
- 보안 위험 (약한 비밀번호, 피싱 등)

### 변경 후 (Google OAuth)
- 간편한 원클릭 로그인
- Google의 2FA 보안 활용
- 이메일 인증 자동 처리
- 비밀번호 관리 불필요
- 향상된 사용자 경험

---

**도움이 필요하면**: [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2) 또는 [Supabase Auth 문서](https://supabase.com/docs/guides/auth/social-login/auth-google) 참조