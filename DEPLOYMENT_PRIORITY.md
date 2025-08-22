# 🎯 배포 우선순위 및 작업 계획

## 📊 현재 상태 분석

### ✅ 완료된 작업
1. **코드베이스 정리**
   - 중복 `.cursorrules` 파일 제거
   - 소셜 로그인 전용 시스템 구현
   - 릴리즈노트 자동화 시스템 구축

### 🔍 발견된 이슈
1. **중복 코드**: `.cursor/rules/.cursorrules` 제거 완료
2. **환경 설정**: 개발/운영 환경 분리 필요
3. **OAuth 설정**: Google, Kakao 프로덕션 설정 미완료

---

## 🚀 작업 우선순위

### 🔴 Priority 1: OAuth 설정 (즉시 필요)

#### Google OAuth 설정
**개발 환경**:
```
Client ID: [YOUR_DEV_CLIENT_ID]
Redirect URI: http://localhost:3000/auth/callback
```

**운영 환경**:
```
Client ID: [YOUR_PROD_CLIENT_ID]
Redirect URI: https://weave.example.com/auth/callback
```

**필요 작업**:
1. Google Cloud Console에서 OAuth 2.0 클라이언트 생성
2. 승인된 JavaScript 출처 추가
3. 승인된 리디렉션 URI 설정
4. Supabase Dashboard에 Client ID/Secret 입력

#### Kakao OAuth 설정
**개발 환경**:
```
REST API 키: [YOUR_DEV_REST_KEY]
Redirect URI: http://localhost:3000/auth/callback
```

**운영 환경**:
```
REST API 키: [YOUR_PROD_REST_KEY]
Redirect URI: https://weave.example.com/auth/callback
```

**필요 작업**:
1. Kakao Developers에서 애플리케이션 생성
2. 플랫폼 설정 (Web 플랫폼 등록)
3. Redirect URI 등록
4. 카카오 로그인 활성화
5. Supabase Dashboard에 설정 입력

---

### 🟡 Priority 2: 환경 분리 (1-2일 내)

#### 환경 구성
```
개발(Development): localhost:3000
검증(Staging): staging.weave.com
운영(Production): weave.com
```

#### 환경변수 파일 구조
```
.env.development    # 개발 환경
.env.staging       # 검증 환경
.env.production    # 운영 환경
```

#### Supabase 프로젝트 분리
1. **개발 프로젝트**: 무료 플랜, 테스트 데이터
2. **검증 프로젝트**: 무료 플랜, 실제 데이터 복사본
3. **운영 프로젝트**: Pro 플랜, 실제 데이터

---

### 🟠 Priority 3: 배포 파이프라인 (3-5일 내)

#### Vercel 배포 설정
```yaml
# 브랜치별 자동 배포
main → production (weave.com)
staging → staging (staging.weave.com)
develop → preview (*.vercel.app)
```

#### GitHub Actions CI/CD
```yaml
name: Deploy Pipeline
on:
  push:
    branches: [main, staging, develop]

jobs:
  test:
    - npm run test
    - npm run lint
    - npm run type-check
  
  deploy:
    - Vercel deployment
    - Environment-specific vars
```

---

## 📅 실행 타임라인

### Week 1 (즉시)
- [ ] Google OAuth 개발/운영 설정
- [ ] Kakao OAuth 개발/운영 설정
- [ ] Supabase Dashboard 설정 완료

### Week 2 (다음 주)
- [ ] 환경별 .env 파일 생성
- [ ] Supabase 프로젝트 분리
- [ ] Vercel 프로젝트 설정

### Week 3 (2주 후)
- [ ] GitHub Actions 설정
- [ ] 자동 테스트 파이프라인
- [ ] 모니터링 도구 설정

---

## ⚙️ 환경별 설정 체크리스트

### 개발 환경 (Development)
- [x] 로컬 개발 서버 설정
- [ ] Google OAuth 로컬 설정
- [ ] Kakao OAuth 로컬 설정
- [ ] Supabase 개발 프로젝트

### 검증 환경 (Staging)
- [ ] Vercel Preview 배포
- [ ] Google OAuth 스테이징 설정
- [ ] Kakao OAuth 스테이징 설정
- [ ] Supabase 스테이징 프로젝트

### 운영 환경 (Production)
- [ ] Vercel Production 배포
- [ ] Google OAuth 프로덕션 설정
- [ ] Kakao OAuth 프로덕션 설정
- [ ] Supabase Pro 프로젝트
- [ ] 도메인 연결
- [ ] SSL 인증서
- [ ] CDN 설정

---

## 🔐 보안 체크리스트

### 환경변수 보안
- [ ] .env 파일 .gitignore 등록
- [ ] Vercel 환경변수 설정
- [ ] GitHub Secrets 설정

### OAuth 보안
- [ ] Client Secret 안전한 저장
- [ ] Redirect URI 검증
- [ ] CORS 설정

### 데이터베이스 보안
- [ ] Row Level Security (RLS) 활성화
- [ ] API 키 권한 최소화
- [ ] 백업 정책 수립

---

## 📝 다음 단계 액션 아이템

1. **즉시 시작**: Google Cloud Console 접속 → OAuth 설정
2. **오늘 내 완료**: Kakao Developers 접속 → 앱 생성
3. **이번 주 완료**: 환경별 .env 파일 생성
4. **다음 주 시작**: Vercel 프로젝트 설정

---

_마지막 업데이트: 2025-08-21_
_작성자: Claude Code Architecture System_