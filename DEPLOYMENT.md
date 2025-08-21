# 배포 가이드 (Deployment Guide)

## Vercel 배포 설정

### 환경 변수 설정

Vercel 프로젝트 설정에서 다음 환경 변수들을 설정해야 합니다:

#### 필수 환경 변수

1. **Supabase 설정**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **앱 URL 설정**
   ```
   NEXT_PUBLIC_APP_URL=https://weave-erp.vercel.app
   ```

3. **NextAuth 설정**
   ```
   NEXTAUTH_SECRET=your-production-secret-min-32-chars
   NEXTAUTH_URL=https://weave-erp.vercel.app
   ```

4. **환경 구분**
   ```
   NODE_ENV=production
   ```

### Vercel 환경 변수 설정 방법

1. **Vercel 대시보드**에서 프로젝트 선택
2. **Settings** → **Environment Variables** 이동
3. 위의 환경 변수들을 **Production** 환경에 추가

### Supabase 인증 설정

#### 1. Allowed Redirect URLs 설정
Supabase 프로젝트 설정에서 다음 URL들을 허용해야 합니다:

```
# 개발 환경
http://localhost:3000/auth/callback

# 운영 환경
https://weave-erp.vercel.app/auth/callback
```

**설정 방법:**
1. Supabase 대시보드 → Authentication → URL Configuration
2. **Redirect URLs**에 위 URL들 추가

#### 2. Site URL 설정
```
# 개발 환경
http://localhost:3000

# 운영 환경
https://weave-erp.vercel.app
```

**설정 방법:**
1. Supabase 대시보드 → Authentication → URL Configuration
2. **Site URL**을 운영 환경 URL로 설정

### 배포 프로세스

#### 자동 배포 (권장)
1. **GitHub 연동**: Vercel과 GitHub 리포지토리 연동
2. **자동 배포**: `main` 브랜치 푸시 시 자동 배포
3. **Preview 배포**: Pull Request 생성 시 미리보기 배포

#### 수동 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel --prod
```

### 환경별 설정 확인

#### 개발 환경 확인
```bash
npm run dev
```
- URL: http://localhost:3000
- 이메일 인증: 우회 가능
- 로그 레벨: 상세

#### 운영 환경 확인
```bash
npm run build
npm run start
```
- URL: https://weave-erp.vercel.app
- 이메일 인증: 필수
- 로그 레벨: 최소

### 문제 해결

#### 로그인 실패 시
1. **환경 변수 확인**: Vercel 환경 변수가 올바르게 설정되었는지 확인
2. **Supabase URL 확인**: Redirect URLs와 Site URL이 정확한지 확인
3. **콘솔 확인**: 브라우저 개발자 도구에서 오류 메시지 확인

#### 이메일 인증 실패 시
1. **Redirect URL**: Supabase에서 콜백 URL이 허용되었는지 확인
2. **이메일 템플릿**: Supabase 이메일 템플릿의 링크가 올바른지 확인
3. **스팸 폴더**: 사용자에게 스팸 폴더 확인 안내

### 보안 고려사항

#### 환경 변수 보안
- **NEXTAUTH_SECRET**: 최소 32자 이상의 강력한 랜덤 문자열 사용
- **API 키**: 프로덕션용 키와 개발용 키 분리
- **URL 검증**: 허용된 도메인만 Supabase에 등록

#### HTTPS 강제
- 운영 환경에서는 모든 트래픽이 HTTPS로 리다이렉트됨
- Vercel에서 자동으로 SSL 인증서 제공

### 모니터링

#### Vercel Analytics
```bash
# Vercel Analytics 추가
npm install @vercel/analytics
```

#### 로그 모니터링
- Vercel Functions 로그에서 서버 사이드 오류 확인
- 브라우저 콘솔에서 클라이언트 사이드 오류 확인

### 성능 최적화

#### 빌드 최적화
```json
// next.config.js
{
  "output": "standalone",
  "experimental": {
    "outputFileTracingRoot": "."
  }
}
```

#### 이미지 최적화
- Next.js Image 컴포넌트 사용
- Vercel에서 자동 이미지 최적화 제공

---

**배포 체크리스트:**
- [ ] Vercel 환경 변수 설정 완료
- [ ] Supabase Redirect URLs 설정 완료
- [ ] Supabase Site URL 설정 완료
- [ ] 운영 환경에서 로그인/회원가입 테스트 완료
- [ ] 이메일 인증 플로우 테스트 완료
- [ ] HTTPS 접속 확인 완료