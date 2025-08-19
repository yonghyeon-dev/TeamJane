// 개발 환경용 캐시 모니터링 컴포넌트
'use client'

import { useState, useEffect } from 'react'
import { memoryCache } from '@/lib/cache/memory-cache'
import { cacheInvalidation } from '@/lib/cache/cache-utils'
import Button from '@/components/ui/Button'
import { RefreshCw, Trash2, BarChart3, X } from 'lucide-react'

interface CacheMonitorProps {
  show: boolean
  onClose: () => void
}

export default function CacheMonitor({ show, onClose }: CacheMonitorProps) {
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 })
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null)

  // 캐시 통계 업데이트
  const updateStats = () => {
    const newStats = memoryCache.getStats()
    setStats(newStats)
  }

  // 캐시 정리
  const handleCleanup = () => {
    const cleaned = memoryCache.cleanup()
    setLastCleanup(new Date())
    updateStats()
    console.log(`[Cache] Cleaned ${cleaned} expired items`)
  }

  // 전체 캐시 클리어
  const handleClearAll = () => {
    memoryCache.clear()
    updateStats()
    console.log('[Cache] All cache cleared')
  }

  // 특정 영역 캐시 무효화
  const handleInvalidateClients = () => {
    cacheInvalidation.clients.all()
    updateStats()
    console.log('[Cache] Client cache invalidated')
  }

  const handleInvalidateProjects = () => {
    cacheInvalidation.projects.all()
    updateStats()
    console.log('[Cache] Project cache invalidated')
  }

  // 주기적으로 통계 업데이트
  useEffect(() => {
    if (show) {
      updateStats()
      const interval = setInterval(updateStats, 1000)
      return () => clearInterval(interval)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Cache Monitor
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* 캐시 통계 */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Items:</span>
          <span className="text-sm font-medium">{stats.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Active:</span>
          <span className="text-sm font-medium text-green-600">{stats.active}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Expired:</span>
          <span className="text-sm font-medium text-red-600">{stats.expired}</span>
        </div>
        {lastCleanup && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Last Cleanup:</span>
            <span className="text-xs text-gray-500">
              {lastCleanup.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* 캐시 제어 버튼들 */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleCleanup}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Cleanup
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" onClick={handleInvalidateClients}>
            Clear Clients
          </Button>
          <Button variant="ghost" size="sm" onClick={handleInvalidateProjects}>
            Clear Projects
          </Button>
        </div>
      </div>

      {/* 힌트 */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
        💡 Cache hits/misses are logged to console
      </div>
    </div>
  )
}