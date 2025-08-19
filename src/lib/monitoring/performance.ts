'use client'

import { telemetry } from './telemetry'

// Web Vitals 추적
export interface WebVitalsMetric {
  name: string
  value: number
  id: string
  delta: number
}

// Core Web Vitals 임계값
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Map<string, WebVitalsMetric> = new Map()
  private observers: PerformanceObserver[] = []
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    // LCP (Largest Contentful Paint) 관찰
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        startTime: number
      }
      this.recordMetric('LCP', lastEntry.startTime)
    })

    // FID (First Input Delay) 관찰
    this.observeMetric('first-input', (entries) => {
      const firstEntry = entries[0] as PerformanceEntry & {
        processingStart: number
        startTime: number
      }
      const fid = firstEntry.processingStart - firstEntry.startTime
      this.recordMetric('FID', fid)
    })

    // CLS (Cumulative Layout Shift) 관찰
    this.observeMetric('layout-shift', (entries) => {
      let cls = 0
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      })
      this.recordMetric('CLS', cls)
    })

    // Navigation Timing 추적
    this.observeNavigationTiming()
  }

  private observeMetric(entryType: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: [entryType] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Performance Observer for ${entryType} not supported:`, error)
    }
  }

  private observeNavigationTiming() {
    if ('navigation' in performance) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      // TTFB (Time to First Byte)
      const ttfb = nav.responseStart - nav.requestStart
      this.recordMetric('TTFB', ttfb)

      // FCP는 paint entries에서 확인
      this.observeMetric('paint', (entries) => {
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.recordMetric('FCP', fcpEntry.startTime)
        }
      })
    }
  }

  private recordMetric(name: string, value: number) {
    const metric: WebVitalsMetric = {
      name,
      value,
      id: `${name}-${Date.now()}`,
      delta: value
    }

    this.metrics.set(name, metric)
    
    // 성능 등급 계산
    const rating = this.getRating(name, value)
    
    // OpenTelemetry로 전송
    telemetry.trackPagePerformance(name, value)
    
    // 개발 환경에서 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms (${rating})`, {
        value,
        rating,
        threshold: THRESHOLDS[name as keyof typeof THRESHOLDS]
      })
    }

    // 성능 임계값 초과 시 경고
    if (rating === 'poor') {
      this.reportPerformanceIssue(metric, rating)
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  private reportPerformanceIssue(metric: WebVitalsMetric, rating: string) {
    telemetry.trackError(
      new Error(`Performance issue: ${metric.name}`),
      {
        metric_name: metric.name,
        metric_value: metric.value,
        performance_rating: rating,
        page_url: window.location.href
      }
    )
  }

  // 페이지별 성능 추적
  trackPageLoad(pageName: string) {
    const startTime = performance.now()
    
    return {
      end: () => {
        const endTime = performance.now()
        const loadTime = endTime - startTime
        telemetry.trackPagePerformance(pageName, loadTime)
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📄 Page Load: ${pageName} - ${loadTime.toFixed(2)}ms`)
        }
      }
    }
  }

  // 커스텀 성능 마커
  mark(name: string) {
    performance.mark(name)
  }

  measure(name: string, startMark: string, endMark?: string) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      
      telemetry.trackPagePerformance(name, measure.duration)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ Measure: ${name} - ${measure.duration.toFixed(2)}ms`)
      }
      
      return measure.duration
    } catch (error) {
      console.warn(`Performance measure failed: ${name}`, error)
      return 0
    }
  }

  // 리소스 타이밍 분석
  analyzeResourceTiming() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      slowResources: [] as PerformanceResourceTiming[],
      largeResources: [] as PerformanceResourceTiming[]
    }

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime
      const size = (resource as any).transferSize || 0
      
      analysis.totalSize += size
      
      // 느린 리소스 (2초 이상)
      if (duration > 2000) {
        analysis.slowResources.push(resource)
      }
      
      // 큰 리소스 (1MB 이상)
      if (size > 1024 * 1024) {
        analysis.largeResources.push(resource)
      }
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Resource Analysis:', analysis)
    }

    // 성능 이슈 리포트
    if (analysis.slowResources.length > 0) {
      telemetry.trackError(
        new Error('Slow resources detected'),
        {
          slow_resources_count: analysis.slowResources.length,
          total_resources: analysis.totalResources
        }
      )
    }

    return analysis
  }

  // 메모리 사용량 모니터링
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      const memoryInfo = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage_percent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }

      telemetry.trackPagePerformance('memory_usage', memoryInfo.usage_percent)
      
      // 메모리 사용량이 80% 이상일 때 경고
      if (memoryInfo.usage_percent > 80) {
        telemetry.trackError(
          new Error('High memory usage detected'),
          memoryInfo
        )
      }

      return memoryInfo
    }
    
    return null
  }

  // 정리 메서드
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }

  // 현재 수집된 메트릭 반환
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

// 전역 인스턴스
export const performanceMonitor = new PerformanceMonitor()

// React Hook으로 사용할 수 있는 유틸리티
export const usePerformanceTracking = (pageName: string) => {
  if (typeof window === 'undefined') return { trackLoad: () => ({ end: () => {} }) }
  
  return {
    trackLoad: () => performanceMonitor.trackPageLoad(pageName),
    mark: (name: string) => performanceMonitor.mark(name),
    measure: (name: string, start: string, end?: string) => 
      performanceMonitor.measure(name, start, end)
  }
}

export default performanceMonitor