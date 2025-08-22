# 🎯 환경별 OAuth 설정 가이드

## 📊 환경 구성 전략

### 왜 환경을 분리해야 하나요?
1. **개발 환경**: 로컬에서 테스트 및 개발
2. **스테이징 환경**: 배포 전 최종 테스트
3. **운영 환경**: 실제 사용자가 사용하는 서비스

### 환경별 도메인
```
개발: http://localhost:3000
스테이징: https://staging-weave.vercel.app
운영: https://weave.com (또는 your-domain.com)
```

---

## 🟢 STEP 1: 개발 환경 설정 (먼저 진행!)

### 1-1. Supabase 개발 프로젝트 생성
1. [Supabase](https://app.supabase.com) 로그인
2. "New Project" 클릭
3. 프로젝트 정보:
   ```
   Name: weave-dev
   Database Password: [안전한 비밀번호]
   Region: Northeast Asia (Seoul)
   Plan: Free tier
   ```
4. "Create new project" 클릭

### 1-2. Google Cloud Console - 개발용 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성: `Weave-Development`
3. OAuth 동의 화면:
   - User Type: **External**
   - 앱 이름: `Weave (Development)`
   - 테스트 사용자 추가 (본인 이메일)

4. OAuth 2.0 클라이언트 ID 생성:
   ```
   애플리케이션 유형: 웹 애플리케이션
   이름: Weave Dev Client
   
   승인된 JavaScript 출처:
   - http://localhost:3000
   - http://localhost:3001
   - http://127.0.0.1:3000
   
   승인된 리디렉션 URI:
   - http://localhost:3000/auth/callback
   - https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
   ```

### 1-3. Kakao Developers - 개발용 설정
1. [Kakao Developers](https://developers.kakao.com) 로그인
2. "애플리케이션 추가하기"
3. 앱 정보:
   ```
   앱 이름: Weave Dev
   회사명: (선택사항)
   ```
4. 플랫폼 설정 → Web:
   ```
   사이트 도메인:
   - http://localhost:3000
   - http://localhost:3001
   ```
5. 카카오 로그인 → Redirect URI:
   ```
   http://localhost:3000/auth/callback
   https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
   ```

### 1-4. 개발 환경 .env.local 파일
```env
# Supabase Dev
NEXT_PUBLIC_SUPABASE_URL=https://[DEV-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[DEV-ANON-KEY]

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1-5. Supabase Dashboard 설정
1. Authentication → Providers
2. **Google** 활성화:
   ```
   Client ID: [Google Console에서 복사]
   Client Secret: [Google Console에서 복사]
   ```
3. **Kakao** 활성화:
   ```
   Client ID: [Kakao REST API 키]
   Client Secret: [Kakao Client Secret]
   ```

---

## 🟡 STEP 2: 스테이징 환경 설정 (개발 완료 후)

### 2-1. Supabase 스테이징 프로젝트
1. 새 프로젝트 생성: `weave-staging`
2. 개발과 동일한 설정 복사
3. 테스트 데이터만 포함

### 2-2. Google Cloud Console - 스테이징용
1. 동일 프로젝트에서 새 OAuth 클라이언트 생성
2. 이름: `Weave Staging Client`
3. 리디렉션 URI:
   ```
   https://staging-weave.vercel.app/auth/callback
   ```

### 2-3. Vercel 스테이징 배포
```bash
# staging 브랜치 생성
git checkout -b staging
git push origin staging

# Vercel에서 staging 브랜치 연결
```

### 2-4. 스테이징 환경변수 (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[STAGING-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[STAGING-ANON-KEY]
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_APP_URL=https://staging-weave.vercel.app
```

---

## 🔴 STEP 3: 운영 환경 설정 (최종 단계)

### 3-1. Supabase Pro 프로젝트
1. 새 프로젝트 생성: `weave-production`
2. **Pro Plan** 업그레이드 (필요시)
3. Production 보안 설정 강화

### 3-2. Google Cloud Console - 운영용
1. **별도 프로젝트 생성**: `Weave-Production`
2. OAuth 동의 화면:
   - 앱 검증 프로세스 진행
   - 프로덕션 정보 입력
3. OAuth 클라이언트:
   ```
   이름: Weave Production
   
   승인된 JavaScript 출처:
   - https://weave.com
   - https://www.weave.com
   
   리디렉션 URI:
   - https://weave.com/auth/callback
   - https://[PROD-SUPABASE].supabase.co/auth/v1/callback
   ```

### 3-3. 도메인 & SSL 설정
1. 도메인 구매/연결
2. Vercel에 커스텀 도메인 추가
3. SSL 인증서 자동 발급

### 3-4. 운영 환경변수 (Vercel Production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROD-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PROD-ANON-KEY]
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://weave.com
```

---

## 🔧 코드에서 환경 분기 처리

### auth-context.tsx 환경별 처리
```typescript
const getBaseUrl = () => {
  // 환경변수 우선
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // 환경별 기본값
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  
  switch (environment) {
    case 'production':
      return 'https://weave.com';
    case 'staging':
      return 'https://staging-weave.vercel.app';
    default:
      return 'http://localhost:3000';
  }
};
```

---

## ✅ 환경별 체크리스트

### 개발 환경 (지금 진행!)
- [ ] Supabase 개발 프로젝트 생성
- [ ] Google OAuth 개발용 클라이언트 생성
- [ ] Kakao OAuth 개발용 앱 생성
- [ ] .env.local 파일 설정
- [ ] localhost:3000에서 테스트

### 스테이징 환경 (다음 단계)
- [ ] Supabase 스테이징 프로젝트 생성
- [ ] OAuth 스테이징 클라이언트 추가
- [ ] Vercel staging 브랜치 배포
- [ ] 스테이징 URL에서 테스트

### 운영 환경 (최종 단계)
- [ ] Supabase Pro 프로젝트 생성
- [ ] OAuth 운영 클라이언트 생성
- [ ] 도메인 연결
- [ ] 운영 배포 및 모니터링

---

## 🚨 중요 보안 사항

### 절대 하지 말아야 할 것
1. ❌ 운영 키를 개발 환경에 사용
2. ❌ .env 파일을 Git에 커밋
3. ❌ Client Secret을 프론트엔드 코드에 포함

### 반드시 해야 할 것
1. ✅ 환경별로 별도의 OAuth 클라이언트 생성
2. ✅ 환경별로 별도의 Supabase 프로젝트 사용
3. ✅ 환경변수는 배포 플랫폼에서 관리

---

## 📝 다음 액션

### 지금 바로 (개발 환경):
1. Supabase에서 `weave-dev` 프로젝트 생성
2. Google Cloud Console에서 개발용 OAuth 설정
3. .env.local 파일 생성
4. npm run dev로 테스트

### 개발 완료 후:
1. 스테이징 환경 구축
2. QA 테스트
3. 운영 환경 준비

---

_마지막 업데이트: 2025-08-21_
_작성자: Claude Code Environment Architecture_