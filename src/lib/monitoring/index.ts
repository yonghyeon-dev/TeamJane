// 통합 모니터링 시스템
export { telemetry, initializeTelemetry } from './telemetry'
export { performanceMonitor, usePerformanceTracking } from './performance'

// 개발 환경용 모니터링 대시보드 컴포넌트
export { default as MonitoringDashboard } from './MonitoringDashboard'

// 프로덕션용 모니터링 설정
export const MONITORING_CONFIG = {
  // 텔레메트리 설정
  telemetry: {
    enabled: true,
    endpoint: process.env.NEXT_PUBLIC_MONITORING_ENDPOINT,
    serviceName: 'weave-erp',
    environment: process.env.NODE_ENV,
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
  },
  
  // 성능 모니터링 설정
  performance: {
    webVitals: true,
    resourceTiming: true,
    memoryTracking: true,
    customMetrics: true
  },
  
  // 에러 추적 설정
  errorTracking: {
    enabled: true,
    captureUnhandledRejections: true,
    captureConsoleErrors: true,
    maxBreadcrumbs: 50
  },
  
  // 알림 설정
  alerts: {
    performanceThresholds: {
      LCP: 4000,  // 4초 이상
      FID: 300,   // 300ms 이상
      CLS: 0.25,  // 0.25 이상
      memoryUsage: 80 // 80% 이상
    },
    errorRateThreshold: 5 // 5% 이상
  }
}

// 초기화 함수
export const initializeMonitoring = () => {
  if (typeof window === 'undefined') return

  // 텔레메트리 초기화
  initializeTelemetry()
  
  // 전역 에러 핸들러 설정
  setupErrorHandlers()
  
  // 개발 환경에서 성능 리포트
  if (process.env.NODE_ENV === 'development') {
    schedulePerformanceReports()
  }
}

// 전역 에러 핸들러
const setupErrorHandlers = () => {
  // Unhandled Promise Rejection
  window.addEventListener('unhandledrejection', (event) => {
    telemetry.trackError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
        url: window.location.href
      }
    )
  })

  // Global Error Handler
  window.addEventListener('error', (event) => {
    telemetry.trackError(event.error || new Error(event.message), {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      url: window.location.href
    })
  })

  // Console Error Interception (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    const originalError = console.error
    console.error = (...args) => {
      telemetry.trackError(
        new Error(`Console Error: ${args.join(' ')}`),
        { type: 'console_error' }
      )
      originalError.apply(console, args)
    }
  }
}

// 개발 환경용 성능 리포트
const schedulePerformanceReports = () => {
  setInterval(() => {
    const metrics = performanceMonitor.getMetrics()
    const memoryInfo = performanceMonitor.trackMemoryUsage()
    const telemetryMetrics = telemetry.getMetrics()
    
    console.group('📊 WEAVE 성능 리포트')
    console.log('📈 Web Vitals:', metrics)
    console.log('📡 Telemetry 메트릭 수:', telemetryMetrics.length)
    if (memoryInfo) {
      console.log('💾 메모리 사용량:', memoryInfo)
    }
    console.groupEnd()
  }, 30000) // 30초마다
}