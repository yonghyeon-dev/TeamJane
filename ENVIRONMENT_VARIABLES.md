# 환경변수 설정 가이드

Weave 프로젝트의 환경변수 설정 및 관리 가이드입니다.

## 📋 필수 환경변수

### 개발환경 (.env.local)

```env
# Supabase 기본 설정
NEXT_PUBLIC_SUPABASE_URL=https://fsumnnfbywndjegrvtku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Next.js 설정
NEXTAUTH_SECRET=your-nextauth-secret-for-development
NEXTAUTH_URL=http://localhost:3001

# 앱 URL 설정
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Google OAuth (Supabase Dashboard에서 설정)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# 카카오톡 OAuth (Supabase Dashboard에서 설정)
# NEXT_PUBLIC_KAKAO_CLIENT_ID=your-kakao-client-id

# 개발 환경 플래그
NODE_ENV=development
```

### 운영환경 (.env.production)

```env
# Supabase 기본 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Next.js 설정
NEXTAUTH_SECRET=your-secure-nextauth-secret-for-production
NEXTAUTH_URL=https://your-domain.com

# 앱 URL 설정
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 운영 환경 플래그
NODE_ENV=production
```

## 🔐 환경변수 상세 설명

### Supabase 관련

| 변수명 | 설명 | 필수여부 | 예시 |
|--------|------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ | `https://abcdefg.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | ✅ | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 | ⚠️ | `eyJhbGciOiJIUzI1NiIs...` |

> **⚠️ 주의**: `SUPABASE_SERVICE_ROLE_KEY`는 서버사이드에서만 사용되며 클라이언트에 노출되면 안됩니다.

### Next.js 관련

| 변수명 | 설명 | 필수여부 | 예시 |
|--------|------|----------|------|
| `NEXTAUTH_SECRET` | NextAuth.js 암호화 시크릿 | ✅ | `your-secret-key` |
| `NEXTAUTH_URL` | NextAuth.js 기본 URL | ✅ | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | 앱의 기본 URL | ✅ | `http://localhost:3001` |
| `NODE_ENV` | 환경 모드 | ✅ | `development` / `production` |

### OAuth 관련 (선택사항)

| 변수명 | 설명 | 필수여부 | 설정 위치 |
|--------|------|----------|----------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | ❌ | Supabase Dashboard |
| `NEXT_PUBLIC_KAKAO_CLIENT_ID` | 카카오톡 OAuth 클라이언트 ID | ❌ | Supabase Dashboard |

> **📝 참고**: OAuth 설정은 주로 Supabase Dashboard에서 관리됩니다.

## 🔧 환경별 설정 방법

### 개발환경 설정

1. **로컬 환경변수 파일 생성**
   ```bash
   # 프로젝트 루트에서 실행
   cp .env.local.example .env.local
   ```

2. **필수 값 입력**
   - `.env.local` 파일을 열어 Supabase 프로젝트 정보 입력
   - `NEXTAUTH_SECRET` 생성: `openssl rand -base64 32`

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

### 운영환경 설정 (Vercel)

1. **Vercel Dashboard 설정**
   - Project → Settings → Environment Variables
   - Production 환경에 필요한 모든 변수 추가

2. **도메인 설정**
   - `NEXT_PUBLIC_APP_URL`을 실제 도메인으로 설정
   - `NEXTAUTH_URL`도 동일하게 설정

3. **보안 강화**
   - `NEXTAUTH_SECRET`을 새로운 안전한 값으로 생성
   - 모든 키를 새로 발급받아 사용

## 🔒 보안 고려사항

### 중요 원칙

1. **환경변수 분리**
   ```
   ✅ 개발환경: .env.local
   ✅ 운영환경: Vercel Environment Variables
   ❌ 코드에 직접 하드코딩
   ```

2. **접두사 규칙**
   ```
   ✅ NEXT_PUBLIC_*: 클라이언트에서 접근 가능
   ✅ *: 서버사이드에서만 접근 가능
   ```

3. **민감한 정보 보호**
   - `.env.local`을 `.gitignore`에 추가 (이미 추가됨)
   - Service Role Key는 절대 클라이언트에 노출 금지
   - 운영환경에서는 모든 키를 새로 발급

### .gitignore 확인

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🔍 환경변수 검증

### 개발환경 검증 스크립트

```javascript
// 브라우저 콘솔에서 실행
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL);
console.log('Environment:', process.env.NODE_ENV);

// 민감한 정보는 서버사이드에서만 확인
// console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY); // ❌ 금지
```

### 서버사이드 검증

```typescript
// pages/api/check-env.ts (개발용)
export default function handler(req: any, res: any) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not found' });
  }
  
  res.json({
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
}
```

## ⚡ 자주 발생하는 문제

### 1. Supabase 연결 실패

**증상**: "Supabase not configured" 오류

**해결방법**:
```bash
# 환경변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 개발 서버 재시작
npm run dev
```

### 2. OAuth 리디렉션 오류

**증상**: OAuth 후 콜백 실패

**해결방법**:
- `NEXT_PUBLIC_APP_URL` 확인
- OAuth 설정의 Redirect URI와 일치하는지 확인

### 3. NextAuth 세션 오류

**증상**: 세션 관련 오류

**해결방법**:
```bash
# 새로운 시크릿 생성
openssl rand -base64 32

# NEXTAUTH_SECRET에 설정 후 서버 재시작
```

## 📝 체크리스트

### 개발환경 설정 완료

- [ ] `.env.local` 파일 생성
- [ ] Supabase URL 및 키 설정
- [ ] NEXTAUTH_SECRET 생성
- [ ] 앱 URL 설정
- [ ] 개발 서버 정상 실행
- [ ] OAuth 로그인 테스트

### 운영환경 배포 완료

- [ ] Vercel 환경변수 설정
- [ ] 운영 도메인 설정
- [ ] 새로운 보안 키 생성
- [ ] OAuth 설정 업데이트
- [ ] 운영 환경에서 로그인 테스트
- [ ] HTTPS 인증서 확인

---

**마지막 업데이트**: 2024년 8월 21일  
**버전**: 2.0.0 (소셜 로그인 전용)