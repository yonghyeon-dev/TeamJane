# WEAVE ERP 프로덕션 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 보안 설정
- [x] CSP (Content Security Policy) 설정 완료
- [x] HSTS (HTTP Strict Transport Security) 설정 완료
- [x] 환경변수 보안 설정 완료
- [x] 인증 미들웨어 보안 강화 완료
- [ ] SSL/TLS 인증서 설정
- [ ] 데이터베이스 보안 설정 확인
- [ ] API 키 로테이션 계획
- [ ] 백업 및 복구 절차 설정

### ✅ 성능 최적화
- [x] React Query 캐싱 구현
- [x] 메모리 캐시 시스템 구현  
- [x] 성능 모니터링 시스템 구현
- [x] N+1 쿼리 최적화 완료
- [ ] CDN 설정
- [ ] 이미지 최적화
- [ ] 번들 사이즈 최적화
- [ ] 서버 사이드 렌더링 최적화

### ✅ 모니터링 & 관찰성
- [x] 커스텀 텔레메트리 시스템 구현
- [x] 성능 메트릭 수집 구현
- [x] 에러 추적 시스템 구현
- [x] 개발 환경 모니터링 대시보드 구현
- [ ] 프로덕션 알림 설정
- [ ] 로그 집계 시스템 설정
- [ ] 헬스체크 엔드포인트 구현
- [ ] 업타임 모니터링 설정

## 🚀 배포 단계

### 1단계: 환경 설정
```bash
# 1. 환경변수 설정
cp .env.example .env.production

# 2. 프로덕션 빌드 테스트
npm run build

# 3. 타입 검사
npm run type-check

# 4. 린팅 검사
npm run lint
```

### 2단계: 보안 검증
```bash
# 1. 보안 취약점 스캔
npm audit

# 2. 의존성 보안 검사
npm audit fix

# 3. 환경변수 검증
node scripts/verify-env.js
```

### 3단계: 성능 검증
```bash
# 1. 번들 분석
npm run analyze

# 2. 성능 테스트
npm run test:performance

# 3. 로드 테스트
npm run test:load
```

### 4단계: 배포 실행
```bash
# Vercel 배포
vercel --prod

# 또는 Docker 배포
docker build -t weave-erp .
docker run -p 3000:3000 weave-erp
```

## 🔧 프로덕션 환경 설정

### 필수 환경변수
```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 모니터링 (권장)
NEXT_PUBLIC_MONITORING_ENDPOINT=https://monitoring.yourservice.com/api/metrics
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# 분석 (선택)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### 성능 최적화 설정
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true
  },
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif']
  }
}
```

## 📊 모니터링 설정

### 핵심 메트릭
- **성능**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **가용성**: 99.9% 업타임
- **에러율**: < 1%
- **응답시간**: API < 200ms, 페이지 로드 < 3s

### 알림 설정
```yaml
alerts:
  performance:
    - LCP > 4s (경고)
    - FID > 300ms (경고)
    - 페이지 로드 > 5s (치명적)
  
  errors:
    - 에러율 > 1% (경고)
    - 에러율 > 5% (치명적)
    - 연속 에러 > 10건 (치명적)
  
  infrastructure:
    - CPU > 80% (경고)
    - 메모리 > 90% (치명적)
    - 디스크 > 85% (경고)
```

## 🛡️ 보안 설정

### CSP 헤더 설정
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: *.supabase.co;
      connect-src 'self' *.supabase.co *.vercel-analytics.com;
    `
  }
]
```

### 환경변수 보안
- 클라이언트에 노출되는 변수는 `NEXT_PUBLIC_` 접두사 사용
- 민감한 정보는 서버 환경변수로만 설정
- API 키는 정기적으로 로테이션
- 개발/스테이징/프로덕션 환경 분리

## 🔄 배포 후 검증

### 즉시 확인사항
1. **기능 테스트**: 핵심 사용자 플로우 테스트
2. **성능 확인**: 페이지 로드 시간, API 응답 시간
3. **모니터링 확인**: 메트릭 수집, 에러 추적 동작
4. **보안 확인**: HTTPS 리다이렉트, 보안 헤더

### 24시간 모니터링
- 에러율 추이 확인
- 성능 메트릭 안정성 확인
- 사용자 피드백 수집
- 인프라 리소스 사용량 모니터링

## 🚨 장애 대응 절차

### 1단계: 즉시 대응
1. 모니터링 대시보드 확인
2. 에러 로그 분석
3. 롤백 여부 결정
4. 사용자 공지 (필요시)

### 2단계: 근본 원인 분석
1. 에러 패턴 분석
2. 성능 데이터 분석
3. 인프라 로그 확인
4. 코드 변경사항 검토

### 3단계: 복구 및 개선
1. 핫픽스 배포
2. 모니터링 강화
3. 재발 방지책 수립
4. 문서화 및 팀 공유

## 📞 지원 연락처

### 기술 지원
- **개발팀**: dev@weave.team
- **인프라팀**: infra@weave.team
- **보안팀**: security@weave.team

### 외부 서비스
- **Supabase**: support@supabase.io
- **Vercel**: support@vercel.com
- **모니터링**: 설정된 서비스 지원팀

---

**마지막 업데이트**: 2024-08-19
**다음 검토 예정**: 2024-09-19