// 캐시 유틸리티 함수들
import { memoryCache } from './memory-cache'

// 캐시 키 생성 함수
export function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return prefix
  }
  
  // 파라미터를 정렬하여 일관된 키 생성
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  
  return `${prefix}:${sortedParams}`
}

// 캐시된 API 호출 래퍼
export async function cachedApiCall<T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // 캐시에서 먼저 확인
  const cached = memoryCache.get<T>(cacheKey)
  if (cached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache HIT] ${cacheKey}`)
    }
    return cached
  }
  
  // 캐시 미스 - API 호출
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache MISS] ${cacheKey}`)
  }
  
  try {
    const result = await apiCall()
    
    // 성공적인 결과만 캐싱
    if (result && typeof result === 'object' && 'success' in result) {
      const apiResult = result as any
      if (apiResult.success) {
        memoryCache.set(cacheKey, result, ttl)
      }
    } else {
      memoryCache.set(cacheKey, result, ttl)
    }
    
    return result
  } catch (error) {
    // 에러는 캐싱하지 않음
    throw error
  }
}

// 무효화 헬퍼 함수들
export const cacheInvalidation = {
  // 클라이언트 관련 캐시 무효화
  clients: {
    all: () => memoryCache.deletePattern('clients*'),
    list: () => memoryCache.deletePattern('clients:list*'),
    detail: (id: string) => memoryCache.delete(`clients:detail:${id}`),
    stats: () => memoryCache.delete('clients:stats'),
  },
  
  // 프로젝트 관련 캐시 무효화  
  projects: {
    all: () => memoryCache.deletePattern('projects*'),
    list: () => memoryCache.deletePattern('projects:list*'),
    detail: (id: string) => memoryCache.delete(`projects:detail:${id}`),
    stats: () => memoryCache.delete('projects:stats'),
  },
  
  // 대시보드 관련 캐시 무효화
  dashboard: {
    all: () => {
      cacheInvalidation.clients.stats()
      cacheInvalidation.projects.stats()
      memoryCache.deletePattern('dashboard*')
    }
  },
  
  // 전체 캐시 무효화
  all: () => memoryCache.clear()
}

// TTL 상수들
export const CacheTTL = {
  VERY_SHORT: 1 * 60 * 1000,      // 1분
  SHORT: 5 * 60 * 1000,           // 5분 (기본값)
  MEDIUM: 15 * 60 * 1000,         // 15분
  LONG: 60 * 60 * 1000,           // 1시간
  VERY_LONG: 24 * 60 * 60 * 1000, // 24시간
} as const

// 캐시 키 상수들
export const CacheKeys = {
  CLIENTS: {
    LIST: 'clients:list',
    DETAIL: (id: string) => `clients:detail:${id}`,
    STATS: 'clients:stats',
    WITH_PROJECTS: 'clients:with-projects',
    RECENT: (limit: number) => `clients:recent:${limit}`,
  },
  
  PROJECTS: {
    LIST: 'projects:list',
    DETAIL: (id: string) => `projects:detail:${id}`,
    STATS: 'projects:stats',
    RECENT: (limit: number) => `projects:recent:${limit}`,
  },
  
  DASHBOARD: {
    METRICS: 'dashboard:metrics',
    RECENT_ACTIVITY: 'dashboard:recent-activity',
  }
} as const