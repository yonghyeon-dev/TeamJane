# Weave ERP

프리랜서를 위한 올인원 워크스페이스입니다.

## 🚀 특징

- **프리랜서 전용 ERP**: 프로젝트 관리, 클라이언트 관리, 수익 분석
- **통합 대시보드**: 모든 정보를 한눈에 확인
- **자동화된 워크플로우**: 반복 작업 자동화
- **실시간 분석**: 수익, 시간, 프로젝트 성과 실시간 추적
- **모바일 친화적**: 언제 어디서나 접근 가능
- **AI 기능**: 문서 생성, 이메일 요약, 가격 제안 등

## 📦 설치

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 린트
npm run lint
```

### 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:migrate

# 시드 데이터 생성
npm run db:seed

# Prisma Studio 실행 (데이터베이스 GUI)
npm run db:studio
```

## 🎯 주요 기능

### 사용자 및 프로필 관리

- 개인 정보 및 비즈니스 정보 관리
- 사업자등록번호, 연락처, 주소 관리
- 시간대 및 통화 설정
- 프로필 이미지 업로드

### 클라이언트 관리

- 클라이언트 정보 관리 (회사명, 사업자번호, 주소)
- 클라이언트 연락처 관리 (담당자 정보)
- 클라이언트 상태 관리 (활성/비활성/보관)
- 클라이언트별 프로젝트 및 문서 연동

### 프로젝트 관리

- 프로젝트 생성 및 추적
- 작업 단계별 진행 상황 관리 (대기/진행중/피드백/완료/취소/보류)
- 우선순위 설정 (낮음/보통/높음/긴급)
- 예산 및 마감일 관리
- 프로젝트별 작업 항목(Task) 관리
- 진행 상황 로그 기록

### 시간 추적

- 프로젝트별 작업 시간 기록
- 시작/종료 시간 자동 계산
- 시간당 요율 설정
- 작업 내용 설명 기록

### 문서 관리

- 견적서, 계약서, 청구서, 거래명세서, 제안서 생성
- 문서 템플릿 시스템
- 문서 버전 관리
- 전자 서명 기능
- 문서 상태 추적 (초안/발송/열람/서명/취소)

### 청구서 및 결제 관리

- 청구서 자동 생성
- 청구서 항목별 상세 관리
- 세금 계산 자동화
- 결제 상태 추적 (초안/발행/발송/입금완료/연체/취소)
- 결제 내역 로그

### 거래 내역 관리

- 수입/지출/세금 거래 기록
- 카테고리별 분류
- 결제 방법 및 참조번호 관리
- 거래 날짜별 추적

### 세무 관리

- 월별/연도별 세무 계산
- 소득 유형별 세율 적용 (사업소득 3.3%, 기타소득 8.8%)
- 강연료, 저작권료 등 특수 소득 관리
- 세전/세후 금액 자동 계산

### 파일 관리

- Supabase 스토리지를 활용한 파일 업로드
- 프로젝트/클라이언트별 파일 분류
- 파일 메타데이터 관리
- 공유 토큰을 통한 안전한 파일 공유

### AI 기능

- 문서 초안 자동 생성
- 이메일 요약
- 회의록 요약
- 가격 제안 생성
- 계약서 검토
- GPT-4, GPT-3.5-turbo 모델 지원

### 공유 시스템

- 프로젝트별 파일 공유 토큰 생성
- 파일 업로드 제한 설정 (개수, 크기, 타입)
- 토큰 만료일 설정
- 안전한 외부 파일 수집

## 📁 프로젝트 구조

```
src/
├── app/                       # Next.js App Router
│   ├── auth/                  # 인증 관련 페이지
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-email/
│   ├── dashboard/             # 대시보드
│   ├── test-connection/       # 연결 테스트
│   ├── components/            # 데모 컴포넌트
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                  # 인증 컴포넌트
│   ├── layout/                # 레이아웃 컴포넌트
│   │   └── DashboardLayout.tsx
│   └── ui/                    # UI 컴포넌트 라이브러리
│       ├── enhanced/          # ERP 전용 컴포넌트
│       │   ├── DataTable.tsx
│       │   ├── MetricCard.tsx
│       │   └── StatusBadge.tsx
│       └── ...                # 기본 UI 컴포넌트들
├── lib/
│   ├── auth/                  # 인증 관련
│   │   └── auth-context.tsx
│   ├── supabase/              # Supabase 설정
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── theme/                 # 테마 시스템
│   └── utils.ts
└── prisma/                    # 데이터베이스 스키마
    ├── schema.prisma
    └── seed.ts
```

## 🔧 개발

### 환경 설정

```bash
# 환경 변수 설정
cp .env.example .env.local

# 데이터베이스 설정
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 배포

```bash
# 프로덕션 빌드
npm run build

# Vercel 배포
npm run deploy

# 프리뷰 배포
npm run deploy:preview
```

## 🧪 테스트

```bash
# 테스트 실행
npm run test

# 테스트 커버리지
npm run test:ci

# 테스트 감시 모드
npm run test:watch
```

## 📊 데이터베이스 스키마

### 주요 모델

- **User**: 사용자 정보 및 인증
- **Profile**: 개인/비즈니스 프로필
- **Client**: 클라이언트 정보
- **ClientContact**: 클라이언트 연락처
- **Project**: 프로젝트 정보
- **ProjectTask**: 프로젝트 작업 항목
- **TimeEntry**: 시간 추적
- **Document**: 문서 관리
- **Invoice**: 청구서
- **Transaction**: 거래 내역
- **TaxCalculation**: 세무 계산
- **FileUpload**: 파일 관리
- **ShareToken**: 파일 공유
- **AiGeneration**: AI 기능

### 상태 관리

- **ProjectStatus**: PENDING, IN_PROGRESS, FEEDBACK, COMPLETED, CANCELLED, ON_HOLD
- **TaskStatus**: TODO, IN_PROGRESS, REVIEW, DONE
- **DocumentStatus**: DRAFT, SENT, VIEWED, SIGNED, CANCELLED
- **InvoiceStatus**: DRAFT, ISSUED, SENT, PAID, OVERDUE, CANCELLED
- **ClientStatus**: ACTIVE, INACTIVE, ARCHIVED

## 📝 라이센스

MIT License

## 🤝 기여

새로운 기능이나 개선사항을 제안하고 싶으시면:

1. **기능 요청**: 왜 필요한지, 어떤 문제를 해결하는지 설명해주세요
2. **기존 패턴 분석**: 기존 코드의 패턴을 따라주세요
3. **테스트 코드 작성**: 새로운 기능에 대한 테스트를 포함해주세요
4. **문서화**: README나 주석을 업데이트해주세요

## 🐛 문제 해결

### 데이터베이스 연결 문제

1. 환경 변수가 올바르게 설정되었는지 확인
2. Prisma 스키마가 최신 상태인지 확인
3. 데이터베이스 마이그레이션 실행

### Supabase 연결 문제

1. Supabase 프로젝트 설정 확인
2. 환경 변수에 API 키가 올바르게 설정되었는지 확인
3. 데이터베이스 연결 문자열 확인

### 빌드 오류

1. 의존성이 올바르게 설치되었는지 확인
2. TypeScript 타입 오류 확인
3. ESLint 규칙 준수 확인

### AI 기능 오류

1. OpenAI API 키 설정 확인
2. 토큰 사용량 및 제한 확인
3. 모델 설정 확인
