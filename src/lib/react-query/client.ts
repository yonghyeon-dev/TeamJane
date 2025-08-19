// React Query 클라이언트 설정
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 stale time (데이터가 fresh한 상태로 유지되는 시간)
      staleTime: 5 * 60 * 1000,
      // 10분간 cache time (사용되지 않는 데이터가 메모리에 유지되는 시간)
      gcTime: 10 * 60 * 1000,
      // 네트워크 오류 시 재시도 설정
      retry: (failureCount, error: any) => {
        // 401, 403, 404는 재시도 하지 않음
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false
        }
        // 최대 3번까지 재시도
        return failureCount < 3
      },
      // 윈도우 포커스 시 자동 refetch 비활성화 (불필요한 요청 방지)
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 refetch
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 실패 시 재시도 설정
      retry: 1,
    },
  },
})