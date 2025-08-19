# WEAVE - 프리랜서를 위한 올인원 워크스페이스

> **흩어진 당신의 업무를 하나로 엮다**

WEAVE는 프리랜서를 위한 통합 ERP(전사적 자원 관리) 시스템으로, 프로젝트 관리부터 문서 생성, 재무 관리까지 모든 비즈니스 활동을 하나의 플랫폼에서 관리할 수 있도록 설계되었습니다.

## 🚀 주요 기능

### 📊 통합 대시보드

- 실시간 수익 현황 및 프로젝트 진행률 시각화
- 월간/분기별 수입 분석 및 예측
- 미수금 현황 및 입금 예정일 관리
- 커스터마이징 가능한 위젯 시스템

### 👥 클라이언트 관리

- 고객사 정보 및 담당자 연락처 통합 관리
- 프로젝트별 커뮤니케이션 히스토리 추적
- 클라이언트별 수익 분석 및 성과 지표
- 자동 리마인더 및 팔로우업 시스템

### 📁 프로젝트 관리

- 칸반 보드 기반 직관적 프로젝트 상태 관리
- 타임라인 및 캘린더 뷰 지원
- 작업별 진행률 추적 및 마감일 관리
- 시간 기록 및 작업 로그 시스템

### 📄 스마트 문서 관리

- AI 기반 문서 초안 자동 생성 (견적서, 계약서, 청구서)
- 직군별 표준 템플릿 제공
- 전자 서명 및 문서 상태 추적
- 버전 관리 및 수정 이력 자동 저장

### 💰 재무 관리

- 인보이스 발행 및 입금 현황 실시간 추적
- 미수금 자동 리마인더 및 알림
- 수입/지출 카테고리별 분석
- 세금 계산 및 신고 데이터 자동 정리

### 🤖 AI 비서

- 프로젝트 정보 기반 문서 자동 생성
- 고객 커뮤니케이션 요약 및 To-do 추출
- 데이터 기반 의사결정 지원
- 가격 제안 및 계약서 검토 지원

## 🏗️ 기술 스택

### Frontend

- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성 보장
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **Zustand** - 상태 관리 라이브러리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### Backend & Database

- **Supabase** - PostgreSQL 기반 BaaS
- **Prisma** - 타입 안전한 데이터베이스 ORM
- **PostgreSQL** - 관계형 데이터베이스

### Authentication & Security

- **Supabase Auth** - 인증 시스템
- **Next.js Middleware** - 라우트 보호
- **JWT** - 토큰 기반 인증

### Development Tools

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Playwright** - E2E 테스팅
- **Jest** - 단위 테스팅

## 📁 프로젝트 구조

```
weave/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # 인증 관련 페이지
│   │   ├── dashboard/         # 대시보드
│   │   ├── projects/          # 프로젝트 관리
│   │   ├── clients/           # 클라이언트 관리
│   │   ├── documents/         # 문서 관리
│   │   ├── invoices/          # 청구서 관리
│   │   └── settings/          # 설정
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── forms/            # 폼 컴포넌트
│   │   ├── layout/           # 레이아웃 컴포넌트
│   │   └── ui/               # UI 컴포넌트
│   ├── lib/                   # 유틸리티 및 설정
│   │   ├── api/              # API 클라이언트
│   │   ├── auth/             # 인증 관련 로직
│   │   ├── supabase/         # Supabase 설정
│   │   ├── theme/            # 테마 시스템
│   │   └── utils/            # 유틸리티 함수
│   ├── stores/               # Zustand 상태 관리
│   ├── types/                # TypeScript 타입 정의
│   └── contexts/             # React Context
├── prisma/                   # 데이터베이스 스키마
├── docs/                     # 프로젝트 문서
└── tests/                    # 테스트 파일
```

## 🗄️ 데이터베이스 스키마

### 핵심 엔티티

- **User** - 사용자 정보 및 프로필
- **Client** - 클라이언트 정보 및 연락처
- **Project** - 프로젝트 정보 및 진행 상태
- **Document** - 문서 관리 (견적서, 계약서, 청구서)
- **Invoice** - 청구서 및 결제 관리
- **Transaction** - 거래 내역 및 재무 기록
- **TaxCalculation** - 세금 계산 및 관리

### 주요 관계

- User ↔ Client (1:N)
- User ↔ Project (1:N)
- Client ↔ Project (1:N)
- Project ↔ Document (1:N)
- Project ↔ Invoice (1:N)
- Invoice ↔ Transaction (1:N)

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Supabase 계정
- PostgreSQL 데이터베이스

### 설치 및 설정

1. **저장소 클론**

```bash
git clone https://github.com/your-username/weave.git
cd weave
```

2. **의존성 설치**

```bash
npm install
```

3. **환경변수 설정**

```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 환경변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **데이터베이스 설정**

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:migrate

# 시드 데이터 생성 (선택사항)
npm run db:seed
```

5. **개발 서버 실행**

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 🧪 테스팅

### 단위 테스트

```bash
npm run test
```

### E2E 테스트

```bash
npm run test:e2e
```

### 테스트 커버리지

```bash
npm run test:ci
```

## 📦 배포

### Vercel 배포

```bash
npm run deploy
```

### 수동 배포

```bash
npm run build
npm run start
```

## 🔧 개발 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start

# 린팅
npm run lint
npm run lint:fix

# 타입 체크
npm run type-check

# 데이터베이스
npm run db:generate    # Prisma 클라이언트 생성
npm run db:push        # 스키마 변경사항 적용
npm run db:migrate     # 마이그레이션 실행
npm run db:studio      # Prisma Studio 실행
npm run db:seed        # 시드 데이터 생성
```

## 🏛️ 아키텍처

### 상태 관리

- **Zustand**를 사용한 전역 상태 관리
- **React Query**를 통한 서버 상태 관리
- **Optimistic Updates**로 사용자 경험 향상

### API 설계

- **RESTful API** 원칙 준수
- **Supabase** 클라이언트를 통한 데이터 접근
- **타입 안전성**을 위한 TypeScript 활용

### 보안

- **Supabase Auth**를 통한 인증
- **Row Level Security (RLS)** 정책 적용
- **JWT 토큰** 기반 세션 관리

### 성능 최적화

- **Next.js App Router**를 통한 서버 컴포넌트 활용
- **이미지 최적화** 및 **코드 스플리팅**
- **캐싱 전략** 및 **CDN** 활용

## 📈 성능 지표

- **페이지 로딩 시간**: 3초 이내
- **시스템 가용성**: 99.9%
- **동시 사용자 지원**: 1만명
- **에러율**: 0.1% 이하

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- **이메일**: support@weave.com
- **문서**: [docs.weave.com](https://docs.weave.com)
- **이슈**: [GitHub Issues](https://github.com/your-username/weave/issues)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) 팀
- [Supabase](https://supabase.com/) 팀
- [Tailwind CSS](https://tailwindcss.com/) 팀
- 모든 오픈소스 기여자들

---

**WEAVE** - 프리랜서의 업무 효율성을 혁신하는 올인원 솔루션
