// 대시보드용 통합 React Query 훅
import { useQuery } from '@tanstack/react-query'
import { useProjects, useProjectStats } from './useProjects'
import { useClients, useClientStats } from './useClients'

// 대시보드 전체 데이터를 효율적으로 가져오는 훅
export function useDashboardData() {
  // 각각의 데이터를 병렬로 가져오기
  const projectsQuery = useProjects({ limit: 5 }) // 최근 5개 프로젝트
  const clientsQuery = useClients({ limit: 100 }) // 전체 클라이언트 (통계용)
  const projectStatsQuery = useProjectStats()
  const clientStatsQuery = useClientStats()

  // 모든 쿼리의 로딩 상태
  const isLoading = projectsQuery.isLoading || 
                   clientsQuery.isLoading || 
                   projectStatsQuery.isLoading || 
                   clientStatsQuery.isLoading

  // 에러 상태
  const error = projectsQuery.error || 
               clientsQuery.error || 
               projectStatsQuery.error || 
               clientStatsQuery.error

  // 성공 상태 (모든 쿼리가 성공해야 함)
  const isSuccess = projectsQuery.isSuccess && 
                   clientsQuery.isSuccess && 
                   projectStatsQuery.isSuccess && 
                   clientStatsQuery.isSuccess

  // 데이터 가공
  const projects = projectsQuery.data?.data || []
  const clients = clientsQuery.data?.data || []
  const projectStats = projectStatsQuery.data
  const clientStats = clientStatsQuery.data

  // 대시보드 메트릭 계산
  const dashboardMetrics = {
    // 이번 달 수입 (완료된 프로젝트 기준)
    thisMonthRevenue: projects
      .filter(p => {
        const projectDate = new Date(p.created_at)
        const now = new Date()
        return p.status === 'completed' && 
               projectDate.getMonth() === now.getMonth() && 
               projectDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + (Number(p.budget) || 0), 0),

    // 이번 주 새 클라이언트 수
    thisWeekNewClients: clients.filter(c => {
      const clientDate = new Date(c.created_at)
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      return clientDate >= weekStart
    }).length,

    // 이번 달 완료된 프로젝트 수
    thisMonthCompleted: projects.filter(p => {
      const projectDate = new Date(p.created_at)
      const now = new Date()
      return p.status === 'completed' && 
             projectDate.getMonth() === now.getMonth() && 
             projectDate.getFullYear() === now.getFullYear()
    }).length,

    // 진행 중인 프로젝트 수
    inProgressProjects: projectStats?.active || 0,
  }

  return {
    // 쿼리 상태
    isLoading,
    error,
    isSuccess,
    
    // 원본 데이터
    projects,
    clients,
    projectStats,
    clientStats,
    
    // 계산된 메트릭
    dashboardMetrics,
    
    // 개별 쿼리 refetch 함수들
    refetch: {
      projects: projectsQuery.refetch,
      clients: clientsQuery.refetch,
      projectStats: projectStatsQuery.refetch,
      clientStats: clientStatsQuery.refetch,
    }
  }
}