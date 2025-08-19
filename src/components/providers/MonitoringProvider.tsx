'use client'

import React, { useEffect } from 'react'
import { initializeMonitoring } from '@/lib/monitoring'
import MonitoringDashboard from '@/lib/monitoring/MonitoringDashboard'

interface MonitoringProviderProps {
  children: React.ReactNode
}

export const MonitoringProvider: React.FC<MonitoringProviderProps> = ({ children }) => {
  useEffect(() => {
    // 클라이언트 사이드에서만 모니터링 초기화
    if (typeof window !== 'undefined') {
      initializeMonitoring()
      
      // 개발 환경에서 환영 메시지
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 WEAVE 모니터링 시스템이 초기화되었습니다')
        console.log('📊 우측 하단의 모니터링 버튼을 클릭하여 실시간 성능을 확인하세요')
      }
    }
  }, [])

  return (
    <>
      {children}
      <MonitoringDashboard />
    </>
  )
}