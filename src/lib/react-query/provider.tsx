'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './client'
import CacheMonitor from '@/components/dev/CacheMonitor'
import Button from '@/components/ui/Button'
import { BarChart3 } from 'lucide-react'

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [showCacheMonitor, setShowCacheMonitor] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 개발 도구들 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <ReactQueryDevtools initialIsOpen={false} />
          
          {/* 캐시 모니터 토글 버튼 */}
          {!showCacheMonitor && (
            <Button
              onClick={() => setShowCacheMonitor(true)}
              className="fixed bottom-4 left-4 z-40"
              size="sm"
              variant="outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Cache Monitor
            </Button>
          )}
          
          {/* 캐시 모니터 */}
          <CacheMonitor 
            show={showCacheMonitor} 
            onClose={() => setShowCacheMonitor(false)} 
          />
        </>
      )}
    </QueryClientProvider>
  )
}