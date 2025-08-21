# OAuth 설정 가이드 (구글 & 카카오톡)

Weave 프로젝트의 소셜 로그인 기능을 설정하기 위한 단계별 가이드입니다.

## 📋 현재 상태

### 구현 완료
- ✅ 소셜 로그인 전용 시스템
- ✅ Google OAuth 코드 구현
- ✅ 카카오톡 OAuth 코드 구현
- ✅ Supabase 환경 설정
- ✅ 이메일 인증 기능 제거

### 필요한 설정
- 🔧 Google Cloud Console OAuth 설정
- 🔧 Supabase Dashboard Google Provider 활성화
- 🔧 카카오 디벨로퍼스 OAuth 설정
- 🔧 Supabase Dashboard Kakao Provider 활성화

## 🔗 1. Google OAuth 설정

### 1.1 Google Cloud Console 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/ 방문
   - 프로젝트 생성 또는 기존 프로젝트 선택

2. **OAuth 동의 화면 설정**
   ```
   1. 왼쪽 메뉴: APIs & Services → OAuth consent screen
   2. User Type: External 선택
   3. 앱 정보 입력:
      - App name: Weave ERP
      - User support email: 개발자 이메일
      - Developer contact: 개발자 이메일
   4. 권한 범위 추가:
      - ../auth/userinfo.email
      - ../auth/userinfo.profile
      - openid
   5. 승인된 도메인 추가:
      - fsumnnfbywndjegrvtku.supabase.co
      - localhost (개발용)
   ```

3. **OAuth Client ID 생성**
   ```
   1. 왼쪽 메뉴: APIs & Services → Credentials
   2. + CREATE CREDENTIALS → OAuth client ID
   3. Application type: Web application
   4. Name: Weave ERP Web Client
   5. Authorized JavaScript origins:
      - http://localhost:3001 (개발용)
      - https://your-production-domain.com (프로덕션)
   6. Authorized redirect URIs:
      - https://fsumnnfbywndjegrvtku.supabase.co/auth/v1/callback
   ```

### 1.2 Supabase Dashboard 설정

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택: fsumnnfbywndjegrvtku

2. **Google Provider 활성화**
   ```
   1. 왼쪽 메뉴: Authentication → Providers
   2. Google 찾기 및 활성화
   3. 설정 입력:
      - Enable: ON
      - Client ID: Google Console에서 생성한 Client ID
      - Client Secret: Google Console에서 생성한 Client Secret
   4. Save 클릭
   ```

### 1.3 환경변수 추가 (선택사항)

```bash
# .env.local에 추가 (직접 사용하지 않지만 참고용)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🟡 2. 카카오톡 OAuth 설정

### 2.1 카카오 디벨로퍼스 설정

1. **카카오 디벨로퍼스 접속**
   - https://developers.kakao.com 방문
   - 카카오 계정으로 로그인

2. **애플리케이션 생성**
   ```
   1. "내 애플리케이션" → "애플리케이션 추가하기"
   2. 앱 이름: Weave ERP
   3. 사업자명: 본인 이름 또는 회사명
   ```

3. **플랫폼 설정**
   ```
   1. 앱 설정 → 플랫폼
   2. Web 플랫폼 등록:
      - 개발: http://localhost:3001
      - 운영: https://your-domain.com
   ```

4. **카카오 로그인 활성화**
   ```
   1. 제품 설정 → 카카오 로그인
   2. "카카오 로그인 활성화" ON
   3. Redirect URI 설정:
      - https://fsumnnfbywndjegrvtku.supabase.co/auth/v1/callback
   ```

5. **동의항목 설정**
   ```
   1. 제품 설정 → 카카오 로그인 → 동의항목
   2. 필수 동의항목:
      - 닉네임 (profile_nickname)
      - 카카오계정 (이메일) (account_email)
   ```

6. **보안 설정**
   ```
   1. 앱 설정 → 보안
   2. Client Secret 생성 및 활성화
   3. Client Secret 코드 복사하여 보관
   ```

### 2.2 Supabase Dashboard 설정

1. **Kakao Provider 활성화**
   ```
   1. Supabase Dashboard → Authentication → Providers
   2. Kakao 찾기 및 활성화
   3. 설정 입력:
      - Enable: ON
      - Client ID: 카카오 REST API 키
      - Client Secret: 카카오 Client Secret 코드
   4. Save 클릭
   ```

## 🧪 3. 테스트 절차

### 3.1 Google OAuth 테스트

1. **로컬 개발 서버에서 테스트**
   ```bash
   npm run dev
   # http://localhost:3001/auth/login 접속
   ```

2. **Google 로그인 버튼 클릭**
   - Google 동의 화면 표시 확인
   - 로그인 후 콜백 처리 확인
   - 대시보드 페이지 이동 확인

3. **Supabase Dashboard에서 사용자 확인**
   - Authentication → Users에서 생성된 사용자 확인

### 3.2 카카오톡 OAuth 테스트

1. **카카오톡 로그인 버튼 클릭**
   - 카카오 동의 화면 표시 확인
   - 로그인 후 콜백 처리 확인
   - 대시보드 페이지 이동 확인

2. **Supabase Dashboard에서 사용자 확인**
   - Authentication → Users에서 생성된 사용자 확인
   - 카카오톡 프로바이더로 생성되었는지 확인

## ⚙️ 4. 현재 코드 수정사항

### 4.1 즉시 적용 가능한 Google OAuth

현재 코드는 Google OAuth 연동 준비가 완료되어 있습니다:

```typescript
// src/lib/auth/auth-context.tsx - 이미 구현됨
const signInWithGoogle = async () => {
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
  // ...
};
```

### 4.2 카카오톡 OAuth 구현 완료

```typescript
// src/lib/auth/auth-context.tsx - 이미 구현됨
const signInWithKakao = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });
  // ...
};
```

## 🚀 5. 다음 단계

### 개발환경 설정 (즉시 실행 가능)
1. **Google Cloud Console에서 OAuth Client 생성**
2. **Supabase Dashboard에서 Google Provider 활성화**
3. **Google OAuth 테스트**

### 운영환경 설정
1. **카카오 디벨로퍼스 애플리케이션 등록**
2. **Supabase Dashboard에서 Kakao Provider 활성화**
3. **카카오톡 OAuth 테스트**
4. **운영 도메인에서 통합 테스트**

## 📞 지원

OAuth 설정 중 문제가 발생하면:
1. Supabase Dashboard의 Logs 확인
2. 브라우저 개발자 도구의 Network 탭 확인
3. 콜백 URL이 정확히 설정되었는지 확인

---

*작성일: 2024년 8월 21일*  
*OAuth 실제 연동 가이드*