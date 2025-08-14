import Link from "next/link";
export default function Home() {
    return (<div className="min-h-screen bg-primary-background text-text-primary font-primary">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <main className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">
              Weave Component Library
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Linear.app 다크 테마 기반의 재사용 가능한 컴포넌트 시스템
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Link href="/components" className="group relative overflow-hidden rounded-lg border border-primary-border bg-primary-surface p-6 hover:bg-primary-surfaceHover transition-all duration-200">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-text-accent transition-colors">
                  Component Library
                </h3>
                <p className="text-sm text-text-secondary">
                  모든 UI 컴포넌트들을 확인하고 테스트해보세요
                </p>
              </div>
              <div className="absolute top-4 right-4 text-text-tertiary group-hover:text-text-secondary transition-colors">
                →
              </div>
            </Link>

            <div className="relative overflow-hidden rounded-lg border border-primary-borderSecondary bg-primary-surfaceSecondary p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  Documentation
                </h3>
                <p className="text-sm text-text-secondary">
                  프로젝트 문서 및 가이드라인
                </p>
              </div>
              <div className="absolute top-4 right-4 text-text-tertiary">
                📚
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-lg border border-primary-borderSecondary bg-primary-surfaceSecondary max-w-3xl">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              프로젝트 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-text-primary">
                  🎨 디자인 시스템
                </h4>
                <p className="text-text-secondary">
                  Linear.app의 일관된 다크 테마
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-text-primary">⚡ 재사용성</h4>
                <p className="text-text-secondary">
                  중앙화된 컴포넌트 라이브러리
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-text-primary">
                  🔧 타입 안전성
                </h4>
                <p className="text-text-secondary">
                  TypeScript로 완전한 타입 지원
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);
}
//# sourceMappingURL=page.jsx.map