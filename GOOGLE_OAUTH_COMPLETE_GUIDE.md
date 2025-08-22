# 🔵 Google OAuth 완벽 설정 가이드

## 📋 사전 준비사항
- Google 계정
- Google Cloud Console 접속 권한
- Supabase 프로젝트

---

## 1️⃣ Google Cloud Console 설정

### Step 1: 프로젝트 생성/선택
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단 프로젝트 선택 드롭다운 클릭
3. "새 프로젝트" 클릭
4. 프로젝트 정보 입력:
   - **프로젝트 이름**: `Weave-OAuth`
   - **조직**: 선택사항
   - **위치**: 선택사항
5. "만들기" 클릭

### Step 2: OAuth 동의 화면 구성
1. 좌측 메뉴 → "API 및 서비스" → "OAuth 동의 화면"
2. User Type 선택:
   - **외부(External)** 선택 (일반 사용자용)
   - "만들기" 클릭

3. 앱 정보 입력:
   ```
   앱 이름: Weave
   사용자 지원 이메일: your-email@gmail.com
   앱 로고: (선택사항)
   ```

4. 앱 도메인 (운영 환경용):
   ```
   홈페이지: https://weave.example.com
   개인정보처리방침: https://weave.example.com/privacy
   서비스 약관: https://weave.example.com/terms
   ```

5. 개발자 연락처 정보:
   ```
   이메일 주소: developer@example.com
   ```

6. "저장 후 계속" 클릭

### Step 3: 범위(Scopes) 설정
1. "범위 추가 또는 삭제" 클릭
2. 다음 범위 선택:
   - `.../auth/userinfo.email` (이메일 주소 보기)
   - `.../auth/userinfo.profile` (개인정보 보기)
3. "업데이트" 클릭
4. "저장 후 계속" 클릭

### Step 4: 테스트 사용자 (개발 단계)
1. "ADD USERS" 클릭
2. 테스트할 이메일 주소 입력
3. "추가" 클릭
4. "저장 후 계속" 클릭

---

## 2️⃣ OAuth 2.0 클라이언트 ID 생성

### 개발 환경용 클라이언트

1. 좌측 메뉴 → "API 및 서비스" → "사용자 인증 정보"
2. 상단 "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `Weave Development`

5. **승인된 JavaScript 출처** (개발):
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   ```

6. **승인된 리디렉션 URI** (개발):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   http://127.0.0.1:3000/auth/callback
   ```

7. "만들기" 클릭
8. **클라이언트 ID와 클라이언트 Secret 저장** (중요!)

### 운영 환경용 클라이언트

1. 동일한 과정 반복
2. 이름: `Weave Production`

3. **승인된 JavaScript 출처** (운영):
   ```
   https://weave.example.com
   https://www.weave.example.com
   ```

4. **승인된 리디렉션 URI** (운영):
   ```
   https://weave.example.com/auth/callback
   https://www.weave.example.com/auth/callback
   ```

---

## 3️⃣ Supabase Dashboard 설정

### Step 1: Supabase 프로젝트 접속
1. [Supabase Dashboard](https://app.supabase.com) 로그인
2. 프로젝트 선택

### Step 2: Google Provider 설정
1. 좌측 메뉴 → "Authentication" → "Providers"
2. "Google" 찾기 → "Enable" 토글 ON

3. 설정 입력:
   ```
   Client ID: [Google Cloud Console에서 복사한 Client ID]
   Client Secret: [Google Cloud Console에서 복사한 Client Secret]
   ```

4. **Authorized Client IDs** (선택사항):
   - 추가 보안을 위해 Client ID 재입력

5. "Save" 클릭

### Step 3: Redirect URLs 확인
Supabase가 제공하는 Callback URL 확인:
```
https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
```

이 URL을 Google Cloud Console의 승인된 리디렉션 URI에 추가해야 할 수도 있습니다.

---

## 4️⃣ 환경변수 설정

### 개발 환경 (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Google OAuth (Supabase가 자동 처리)
# Client ID/Secret은 Supabase Dashboard에서 관리
```

### 운영 환경 (.env.production)
```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://[PROD_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PROD_ANON_KEY]
```

---

## 5️⃣ 코드 구현 확인

### auth-context.tsx 확인
```typescript
const signInWithGoogle = async () => {
  const baseUrl = getBaseUrl();
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
  
  if (error) {
    console.error('Google 로그인 오류:', error);
    return;
  }
  
  if (data.url) {
    return { provider: 'google', url: data.url };
  }
};
```

### GoogleSignInButton.tsx 확인
```typescript
const handleSignIn = async () => {
  setIsLoading(true);
  try {
    const result = await signInWithGoogle();
    if (result?.url) {
      window.location.href = result.url;
    }
  } catch (error) {
    console.error('로그인 실패:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6️⃣ 테스트 체크리스트

### 개발 환경 테스트
- [ ] localhost:3000에서 Google 로그인 버튼 클릭
- [ ] Google 계정 선택 화면 표시 확인
- [ ] 권한 동의 화면 표시 확인
- [ ] 로그인 후 /dashboard로 리디렉션 확인
- [ ] 사용자 정보 표시 확인

### 디버깅 체크리스트
- [ ] 브라우저 콘솔에 에러 없음
- [ ] Network 탭에서 OAuth 요청 확인
- [ ] Supabase Dashboard에서 사용자 생성 확인

---

## 7️⃣ 일반적인 문제 해결

### Error: "redirect_uri_mismatch"
**원인**: Google Console의 리디렉션 URI와 실제 요청 URI 불일치
**해결**: 
1. 에러 메시지의 정확한 URI 확인
2. Google Console에 동일한 URI 추가
3. http/https, www 유무, 포트 번호 확인

### Error: "401 Unauthorized"
**원인**: Client ID/Secret 불일치
**해결**:
1. Google Console에서 Client ID/Secret 재확인
2. Supabase Dashboard에 정확히 입력
3. 저장 후 몇 분 대기 (캐시 갱신)

### Error: "Access blocked"
**원인**: OAuth 동의 화면 미승인
**해결**:
1. 개발 중: 테스트 사용자 추가
2. 운영: 앱 검증 프로세스 진행

---

## 8️⃣ 운영 배포 체크리스트

### Google Cloud Console
- [ ] OAuth 동의 화면 "게시" 상태로 변경
- [ ] 운영 도메인으로 JavaScript 출처 업데이트
- [ ] 운영 도메인으로 리디렉션 URI 업데이트
- [ ] 앱 검증 프로세스 완료 (필요시)

### Supabase Dashboard
- [ ] Production 프로젝트에 Google Provider 설정
- [ ] Client ID/Secret 운영용으로 업데이트

### Vercel/배포 플랫폼
- [ ] 환경변수 설정
- [ ] 도메인 연결
- [ ] SSL 인증서 확인

---

## 📚 참고 자료
- [Google OAuth 2.0 공식 문서](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js 환경변수 문서](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🆘 추가 지원
문제가 발생하면 다음 정보와 함께 문의:
1. 브라우저 콘솔 에러 메시지
2. Network 탭 스크린샷
3. Supabase Dashboard Auth 로그
4. Google Cloud Console 설정 스크린샷

---

_마지막 업데이트: 2025-08-21_
_작성자: Claude Code OAuth System_