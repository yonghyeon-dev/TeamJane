'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/enhanced/StatusBadge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ClientForm from '@/components/forms/ClientForm';
import { useClientStore, useClientSelectors } from '@/stores/useClientStore';
import { useError } from '@/contexts/ErrorContext';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  UserIcon,
  LoaderIcon,
  SortAscIcon,
  SortDescIcon,
  XIcon
} from 'lucide-react';



export default function ClientsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError, handleApiError } = useError();
  
  // Zustand 상태 관리 사용
  const { 
    clients, 
    isLoading, 
    error, 
    searchQuery, 
    statusFilter,
    fetchClients, 
    createClient, 
    setSearchQuery, 
    setStatusFilter,
    setError 
  } = useClientStore();
  
  const { filteredClients, clientStats } = useClientSelectors();
  
  // 컴포넌트 마운트 시 클라이언트 데이터 로드
  useEffect(() => {
    const loadClients = async () => {
      try {
        await fetchClients();
      } catch (err) {
        handleApiError(err, '클라이언트 데이터 로드 실패');
      }
    };
    
    loadClients();
  }, [fetchClients, handleApiError]);

  // 검색어 debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchClients();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchClients]);

  // 상태 필터 변경 시 즉시 검색
  useEffect(() => {
    fetchClients();
  }, [statusFilter, fetchClients]);

  // 정렬된 클라이언트 목록
  const sortedFilteredClients = [...filteredClients].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'company':
        aValue = (a.company || '').toLowerCase();
        bValue = (b.company || '').toLowerCase();
        break;
      case 'email':
        aValue = (a.email || '').toLowerCase();
        bValue = (b.email || '').toLowerCase();
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

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleNewClient = () => {
    setIsCreateModalOpen(true);
  };

  const handleClientCreated = async () => {
    try {
      // 클라이언트 생성 성공 시 모달 닫기
      // Zustand의 optimistic update가 자동으로 UI를 업데이트함
      setIsCreateModalOpen(false);
      
      // 성공 메시지 표시
      showSuccess('클라이언트 생성 완료', '새 클라이언트가 성공적으로 생성되었습니다.');
      
      // 에러가 있다면 초기화
      if (error) {
        setError(null);
      }
    } catch (err) {
      handleApiError(err, '클라이언트 생성 실패');
    }
  };

  const handleContactClient = (clientId: string, clientName: string) => {
    // 클라이언트 연락 기능 (향후 구현)
    alert(`${clientName}님에게 연락하는 기능은 곧 출시됩니다!`);
  };

  const handleClientDetail = (clientId: string, clientName: string) => {
    // 클라이언트 상세 페이지로 이동 (향후 구현)
    alert(`${clientName}님의 상세 정보는 곧 출시됩니다!`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">클라이언트</h1>
          <p className="text-gray-600 mt-2">
            고객 정보와 관계를 관리하세요
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
              오류: {error}
            </div>
          )}
        </div>
        <Button className="gap-2" onClick={handleNewClient} disabled={isLoading}>
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          새 클라이언트
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="이름, 회사, 이메일 검색..."
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
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="potential">잠재고객</option>
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
                <option value="company">회사</option>
                <option value="email">이메일</option>
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
                총 {filteredClients.length}개 클라이언트
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
                <p className="text-sm font-medium text-gray-600">전체 클라이언트</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    clientStats.total
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 클라이언트</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    clientStats.active
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">잠재고객</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    clientStats.potential
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">비활성</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    clientStats.inactive
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <BuildingIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      {isLoading && clients.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <LoaderIcon className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">클라이언트를 불러오는 중...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFilteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <p className="text-sm text-gray-600">{client.company || '회사 정보 없음'}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusBadge status={client.status} type="client" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MailIcon className="h-4 w-4" />
                    {client.email || '이메일 없음'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    {client.phone || '전화번호 없음'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">-</p>
                    <p className="text-xs text-gray-600">프로젝트</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">-</p>
                    <p className="text-xs text-gray-600">총 매출</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>생성일</span>
                  <span>{client.created_at ? new Date(client.created_at).toLocaleDateString('ko-KR') : '-'}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleContactClient(client.id, client.name)}>
                    연락하기
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleClientDetail(client.id, client.name)}>
                    상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sortedFilteredClients.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 클라이언트가 없습니다.</p>
          {(searchQuery || statusFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={clearFilters}
            >
              필터 초기화
            </Button>
          )}
        </div>
      )}
      </div>

      {/* 클라이언트 생성 모달 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="새 클라이언트 추가"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              form="client-form"
              className="min-w-[100px]"
            >
              클라이언트 생성
            </Button>
          </div>
        }
      >
        <ClientForm
          onSuccess={handleClientCreated}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}