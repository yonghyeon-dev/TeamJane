'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/enhanced/StatusBadge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ProjectForm from '@/components/forms/ProjectForm';
import { useProjectStore, useProjectSelectors } from '@/stores/useProjectStore';
import { useError } from '@/contexts/ErrorContext';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreHorizontalIcon,
  CalendarIcon,
  DollarSignIcon,
  UsersIcon,
  LoaderIcon,
  SortAscIcon,
  SortDescIcon,
  XIcon
} from 'lucide-react';


export default function ProjectsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError, handleApiError } = useError();
  
  // Zustand 상태 관리 사용
  const { 
    projects, 
    isLoading, 
    error, 
    searchQuery, 
    statusFilter,
    fetchProjects, 
    createProject, 
    setSearchQuery, 
    setStatusFilter,
    setError 
  } = useProjectStore();
  
  const { filteredProjects, projectStats } = useProjectSelectors();
  
  // 컴포넌트 마운트 시 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
      } catch (err) {
        handleApiError(err, '프로젝트 데이터 로드 실패');
      }
    };
    
    loadProjects();
  }, [fetchProjects, handleApiError]);

  // 검색어 debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProjects();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchProjects]);

  // 상태 필터 변경 시 즉시 검색
  useEffect(() => {
    fetchProjects();
  }, [statusFilter, fetchProjects]);

  // 정렬된 프로젝트 목록
  const sortedFilteredProjects = [...filteredProjects].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'deadline':
        aValue = a.deadline ? new Date(a.deadline).getTime() : 0;
        bValue = b.deadline ? new Date(b.deadline).getTime() : 0;
        break;
      case 'budget':
        aValue = Number(a.budget) || 0;
        bValue = Number(b.budget) || 0;
        break;
      case 'progress':
        aValue = a.progress || 0;
        bValue = b.progress || 0;
        break;
      case 'created_at':
      default:
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleNewProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleProjectCreated = async () => {
    try {
      // 프로젝트 생성 성공 시 모달 닫기
      // Zustand의 optimistic update가 자동으로 UI를 업데이트함
      setIsCreateModalOpen(false);
      
      // 성공 메시지 표시
      showSuccess('프로젝트 생성 완료', '새 프로젝트가 성공적으로 생성되었습니다.');
      
      // 에러가 있다면 초기화
      if (error) {
        setError(null);
      }
    } catch (err) {
      handleApiError(err, '프로젝트 생성 실패');
    }
  };

  const handleProjectDetail = (projectId: string) => {
    // 프로젝트 상세 페이지로 이동 (향후 구현)
    alert(`프로젝트 ${projectId} 상세 페이지는 곧 출시됩니다!`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">프로젝트</h1>
          <p className="text-gray-600 mt-2">
            진행 중인 프로젝트를 관리하고 추적하세요
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
              오류: {error}
            </div>
          )}
        </div>
        <Button className="gap-2" onClick={handleNewProject} disabled={isLoading}>
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          새 프로젝트
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="프로젝트 또는 클라이언트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white disabled:opacity-50"
          disabled={isLoading}
        >
          <option value="all">모든 상태</option>
          <option value="planning">진행 전</option>
          <option value="in_progress">진행 중</option>
          <option value="review">피드백</option>
          <option value="completed">완료</option>
        </select>
        <Button 
          variant={showFilters ? "default" : "outline"} 
          className="gap-2" 
          disabled={isLoading}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="h-4 w-4" />
          필터
        </Button>
        {(searchQuery || statusFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <XIcon className="h-4 w-4" />
            초기화
          </Button>
        )}
      </div>
      
      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="created_at">생성일</option>
                <option value="name">이름</option>
                <option value="deadline">마감일</option>
                <option value="budget">예산</option>
                <option value="progress">진행률</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {sortOrder === 'asc' ? (
                  <SortAscIcon className="h-4 w-4" />
                ) : (
                  <SortDescIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                총 {filteredProjects.length}개 프로젝트
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 프로젝트</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    projectStats.total
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">진행 중</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    projectStats.inProgress
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    projectStats.completed
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 예산</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    `₩${projectStats.totalBudget.toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <LoaderIcon className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">프로젝트를 불러오는 중...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFilteredProjects.map((project) => (
            <Card key={project.id} className="">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle>{project.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {project.client?.name || '클라이언트 정보 없음'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <StatusBadge status={project.status} type="project" />
                  <span className="text-sm font-medium">{project.progress || 0}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {project.deadline ? new Date(project.deadline).toLocaleDateString('ko-KR') : '마감일 없음'}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSignIcon className="h-4 w-4" />
                    ₩{Number(project.budget || 0).toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {/* 팀 멤버 표시 (향후 구현) */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                      ?
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleProjectDetail(project.id)}>
                    상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 프로젝트가 없습니다.</p>
        </div>
      )}
      </div>

      {/* 프로젝트 생성 모달 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="새 프로젝트 생성"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              type="submit"
              form="project-form"
              className="flex-1"
            >
              프로젝트 생성
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              취소
            </Button>
          </div>
        }
      >
        <ProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}