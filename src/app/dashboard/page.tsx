"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import MetricCard from '@/components/ui/enhanced/MetricCard'
import DataTable from '@/components/ui/enhanced/DataTable'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/enhanced/StatusBadge'
import { useDashboardData } from '@/lib/react-query/hooks/useDashboard'
import { useTodaySchedules } from '@/lib/react-query/hooks/useSchedules'
import {
  BarChart3,
  TrendingUp,
  Users,
  FolderOpen,
  FileText,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  LoaderIcon
} from 'lucide-react'


const projectColumns = [
  {
    key: 'name',
    title: '프로젝트명',
    sortable: true,
    render: (value: string, row: any) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.client?.name || '클라이언트 정보 없음'}</div>
      </div>
    )
  },
  {
    key: 'status',
    title: '상태',
    render: (value: string) => <StatusBadge status={value} type="project" />
  },
  {
    key: 'progress',
    title: '진행률',
    render: (value: number) => (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-500 h-2 rounded-full" 
            style={{ width: `${value || 0}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{value || 0}%</span>
      </div>
    )
  },
  {
    key: 'deadline',
    title: '마감일',
    render: (value: string) => (
      <div className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString('ko-KR') : '-'}
      </div>
    )
  },
  {
    key: 'budget',
    title: '예산',
    align: 'right' as const,
    render: (value: number) => (
      <div className="font-medium text-gray-900">
        ₩{Number(value || 0).toLocaleString()}
      </div>
    )
  }
]

export default function DashboardPage() {
  const router = useRouter()
  
  // React Query를 사용한 데이터 가져오기 (캐싱 적용됨)
  const {
    isLoading,
    error,
    projects,
    clients,
    projectStats,
    clientStats,
    dashboardMetrics,
    refetch
  } = useDashboardData()
  
  // 오늘의 일정 가져오기
  const { data: todaySchedulesData, isLoading: scheduleLoading, error: scheduleError } = useTodaySchedules()
  
  // 최근 5개 프로젝트 (생성일 기준 정렬)
  const recentProjects = projects
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const handleNewProject = () => {
    router.push('/projects')
  }

  const handleNewClient = () => {
    router.push('/clients')
  }

  const handleNewEstimate = () => {
    router.push('/documents')
  }

  const handleTimeTracking = () => {
    // 시간 기록 기능은 향후 구현
    router.push('/schedules')
  }

  const handleViewAllProjects = () => {
    router.push('/projects')
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600">오늘의 업무 현황을 확인하세요</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              이번 주
            </Button>
            <Button onClick={handleNewProject}>
              <Plus className="w-4 h-4 mr-2" />
              새 프로젝트
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="이번 달 수입"
            value={isLoading ? "로딩 중..." : `₩${dashboardMetrics.thisMonthRevenue.toLocaleString()}`}
            change="-"
            trend="neutral"
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            description="완료된 프로젝트"
          />
          <MetricCard
            title="진행 중인 프로젝트"
            value={isLoading ? "로딩 중..." : dashboardMetrics.inProgressProjects.toString()}
            change="-"
            trend="neutral"
            icon={<FolderOpen className="w-5 h-5 text-blue-600" />}
            description="개"
          />
          <MetricCard
            title="새 클라이언트"
            value={isLoading ? "로딩 중..." : dashboardMetrics.thisWeekNewClients.toString()}
            change="-"
            trend="neutral"
            icon={<Users className="w-5 h-5 text-purple-600" />}
            description="이번 주"
          />
          <MetricCard
            title="완료된 작업"
            value={isLoading ? "로딩 중..." : dashboardMetrics.thisMonthCompleted.toString()}
            change="-"
            trend="neutral"
            icon={<BarChart3 className="w-5 h-5 text-orange-600" />}
            description="이번 달"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <h2 className="text-lg font-semibold text-gray-900">최근 프로젝트</h2>
                <Button variant="ghost" size="sm" onClick={handleViewAllProjects}>
                  전체 보기
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoaderIcon className="w-6 h-6 animate-spin text-teal-600" />
                    <span className="ml-2 text-gray-600">로딩 중...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-red-600">데이터 로드 중 오류가 발생했습니다.</span>
                  </div>
                ) : (
                  <DataTable
                    data={recentProjects}
                    columns={projectColumns}
                    searchable={false}
                    actions={false}
                    pageSize={5}
                    emptyMessage="진행 중인 프로젝트가 없습니다."
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Today's Schedule */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">빠른 작업</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleNewProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  새 프로젝트
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleNewClient}>
                  <Users className="w-4 h-4 mr-2" />
                  클라이언트 추가
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleNewEstimate}>
                  <FileText className="w-4 h-4 mr-2" />
                  견적서 생성
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleTimeTracking}>
                  <Clock className="w-4 h-4 mr-2" />
                  시간 기록
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">오늘의 일정</h3>
              </CardHeader>
              <CardContent>
                {scheduleLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoaderIcon className="w-4 h-4 animate-spin text-teal-600" />
                    <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
                  </div>
                ) : scheduleError ? (
                  <div className="text-center py-4">
                    <span className="text-sm text-red-600">일정을 불러올 수 없습니다.</span>
                  </div>
                ) : todaySchedulesData?.data && todaySchedulesData.data.length > 0 ? (
                  <div className="space-y-4">
                    {todaySchedulesData.data.slice(0, 3).map((schedule) => {
                      const startTime = new Date(schedule.start_time).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                      
                      const colorMap = {
                        blue: 'bg-blue-500',
                        green: 'bg-green-500',
                        yellow: 'bg-yellow-500',
                        red: 'bg-red-500',
                        purple: 'bg-purple-500',
                        orange: 'bg-orange-500'
                      }
                      
                      return (
                        <div key={schedule.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 ${colorMap[schedule.color]} rounded-full mt-2`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{schedule.title}</p>
                            <p className="text-xs text-gray-500">
                              {startTime}
                              {schedule.client?.name && ` - ${schedule.client.name}`}
                              {schedule.project?.name && ` - ${schedule.project.name}`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    {todaySchedulesData.data.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/schedules')}>
                          {todaySchedulesData.data.length - 3}개 더 보기
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">오늘 예정된 일정이 없습니다.</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => router.push('/schedules')}
                    >
                      일정 추가하기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}