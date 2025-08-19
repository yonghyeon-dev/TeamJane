// 캐싱이 적용된 Clients API Layer
import { ClientsAPI } from './clients'
import { cachedApiCall, generateCacheKey, CacheKeys, CacheTTL } from '../cache/cache-utils'
import type { Client, ClientInsert, ClientUpdate, ApiResponse, PaginatedResponse } from '../../types/database'

export class CachedClientsAPI extends ClientsAPI {
  // 캐싱된 클라이언트 목록 조회
  static async getClients(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Client>> {
    const cacheKey = generateCacheKey(CacheKeys.CLIENTS.LIST, params)
    
    return cachedApiCall(
      cacheKey,
      () => super.getClients(params),
      CacheTTL.SHORT
    )
  }

  // 캐싱된 단일 클라이언트 조회
  static async getClient(id: string): Promise<ApiResponse<Client>> {
    const cacheKey = CacheKeys.CLIENTS.DETAIL(id)
    
    return cachedApiCall(
      cacheKey,
      () => super.getClient(id),
      CacheTTL.MEDIUM
    )
  }

  // 캐싱된 클라이언트 통계
  static async getClientStats(): Promise<ApiResponse<{
    total: number
    active: number
    inactive: number
    potential: number
  }>> {
    return cachedApiCall(
      CacheKeys.CLIENTS.STATS,
      () => super.getClientStats(),
      CacheTTL.SHORT
    )
  }

  // 캐싱된 프로젝트 수가 포함된 클라이언트 목록
  static async getClientsWithProjectCounts(): Promise<ApiResponse<(Client & { project_count: number })[]>> {
    return cachedApiCall(
      CacheKeys.CLIENTS.WITH_PROJECTS,
      () => super.getClientsWithProjectCounts(),
      CacheTTL.SHORT
    )
  }

  // 캐싱된 최근 클라이언트 목록
  static async getRecentClients(limit: number = 5): Promise<ApiResponse<Client[]>> {
    const cacheKey = CacheKeys.CLIENTS.RECENT(limit)
    
    return cachedApiCall(
      cacheKey,
      () => super.getRecentClients(limit),
      CacheTTL.SHORT
    )
  }

  // 클라이언트의 프로젝트 목록 (캐싱)
  static async getClientProjects(clientId: string): Promise<ApiResponse<any[]>> {
    const cacheKey = `${CacheKeys.CLIENTS.DETAIL(clientId)}:projects`
    
    return cachedApiCall(
      cacheKey,
      () => super.getClientProjects(clientId),
      CacheTTL.SHORT
    )
  }

  // 생성, 수정, 삭제는 캐시 무효화와 함께 처리
  static async createClient(clientData: Omit<ClientInsert, 'user_id'>): Promise<ApiResponse<Client>> {
    const result = await super.createClient(clientData)
    
    if (result.success) {
      // 관련 캐시 무효화
      const { cacheInvalidation } = await import('../cache/cache-utils')
      cacheInvalidation.clients.list()
      cacheInvalidation.clients.stats()
      cacheInvalidation.dashboard.all()
    }
    
    return result
  }

  static async updateClient(id: string, updates: ClientUpdate): Promise<ApiResponse<Client>> {
    const result = await super.updateClient(id, updates)
    
    if (result.success) {
      // 관련 캐시 무효화
      const { cacheInvalidation } = await import('../cache/cache-utils')
      cacheInvalidation.clients.detail(id)
      cacheInvalidation.clients.list()
      cacheInvalidation.clients.stats()
    }
    
    return result
  }

  static async deleteClient(id: string): Promise<ApiResponse<void>> {
    const result = await super.deleteClient(id)
    
    if (result.success) {
      // 관련 캐시 무효화
      const { cacheInvalidation } = await import('../cache/cache-utils')
      cacheInvalidation.clients.detail(id)
      cacheInvalidation.clients.list()
      cacheInvalidation.clients.stats()
      cacheInvalidation.dashboard.all()
    }
    
    return result
  }

  static async updateStatus(id: string, status: Client['status']): Promise<ApiResponse<Client>> {
    const result = await super.updateStatus(id, status)
    
    if (result.success) {
      // 관련 캐시 무효화
      const { cacheInvalidation } = await import('../cache/cache-utils')
      cacheInvalidation.clients.detail(id)
      cacheInvalidation.clients.list()
      cacheInvalidation.clients.stats()
    }
    
    return result
  }
}