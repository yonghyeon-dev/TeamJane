# Weave ERP Vercel 배포 가이드

## 📋 개요

React + Next.js로 구성된 Weave ERP 시스템을 Vercel 플랫폼에 배포하기 위한 완전한 가이드입니다. Supabase와의 통합, 환경 변수 설정, CI/CD 파이프라인 구성을 포함합니다.

## 🏗️ 배포 아키텍처

```mermaid
graph TB
    subgraph "Developer Workflow"
        Dev[개발자]
        Git[GitHub Repository]
        PR[Pull Request]
    end
    
    subgraph "Vercel Platform"
        Preview[Preview Deployments]
        Staging[Staging Environment]
        Production[Production Environment]
        Analytics[Vercel Analytics]
        Functions[Serverless Functions]
    end
    
    subgraph "External Services"
        Supabase[Supabase Backend]
        OpenAI[OpenAI API]
        Resend[Resend Email]
        Storage[File Storage]
    end
    
    subgraph "Monitoring"
        Sentry[Error Tracking]
        Logs[Vercel Logs]
        Metrics[Performance Metrics]
    end
    
    Dev --> Git
    Git --> PR
    PR --> Preview
    Git --> Staging
    Staging --> Production
    
    Production --> Supabase
    Production --> OpenAI
    Production --> Resend
    Production --> Storage
    
    Production --> Analytics
    Production --> Functions
    
    Production --> Sentry
    Production --> Logs
    Production --> Metrics
    
    style Production fill:#00ff00
    style Staging fill:#ffff00
    style Preview fill:#add8e6
```

## 🚀 1단계: 프로젝트 초기 설정

### 1.1 Next.js 프로젝트 생성

```bash
# Weave 디렉토리에서 ERP 시스템 초기화
npx create-next-app@latest weave-erp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd weave-erp

# 필수 dependencies 설치
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @prisma/client prisma
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install recharts
npm install lucide-react
npm install date-fns
npm install clsx tailwind-merge

# AI 관련 dependencies
npm install openai ai
npm install @vercel/analytics

# 개발 dependencies
npm install -D @types/node
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint-config-prettier
```

### 1.2 기존 Weave UI 컴포넌트 통합

```bash
# 기존 Weave UI 컴포넌트 복사
cp -r ../src/components/ui ./src/components/
cp -r ../src/lib/theme ./src/lib/
cp ../src/lib/utils.ts ./src/lib/

# 기존 스타일 통합
cp ../tailwind.config.ts ./
cp ../src/app/globals.css ./src/app/
```

## 🔧 2단계: Supabase 설정

### 2.1 Supabase 프로젝트 생성

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인 및 프로젝트 연결
supabase login
supabase init
supabase link --project-ref your-project-ref
```

### 2.2 데이터베이스 스키마 설정

```sql
-- supabase/migrations/001_initial_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users 테이블 (Supabase Auth와 연동)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own data" ON users
  FOR ALL USING (auth.uid() = auth_id);

-- 나머지 테이블들... (database-schema.md 참조)
```

### 2.3 Prisma 설정

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 스키마 정의... (database-schema.md 참조)
```

```bash
# Prisma 초기화
npx prisma generate
npx prisma db push
```

## ⚙️ 3단계: 환경 변수 설정

### 3.1 로컬 개발 환경

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

OPENAI_API_KEY=sk-your-openai-key
RESEND_API_KEY=re_your-resend-key

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel Analytics (선택적)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### 3.2 Vercel 환경 변수

```bash
# Vercel CLI로 환경 변수 설정
npm install -g vercel

# 로그인
vercel login

# 프로젝트 링크
vercel link

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add RESEND_API_KEY

# Production 환경 변수
vercel env add NEXT_PUBLIC_APP_URL production
# 값: https://weave-erp.vercel.app

# Staging 환경 변수
vercel env add NEXT_PUBLIC_APP_URL preview
# 값: https://weave-erp-staging.vercel.app
```

## 📦 4단계: Vercel 배포 설정

### 4.1 vercel.json 구성

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["icn1", "sin1"],
  "env": {
    "ENABLE_EXPERIMENTAL_COREPACK": "1"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database-url",
      "OPENAI_API_KEY": "@openai-api-key"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=0, stale-while-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/dashboard",
      "permanent": false,
      "has": [
        {
          "type": "cookie",
          "key": "supabase-auth-token"
        }
      ]
    }
  ]
}
```

### 4.2 next.config.ts 최적화

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: [
      'your-project.supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
    formats: ['image/webp', 'image/avif']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/webhook/:path*',
        destination: '/api/webhooks/:path*'
      }
    ]
  }
}

module.exports = nextConfig
```

## 🔄 5단계: CI/CD 파이프라인 구성

### 5.1 GitHub Actions 워크플로우

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Run build test
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        id: deploy
        run: |
          vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} > deployment-url.txt
          echo "deployment-url=$(cat deployment-url.txt)" >> $GITHUB_OUTPUT
      
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployment ready: ${{ steps.deploy.outputs.deployment-url }}`
            })

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Run Prisma migrations
        run: |
          npm install
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 5.2 package.json 스크립트 추가

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:watch": "jest --watch",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## 🔒 6단계: 보안 설정

### 6.1 환경 보안

```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  RESEND_API_KEY: z.string().startsWith('re_'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

### 6.2 API 보안

```typescript
// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function requireAuth() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Redirect logged-in users from auth pages
  if ((req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

## 📊 7단계: 모니터링 설정

### 7.1 Vercel Analytics 통합

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 7.2 Sentry 에러 추적

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})
```

## 🚀 8단계: 배포 실행

### 8.1 첫 배포

```bash
# 1. 코드 커밋
git add .
git commit -m "Initial Weave ERP setup"
git push origin main

# 2. Vercel 프로젝트 연결
vercel link

# 3. 환경 변수 확인
vercel env ls

# 4. 첫 배포 실행
vercel --prod

# 5. 도메인 설정 (선택적)
vercel domains add weave-erp.com
```

### 8.2 사용자 정의 도메인 설정

```bash
# Vercel 대시보드에서 도메인 추가
# DNS 설정:
# Type: CNAME
# Name: www (또는 @)
# Value: cname.vercel-dns.com

# SSL 인증서 자동 발급 확인
vercel certs ls
```

## 📈 9단계: 성능 최적화

### 9.1 번들 분석

```bash
npm install -D @next/bundle-analyzer

# next.config.ts에 추가
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# 분석 실행
ANALYZE=true npm run build
```

### 9.2 캐싱 전략

```typescript
// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.json(data)
  
  // 캐시 헤더 설정
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  
  return response
}
```

## 🔧 10단계: 유지보수 및 모니터링

### 10.1 정기 업데이트

```bash
# 주간 의존성 업데이트
npm update
npm audit

# Vercel 플랫폼 업데이트
vercel --version
npm install -g vercel@latest
```

### 10.2 백업 전략

```bash
# 데이터베이스 백업 (Supabase 자동 백업 + 수동)
supabase db dump --db-url "postgresql://..." > backup-$(date +%Y%m%d).sql

# 환경 변수 백업
vercel env ls > env-backup-$(date +%Y%m%d).txt
```

### 10.3 성능 모니터링

```typescript
// src/lib/monitoring.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    })
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

## 🚨 문제 해결

### 일반적인 배포 문제들

#### 1. 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npm run type-check

# 의존성 문제 해결
rm -rf node_modules package-lock.json
npm install
```

#### 2. 환경 변수 문제
```bash
# 환경 변수 확인
vercel env ls

# 로컬 환경 변수 동기화
vercel env pull .env.local
```

#### 3. 데이터베이스 연결 문제
```bash
# Prisma 스키마 동기화
npx prisma generate
npx prisma db push

# 연결 테스트
npx prisma studio
```

#### 4. 성능 문제
```typescript
// 번들 분석으로 큰 의존성 확인
ANALYZE=true npm run build

// 동적 import 적용
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false
})
```

## 📋 배포 체크리스트

### 배포 전 확인사항
- [ ] 모든 테스트 통과
- [ ] 타입 체크 통과
- [ ] 린트 검사 통과
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 보안 설정 확인
- [ ] 성능 최적화 적용

### 배포 후 확인사항
- [ ] 프로덕션 사이트 접속 확인
- [ ] 주요 기능 동작 확인
- [ ] API 엔드포인트 테스트
- [ ] 에러 모니터링 설정 확인
- [ ] 성능 메트릭 확인
- [ ] SSL 인증서 확인

## 📝 다음 단계

1. **모니터링 대시보드 구축** - Grafana + Prometheus 통합
2. **A/B 테스트 설정** - Vercel Edge Config 활용
3. **국제화 준비** - next-intl 설정
4. **PWA 지원** - Service Worker 추가
5. **CDN 최적화** - 정적 자산 최적화

이 가이드를 따라 Weave ERP 시스템을 Vercel에 안전하고 효율적으로 배포할 수 있습니다. 모든 설정은 확장성과 유지보수성을 고려하여 구성되었습니다.