'use client'

// 환경별 설정
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

interface TelemetryConfig {
  serviceName: string
  environment: string
  endpoint?: string
  headers?: Record<string, string>
}

interface MetricData {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

class WeaveTelemetry {
  private metrics: MetricData[] = []
  private initialized = false
  private sessionId: string = ''

  initialize(config: TelemetryConfig) {
    if (this.initialized || typeof window === 'undefined') {
      return
    }

    try {
      this.sessionId = this.generateSessionId()
      this.initialized = true
      
      // 브라우저 성능 API 활용
      this.setupPerformanceObserver()
      
      if (isDevelopment) {
        console.log('✅ WEAVE Telemetry 초기화 완료:', {
          service: config.serviceName,
          environment: config.environment,
          sessionId: this.sessionId,
          endpoint: config.endpoint ? '설정됨' : '없음'
        })
      }

    } catch (error) {
      console.error('❌ Telemetry 초기화 실패:', error)
    }
  }

  private generateSessionId(): string {
    return `weave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupPerformanceObserver() {
    // Navigation Timing 추적
    if ('navigation' in performance) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      this.trackMetric('navigation.load_time', nav.loadEventEnd - nav.navigationStart)
      this.trackMetric('navigation.dom_ready', nav.domContentLoadedEventEnd - nav.navigationStart)
    }

    // Resource Timing 추적
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEntry) => {
            if (entry.entryType === 'resource') {
              const resource = entry as PerformanceResourceTiming
              this.trackMetric(`resource.${resource.name.split('/').pop()}`, resource.duration)
            }
          })
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }
  }

  private trackMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: MetricData = {
      name,
      value,
      timestamp: Date.now(),
      tags: {
        session_id: this.sessionId,
        ...tags
      }
    }

    this.metrics.push(metric)

    // 개발 환경에서 로깅
    if (isDevelopment) {
      console.log(`📊 ${name}: ${value}`, metric)
    }

    // 메트릭 수가 많아지면 오래된 것 제거
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500)
    }
  }

  // 사용자 액션 추적
  trackUserAction(action: string, metadata?: Record<string, any>) {
    this.trackMetric(`user.${action}`, 1, metadata)
    
    if (isDevelopment) {
      console.log(`👤 User Action: ${action}`, metadata)
    }
  }

  // 페이지 성능 추적
  trackPagePerformance(pageName: string, loadTime: number) {
    this.trackMetric(`page.${pageName}.load_time`, loadTime, {
      page: pageName,
      url: window.location.href
    })
  }

  // 에러 추적
  trackError(error: Error, context?: Record<string, any>) {
    this.trackMetric('error.occurred', 1, {
      error_name: error.name,
      error_message: error.message,
      url: window.location.href,
      ...context
    })
    
    console.error('🚨 Error tracked:', error, context)
  }

  // API 호출 추적
  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.trackMetric(`api.${method.toLowerCase()}.duration`, duration, {
      endpoint: endpoint,
      method: method,
      status: status.toString()
    })

    if (status >= 400) {
      this.trackMetric('api.error', 1, {
        endpoint: endpoint,
        method: method,
        status: status.toString()
      })
    }
  }

  // 메모리 사용량 추적
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      
      this.trackMetric('memory.usage_percent', usage)
      
      if (usage > 80) {
        this.trackError(
          new Error('High memory usage detected'),
          { usage_percent: usage }
        )
      }
    }
  }

  // 프로덕션에서 메트릭 전송
  async sendMetrics() {
    if (!isProduction || this.metrics.length === 0) return

    const endpoint = process.env.NEXT_PUBLIC_MONITORING_ENDPOINT
    if (!endpoint) return

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'weave-erp',
          session_id: this.sessionId,
          metrics: this.metrics,
          timestamp: Date.now()
        })
      })
      
      // 전송 후 메트릭 클리어
      this.metrics = []
    } catch (error) {
      console.error('Failed to send metrics:', error)
    }
  }

  // 현재 메트릭 반환
  getMetrics(): MetricData[] {
    return [...this.metrics]
  }

  // 세션 정보 반환
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      metricsCount: this.metrics.length,
      initialized: this.initialized
    }
  }
}

// 전역 인스턴스
export const telemetry = new WeaveTelemetry()

// 초기화 함수
export const initializeTelemetry = () => {
  if (typeof window === 'undefined') return

  const config: TelemetryConfig = {
    serviceName: 'weave-erp-frontend',
    environment: process.env.NODE_ENV || 'development',
    endpoint: process.env.NEXT_PUBLIC_MONITORING_ENDPOINT,
    headers: process.env.NEXT_PUBLIC_MONITORING_HEADERS ? 
      JSON.parse(process.env.NEXT_PUBLIC_MONITORING_HEADERS) : undefined
  }

  telemetry.initialize(config)

  // 정기적으로 메트릭 전송 (프로덕션만)
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      telemetry.sendMetrics()
    }, 60000) // 1분마다
  }
}

export default telemetry