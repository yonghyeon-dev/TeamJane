// Clients용 React Query 훅
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CachedClientsAPI as ClientsAPI } from '@/lib/api/clients-cached'
import type { Client, ClientInsert, ClientUpdate } from '@/types/database'

// Query Keys 상수
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params?: any) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  stats: () => [...clientKeys.all, 'stats'] as const,
}

// 클라이언트 목록 조회
export function useClients(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => ClientsAPI.getClients(params),
    select: (data) => data.success ? data : { success: false, data: [], page: 1, limit: 10, total: 0, hasMore: false },
  })
}

// 단일 클라이언트 조회
export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => ClientsAPI.getClient(id),
    enabled: !!id,
    select: (data) => data.success ? data.data : null,
  })
}

// 클라이언트 통계 조회
export function useClientStats() {
  return useQuery({
    queryKey: clientKeys.stats(),
    queryFn: () => ClientsAPI.getClientStats(),
    select: (data) => data.success ? data.data : null,
  })
}

// 클라이언트 생성 뮤테이션
export function useCreateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (clientData: Omit<ClientInsert, 'user_id'>) => 
      ClientsAPI.createClient(clientData),
    onSuccess: (response) => {
      if (response.success) {
        // 클라이언트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
        queryClient.invalidateQueries({ queryKey: clientKeys.stats() })
        
        // 새로 생성된 클라이언트를 캐시에 추가
        if (response.data) {
          queryClient.setQueryData(
            clientKeys.detail(response.data.id),
            { success: true, data: response.data }
          )
        }
      }
    },
  })
}

// 클라이언트 수정 뮤테이션
export function useUpdateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ClientUpdate }) => 
      ClientsAPI.updateClient(id, updates),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // 해당 클라이언트 상세 정보 업데이트
        queryClient.setQueryData(
          clientKeys.detail(id),
          { success: true, data: response.data }
        )
        
        // 클라이언트 목록 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
        queryClient.invalidateQueries({ queryKey: clientKeys.stats() })
      }
    },
  })
}

// 클라이언트 삭제 뮤테이션
export function useDeleteClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => ClientsAPI.deleteClient(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // 삭제된 클라이언트의 캐시 제거
        queryClient.removeQueries({ queryKey: clientKeys.detail(id) })
        
        // 클라이언트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
        queryClient.invalidateQueries({ queryKey: clientKeys.stats() })
      }
    },
  })
}

// 클라이언트 상태 업데이트 뮤테이션
export function useUpdateClientStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Client['status'] }) => 
      ClientsAPI.updateStatus(id, status),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // 해당 클라이언트 상세 정보 업데이트
        queryClient.setQueryData(
          clientKeys.detail(id),
          { success: true, data: response.data }
        )
        
        // 클라이언트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
        queryClient.invalidateQueries({ queryKey: clientKeys.stats() })
      }
    },
  })
}