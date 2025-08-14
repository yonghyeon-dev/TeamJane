# Supabase 설정 가이드

## 문제 상황
현재 "Failed to fetch" 오류가 발생하는 이유는 `.env.local` 파일에 더미 Supabase 값들이 설정되어 있기 때문입니다.

## 해결 방법

### 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속
2. 계정 생성/로그인
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Name: `weave-erp` (또는 원하는 이름)
   - Database Password: 안전한 비밀번호 입력
   - Region: `Northeast Asia (Seoul)` 선택
5. "Create new project" 클릭

### 2. API 키 확인

프로젝트 생성 후:
1. 좌측 메뉴에서 "Settings" → "API" 클릭
2. 다음 값들 복사:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. .env.local 파일 수정

\`\`\`bash
# 실제 Supabase 값으로 교체
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# 나머지는 그대로 유지
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_SECRET=your-nextauth-secret-for-development
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 4. 서버 재시작

\`\`\`bash
npm run dev
\`\`\`

### 5. 데이터베이스 스키마 적용 (선택사항)

Prisma 스키마를 Supabase에 적용하려면:

\`\`\`bash
# 1. DATABASE_URL 환경변수 추가 (.env.local)
DATABASE_URL="postgresql://postgres:[password]@[project-id].pooler.supabase.com:6543/postgres"

# 2. Prisma 마이그레이션 실행
npx prisma migrate dev --name init
\`\`\`

## 임시 해결책 (테스트용)

실제 Supabase 프로젝트 없이 테스트하려면:

1. 인증 기능을 일시적으로 비활성화
2. 로컬 모드로 작동

이 경우 회원가입/로그인은 작동하지 않지만, UI 테스트는 가능합니다.