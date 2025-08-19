'use client'

import React, { useState, useEffect } from 'react'
import { performanceMonitor } from './performance'
import { telemetry } from './telemetry'

interface MetricDisplay {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'error'
}

const MonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricDisplay[]>([])
  const [memoryInfo, setMemoryInfo] = useState<any>(null)
  const [telemetryInfo, setTelemetryInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const updateMetrics = () => {
      const webVitals = performanceMonitor.getMetrics()
      const memory = performanceMonitor.trackMemoryUsage()
      const telemetryData = telemetry.getSessionInfo()
      
      const displayMetrics: MetricDisplay[] = Object.entries(webVitals).map(([name, metric]) => ({
        name,
        value: metric.value,
        unit: name === 'CLS' ? '' : 'ms',
        status: getMetricStatus(name, metric.value)
      }))

      setMetrics(displayMetrics)
      setMemoryInfo(memory)
      setTelemetryInfo(telemetryData)
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMetricStatus = (name: string, value: number): 'good' | 'warning' | 'error' => {
    const thresholds: Record<string, { warning: number; error: number }> = {
      'LCP': { warning: 2500, error: 4000 },
      'FID': { warning: 100, error: 300 },
      'CLS': { warning: 0.1, error: 0.25 },
      'FCP': { warning: 1800, error: 3000 },
      'TTFB': { warning: 800, error: 1800 }
    }

    const threshold = thresholds[name]
    if (!threshold) return 'good'

    if (value >= threshold.error) return 'error'
    if (value >= threshold.warning) return 'warning'
    return 'good'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        📊 모니터링
      </button>

      {isVisible && (
        <div className="bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">성능 모니터링</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Web Vitals */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Web Vitals</h4>
            <div className="space-y-2">
              {metrics.map((metric) => (
                <div
                  key={metric.name}
                  className={`p-2 rounded-md ${getStatusColor(metric.status)}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className="text-sm">
                      {metric.value.toFixed(2)}{metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Usage */}
          {memoryInfo && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">메모리 사용량</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>사용률</span>
                  <span>{memoryInfo.usage_percent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      memoryInfo.usage_percent > 80 ? 'bg-red-500' :
                      memoryInfo.usage_percent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(memoryInfo.usage_percent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{(memoryInfo.used / 1024 / 1024).toFixed(1)}MB</span>
                  <span>{(memoryInfo.total / 1024 / 1024).toFixed(1)}MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Info */}
          {telemetryInfo && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">텔레메트리 정보</h4>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">세션 ID</span>
                    <span className="text-blue-600 font-mono text-xs">
                      {telemetryInfo.sessionId.split('_')[2]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">수집 메트릭</span>
                    <span className="text-blue-600">{telemetryInfo.metricsCount}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태</span>
                    <span className={`${telemetryInfo.initialized ? 'text-green-600' : 'text-red-600'}`}>
                      {telemetryInfo.initialized ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => performanceMonitor.analyzeResourceTiming()}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              리소스 분석
            </button>
            <button
              onClick={() => {
                console.clear()
                console.log('📊 성능 메트릭:', performanceMonitor.getMetrics())
                console.log('📡 텔레메트리 메트릭:', telemetry.getMetrics())
              }}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              콘솔 출력
            </button>
            <button
              onClick={() => telemetry.trackMemoryUsage()}
              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              메모리 확인
            </button>
            <button
              onClick={() => telemetry.trackUserAction('manual_test', { source: 'monitoring_dashboard' })}
              className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
            >
              이벤트 테스트
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonitoringDashboard