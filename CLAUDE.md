# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 필요한 안내를 제공합니다.

## 프로젝트 개요

Weave는 커스터마이징 가능한 테마 시스템을 가진 React UI 컴포넌트 라이브러리입니다. Next.js, TypeScript, Tailwind CSS로 구축되었으며, Linear.app의 디자인 시스템에서 영감을 받은 동적 다크/라이트 테마 지원과 커스텀 색상 팔레트를 제공합니다.

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린팅 실행
npm run lint

# 타입 체크 실행
npm run type-check
```

## 아키텍처 개요

### 핵심 구조

- **`src/app/`** - Next.js 앱 라우터 기반 페이지 및 라우팅
- **`src/components/ui/`** - 재사용 가능한 UI 컴포넌트들
- **`src/lib/theme/`** - 테마 시스템 (색상, 다크/화이트 테마 지원)
- **`src/lib/utils.ts`** - 유틸리티 함수 (className 병합을 위한 `cn` 포함)

### 테마 시스템 아키텍처

테마 시스템은 핵심 아키텍처 기능입니다:

1. **`ThemeContext.tsx`** - 테마 상태 관리를 위한 React 컨텍스트
   - `currentTheme` (다크/화이트), `currentColors`, `selectedPaletteId` 관리
   - 컴포넌트에서 사용할 `useTheme` 훅 제공

2. **`constants.ts`** - 완전한 디자인 시스템 상수
   - 사전 정의된 색상 팔레트 (custom1, custom2, custom3)
   - 간격, 그림자, 트랜지션, 브레이크포인트
   - 공통 스타일과 컴포넌트 기본값
   - 유효성 검사 규칙

3. **`ClientThemeProvider.tsx`** - Next.js용 클라이언트 사이드 테마 프로바이더
4. **`types.ts`** - 테마 시스템용 TypeScript 정의
5. **`utils.ts` & `themeUtils.ts`** - 테마 관련 유틸리티

### 동적 테마 구현

테마 시스템은 런타임 테마 전환을 위해 CSS 사용자 정의 속성을 사용합니다:

- Tailwind 설정에서 색상을 `var(--color-primary-background)` 등으로 정의
- 테마 프로바이더가 동적으로 CSS 변수를 주입
- 컴포넌트는 이 CSS 변수를 참조하는 Tailwind 클래스 사용
- 테마 전환(다크/화이트)과 색상 팔레트 전환 모두 지원

### 컴포넌트 아키텍처

모든 UI 컴포넌트는 일관된 패턴을 따릅니다:

- **타입 안전성**: 완전한 TypeScript props 인터페이스 내보내기
- **테마 통합**: 테마 컨텍스트와 CSS 변수 사용
- **Tailwind 통합**: className 병합을 위한 `cn()` 유틸리티 사용
- **일관된 API**: 컴포넌트 간 유사한 props 패턴 (variant, size 등)

주요 컴포넌트: Button, Badge, Card, Input, Avatar, Navbar, Footer, Hero, Status, Typography, Carousel, ColorSelector, ThemeSelector

### 애플리케이션 구조

Next.js 앱 라우터 기반의 ERP 시스템입니다:

- **앱 라우터**: `src/app/` 디렉토리 기반 파일 시스템 라우팅
- **컴포넌트**: 재사용 가능한 UI 컴포넌트 라이브러리
- **테마 시스템**: 다크/화이트 테마와 커스텀 색상 팔레트 지원
- **인증**: Supabase 기반 사용자 인증 및 관리

## 주요 규칙

### 언어 사용 규칙
- **한국어 전용**: Claude는 모든 답변을 한국어로만 제공해야 합니다.

### 가져오기 패턴
- UI 컴포넌트: `import Button from "@/components/ui/Button"`
- 테마: `import { useTheme } from "@/lib/theme/ThemeContext"`
- 유틸리티: `import { cn } from "@/lib/utils"`

### CSS 변수 명명 규칙
- 주요 색상: `--color-primary-*`
- 텍스트 색상: `--color-text-*`
- 상태 색상: `--color-status-*`
- 강조 색상: `--color-accent-*`

### 파일 구조
- 각 UI 컴포넌트는 `src/components/ui/`에 독립 파일
- 각 컴포넌트는 기본 내보내기와 TypeScript 타입을 제공
- `src/components/ui/index.ts`에서 편의를 위해 재내보내기

## 개발 워크플로우

### 새 컴포넌트 추가
1. `src/components/ui/ComponentName.tsx`에 컴포넌트 파일 생성
2. 필요시 `src/components/ui/index.ts`에서 컴포넌트 재내보내기
3. props 인터페이스와 테마 통합을 위한 기존 패턴 따르기

### 색상 팔레트 추가
1. `src/lib/theme/constants.ts`의 `THEME_CONSTANTS.colorPalettes`에 추가
2. `src/lib/theme/types.ts`의 `ColorPaletteId` 타입 업데이트
3. 개발 서버 재시작

## 테마 시스템 사용법

현재 white 테마 + custom1 색상 팔레트가 기본으로 설정되어 있습니다:

```tsx
// app/layout.tsx
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
```

### custom1 색상 팔레트
- **Primary**: #4ECDC4 (청록색)
- **Secondary**: #45B7D1 (하늘색)  
- **Default**: #1A535C (진한 청록색)

## 빌드 구성

- **TypeScript**: Next.js 통합과 함께 엄격한 구성
- **Tailwind CSS**: 동적 테마를 위한 CSS 변수가 포함된 확장 테마
- **ESLint**: Next.js 핵심 웹 바이탈과 TypeScript 규칙
- **PostCSS**: Tailwind 처리를 위한 표준 구성