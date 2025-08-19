// Projects용 React Query 훅
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectsAPI } from '@/lib/api/projects'
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/database'

// Query Keys 상수
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params?: any) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  stats: () => [...projectKeys.all, 'stats'] as const,
}

// 프로젝트 목록 조회
export function useProjects(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => ProjectsAPI.getProjects(params),
    select: (data) => data.success ? data : { success: false, data: [], page: 1, limit: 10, total: 0, hasMore: false },
  })
}

// 단일 프로젝트 조회
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => ProjectsAPI.getProject(id),
    enabled: !!id,
    select: (data) => data.success ? data.data : null,
  })
}

// 프로젝트 통계 조회
export function useProjectStats() {
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn: () => ProjectsAPI.getProjectStats(),
    select: (data) => data.success ? data.data : null,
  })
}

// 프로젝트 생성 뮤테이션
export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (projectData: Omit<ProjectInsert, 'user_id'>) => 
      ProjectsAPI.createProject(projectData),
    onSuccess: (response) => {
      if (response.success) {
        // 프로젝트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
        
        // 새로 생성된 프로젝트를 캐시에 추가
        if (response.data) {
          queryClient.setQueryData(
            projectKeys.detail(response.data.id),
            { success: true, data: response.data }
          )
        }
      }
    },
  })
}

// 프로젝트 수정 뮤테이션
export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProjectUpdate }) => 
      ProjectsAPI.updateProject(id, updates),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // 해당 프로젝트 상세 정보 업데이트
        queryClient.setQueryData(
          projectKeys.detail(id),
          { success: true, data: response.data }
        )
        
        // 프로젝트 목록 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
      }
    },
  })
}

// 프로젝트 삭제 뮤테이션
export function useDeleteProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => ProjectsAPI.deleteProject(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // 삭제된 프로젝트의 캐시 제거
        queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
        
        // 프로젝트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
      }
    },
  })
}

// 프로젝트 상태 업데이트 뮤테이션
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Project['status'] }) => 
      ProjectsAPI.updateStatus(id, status),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // 해당 프로젝트 상세 정보 업데이트
        queryClient.setQueryData(
          projectKeys.detail(id),
          { success: true, data: response.data }
        )
        
        // 프로젝트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
      }
    },
  })
}

// 프로젝트 진행률 업데이트 뮤테이션
export function useUpdateProjectProgress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => 
      ProjectsAPI.updateProgress(id, progress),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // 해당 프로젝트 상세 정보 업데이트
        queryClient.setQueryData(
          projectKeys.detail(id),
          { success: true, data: response.data }
        )
        
        // 프로젝트 목록과 통계 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
        queryClient.invalidateQueries({ queryKey: projectKeys.stats() })
      }
    },
  })
}