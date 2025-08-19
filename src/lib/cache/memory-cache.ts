// 메모리 기반 캐시 구현
interface CacheItem<T> {
  data: T
  expiry: number
  key: string
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5분 기본 TTL

  // 캐시에서 데이터 가져오기
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // 만료된 항목 제거
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  // 캐시에 데이터 저장
  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    
    this.cache.set(key, {
      data,
      expiry,
      key
    })
  }

  // 캐시에서 항목 제거
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // 패턴으로 캐시 항목들 제거 (예: "clients/*")
  deletePattern(pattern: string): number {
    const regex = new RegExp(pattern.replace('*', '.*'))
    let deletedCount = 0
    
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key)
        deletedCount++
      }
    }
    
    return deletedCount
  }

  // 캐시 클리어
  clear(): void {
    this.cache.clear()
  }

  // 만료된 항목들 정리
  cleanup(): number {
    const now = Date.now()
    let cleanedCount = 0
    
    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key)
        cleanedCount++
      }
    }
    
    return cleanedCount
  }

  // 캐시 통계
  getStats() {
    const now = Date.now()
    let expired = 0
    let active = 0
    
    for (const [, item] of this.cache) {
      if (now > item.expiry) {
        expired++
      } else {
        active++
      }
    }
    
    return {
      total: this.cache.size,
      active,
      expired
    }
  }

  // 캐시 키 존재 여부 확인
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
}

// 싱글톤 인스턴스
export const memoryCache = new MemoryCache()

// 정기적으로 만료된 항목 정리 (5분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = memoryCache.cleanup()
    if (process.env.NODE_ENV === 'development' && cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired items`)
    }
  }, 5 * 60 * 1000)
}