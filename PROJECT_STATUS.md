# 📊 WEAVE 프로젝트 현재 상태 보고서

> 이 문서는 Opus와 Sonnet 모델 간 컨텍스트 공유를 위해 작성되었습니다.
> 마지막 업데이트: 2025-08-21 17:00 KST

## 🎯 프로젝트 개요

### 기본 정보
- **프로젝트명**: WEAVE ERP
- **설명**: 프리랜서를 위한 올인원 워크스페이스
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Supabase
- **GitHub**: https://github.com/yonghyeon-dev/TeamJane.git
- **현재 브랜치**: main

### 프로젝트 목표
- 프리랜서를 위한 통합 업무 관리 시스템
- 프로젝트, 인보이스, 문서, 클라이언트 관리
- 소셜 로그인 전용 인증 시스템 (Google, Kakao)

---

## 🚀 배포 현황

### Vercel 배포
- **상태**: ✅ 배포됨 (추정)
- **개발 환경**: localhost:3001
- **운영 환경**: 미확인 (Vercel Dashboard 확인 필요)
- **배포 명령어**: 
  - `npm run deploy` (프로덕션)
  - `npm run deploy:preview` (프리뷰)

### Supabase 프로젝트
**현재 2개의 프로젝트 운영 중:**

#### 1. 개발 환경 (Weave ERP Development)
```
Project ID: fsumnnfbywndjegrvtku
Region: ap-northeast-2 (서울)
Status: ACTIVE_HEALTHY
생성일: 2025-08-21
URL: https://fsumnnfbywndjegrvtku.supabase.co
```

#### 2. 운영 환경 (yonghyeon-dev's Project)
```
Project ID: nmwvuxfhyroxczfsrgdn
Region: ap-northeast-2 (서울)
Status: ACTIVE_HEALTHY
생성일: 2025-08-12
URL: https://nmwvuxfhyroxczfsrgdn.supabase.co
```

---

## 🔐 인증 시스템 현황

### 현재 구현 상태
- **이메일/비밀번호 인증**: ❌ 제거됨
- **Google OAuth**: ✅ 구현 완료 (설정 필요)
- **Kakao OAuth**: ✅ 구현 완료 (설정 필요)
- **Naver OAuth**: ❌ 제거됨

### OAuth 설정 상태
| Provider | 코드 구현 | Supabase 설정 | 테스트 |
|----------|----------|---------------|--------|
| Google   | ✅ 완료   | ⏳ 필요        | ⏳ 대기 |
| Kakao    | ✅ 완료   | ⏳ 필요        | ⏳ 대기 |

### 관련 파일
- `/src/lib/auth/auth-context.tsx` - 인증 컨텍스트
- `/src/components/auth/AuthForm.tsx` - 로그인 폼
- `/src/components/ui/GoogleSignInButton.tsx` - Google 로그인 버튼
- `/src/components/ui/KakaoSignInButton.tsx` - Kakao 로그인 버튼
- `/src/app/auth/callback/route.ts` - OAuth 콜백 처리

---

## 🔧 환경변수 설정 현황

### 파일 구조
```
✅ .env.development    (개발용)
✅ .env.production     (운영용)
✅ .env.local         (로컬 개발)
✅ .env.example       (템플릿)
✅ .env.production.example (운영 템플릿)
```

### 현재 .env.local 설정
- **Supabase URL**: fsumnnfbywndjegrvtku (개발 프로젝트)
- **포트**: 3001
- **환경**: development
- **OAuth 키**: Supabase Dashboard에서 관리 (주석 처리됨)

---

## 📁 프로젝트 구조

### 주요 디렉토리
```
/src
  /app              - Next.js 14 App Router
    /auth           - 인증 관련 라우트
    /dashboard      - 대시보드
    /projects       - 프로젝트 관리
    /invoices       - 인보이스 관리
    /documents      - 문서 관리
    /clients        - 클라이언트 관리
  /components       
    /ui             - UI 컴포넌트 라이브러리
    /auth           - 인증 컴포넌트
    /layout         - 레이아웃 컴포넌트
    /forms          - 폼 컴포넌트
  /lib
    /auth           - 인증 로직
    /theme          - 테마 시스템
    /utils          - 유틸리티 함수
  /stores           - Zustand 상태 관리
```

---

## 📝 최근 작업 내역

### 2025-08-21 완료 사항
1. ✅ 소셜 로그인 전용 시스템 구현
   - 이메일 인증 완전 제거
   - Google/Kakao OAuth 구현
   
2. ✅ 문서화 작업
   - OAUTH_SETUP_GUIDE.md
   - ENVIRONMENT_VARIABLES.md
   - GOOGLE_OAUTH_COMPLETE_GUIDE.md
   - ENVIRONMENT_SETUP_GUIDE.md
   - DEPLOYMENT_PRIORITY.md
   - RELEASE_AUTOMATION_GUIDE.md

3. ✅ 릴리즈노트 자동화
   - release-cursor.sh 스크립트
   - Cursor AI 연동
   - 자동 버전 관리

4. ✅ 코드베이스 정리
   - 중복 .cursorrules 파일 제거
   - 프로젝트 구조 최적화

---

## 🎯 다음 작업 우선순위

### 🔴 즉시 필요 (Priority 1)
1. **Google OAuth 설정**
   - Google Cloud Console에서 OAuth 2.0 클라이언트 생성
   - Supabase Dashboard에 Client ID/Secret 입력
   - localhost:3001 리디렉션 URI 설정

2. **Kakao OAuth 설정**
   - Kakao Developers에서 앱 생성
   - REST API 키 발급
   - Supabase Dashboard 설정

### 🟡 1-2일 내 (Priority 2)
1. **환경 분리 완성**
   - 개발/운영 Supabase 프로젝트 설정 동기화
   - 환경별 환경변수 검증

2. **테스트 환경 구축**
   - E2E 테스트 설정
   - OAuth 플로우 테스트

### 🟠 3-5일 내 (Priority 3)
1. **Vercel 배포 파이프라인**
   - GitHub Actions CI/CD
   - 자동 배포 설정

2. **모니터링 설정**
   - 에러 트래킹
   - 성능 모니터링

---

## 🐛 알려진 이슈

### 현재 이슈
1. **OAuth 미설정**: Google/Kakao OAuth 프로바이더 설정 필요
2. **포트 불일치**: .env.local은 3001, 일부 문서는 3000 참조
3. **Service Role Key 혼재**: 개발/운영 키가 섞여있을 가능성

### 해결 필요 사항
- [ ] Supabase Dashboard에서 OAuth 프로바이더 활성화
- [ ] 포트 번호 통일 (3000 또는 3001)
- [ ] 환경별 Service Role Key 분리

---

## 💡 중요 참고사항

### Supabase 프로젝트 매핑
- **개발**: fsumnnfbywndjegrvtku (2025-08-21 생성)
- **운영**: nmwvuxfhyroxczfsrgdn (2025-08-12 생성)

### 모델 간 공유 시 주의사항
1. 이 문서는 Opus ↔ Sonnet 간 컨텍스트 유지용
2. 환경변수의 민감한 정보는 키 일부만 표시
3. 작업 진행 시 이 문서 업데이트 필수

### Git 커밋 규칙
```bash
git commit -m "[type]: [설명]

[상세 내용]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 📊 프로젝트 통계

- **총 커밋 수**: 약 50+ (추정)
- **주요 기여자**: yonghyeon-dev, Claude Code
- **시작일**: 2025-08-12
- **최근 업데이트**: 2025-08-21
- **코드 라인 수**: 10,000+ (추정)

---

## 🔄 업데이트 로그

### 2025-08-21 17:00
- 프로젝트 현재 상태 전체 분석
- Supabase 프로젝트 2개 확인
- 환경변수 파일 구조 파악
- OAuth 구현 상태 확인

---

## 📌 Quick Reference

### 개발 서버 실행
```bash
npm run dev
# http://localhost:3001
```

### 릴리즈노트 업데이트
```bash
./release-cursor.sh --auto-commit
# Cursor Composer: "릴리즈노트 업데이트"
```

### Supabase 프로젝트 URL
- 개발: https://fsumnnfbywndjegrvtku.supabase.co
- 운영: https://nmwvuxfhyroxczfsrgdn.supabase.co

---

_이 문서는 모델 전환 시 컨텍스트 유지를 위해 작성되었습니다._
_Opus ↔ Sonnet 전환 시 이 문서를 참조하세요._