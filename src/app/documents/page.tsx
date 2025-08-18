'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/enhanced/StatusBadge';
import Input from '@/components/ui/Input';
import { useDocumentStore, useDocumentSelectors } from '@/stores/useDocumentStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useClientStore } from '@/stores/useClientStore';
import DocumentCreateModal from '@/components/forms/DocumentCreateModal';
import type { DocumentWithRelations } from '@/types/database';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  MoreHorizontalIcon,
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  CalendarIcon,
  LoaderIcon
} from 'lucide-react';

// 한국어 타입 라벨
const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'quote': '견적서',
    'contract': '계약서', 
    'invoice': '청구서',
    'report': '보고서',
    'general': '일반문서'
  }
  return typeLabels[type] || type
}

// 파일 크기 포맷팅
const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '-'
  const sizes = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < sizes.length - 1) {
    size /= 1024
    i++
  }
  return `${Math.round(size * 100) / 100}${sizes[i]}`
}

// 날짜 포맷팅
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}


export default function DocumentsPage() {
  const router = useRouter()
  
  // Zustand 스토어 사용
  const {
    documents,
    isLoading,
    error,
    searchQuery,
    typeFilter,
    statusFilter,
    fetchDocuments,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    setError
  } = useDocumentStore()
  
  const { filteredDocuments, documentStats } = useDocumentSelectors()
  
  // 로컬 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // 프로젝트와 클라이언트 데이터 로드
  const { fetchProjects } = useProjectStore()
  const { fetchClients } = useClientStore()
  
  // 초기 데이터 로딩
  useEffect(() => {
    fetchDocuments()
    fetchProjects()
    fetchClients()
  }, [fetchDocuments, fetchProjects, fetchClients])
  
  // 검색어 변경 시 다시 조회
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, typeFilter, statusFilter, fetchDocuments])

  const handleNewDocument = () => {
    setIsCreateModalOpen(true)
  }

  const handleViewDocument = (document: DocumentWithRelations) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank')
    } else {
      alert('파일이 업로드되지 않은 문서입니다.')
    }
  }

  const handleDownloadDocument = (document: DocumentWithRelations) => {
    if (document.file_url) {
      const link = document.createElement('a')
      link.href = document.file_url
      link.download = document.title
      link.click()
    } else {
      alert('다운로드할 파일이 없습니다.')
    }
  }

  const handleDocumentMenu = (document: DocumentWithRelations) => {
    // TODO: 문서 메뉴 구현 (편집, 삭제, 상태 변경 등)
    alert(`"${document.title}" 메뉴 기능은 곧 구현될 예정입니다.`)
  }

  // 에러 처리
  const handleDismissError = () => {
    setError(null)
  }

  // 에러 상태 처리
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800">오류가 발생했습니다: {error}</p>
              <Button variant="ghost" size="sm" onClick={handleDismissError}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">문서</h1>
          <p className="text-gray-600 mt-2">
            견적서, 계약서, 청구서 등을 관리하세요
          </p>
        </div>
        <Button className="gap-2" onClick={handleNewDocument}>
          <PlusIcon className="h-4 w-4" />
          새 문서
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="문서 제목 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">모든 문서</option>
          <option value="quote">견적서</option>
          <option value="contract">계약서</option>
          <option value="invoice">청구서</option>
          <option value="report">보고서</option>
          <option value="general">일반문서</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">모든 상태</option>
          <option value="draft">임시저장</option>
          <option value="sent">발송됨</option>
          <option value="approved">승인됨</option>
          <option value="rejected">반려됨</option>
        </select>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          필터
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 문서</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">견적서</p>
                <p className="text-2xl font-bold">{documentStats.quote}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">계약서</p>
                <p className="text-2xl font-bold">{documentStats.contract}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">청구서</p>
                <p className="text-2xl font-bold">{documentStats.invoice}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 용량</p>
                <p className="text-2xl font-bold">{formatFileSize(documentStats.totalSize)}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>문서 목록</span>
            {isLoading && (
              <LoaderIcon className="h-4 w-4 animate-spin text-gray-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <LoaderIcon className="h-8 w-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">문서를 불러오는 중...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">문서 제목</th>
                    <th className="text-left py-3 px-4 font-medium">유형</th>
                    <th className="text-left py-3 px-4 font-medium">프로젝트</th>
                    <th className="text-left py-3 px-4 font-medium">클라이언트</th>
                    <th className="text-left py-3 px-4 font-medium">상태</th>
                    <th className="text-left py-3 px-4 font-medium">생성일</th>
                    <th className="text-left py-3 px-4 font-medium">크기</th>
                    <th className="text-right py-3 px-4 font-medium">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            doc.type === 'quote' ? 'bg-blue-100' :
                            doc.type === 'contract' ? 'bg-purple-100' :
                            doc.type === 'invoice' ? 'bg-green-100' :
                            doc.type === 'report' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            <FileTextIcon className={`h-5 w-5 ${
                              doc.type === 'quote' ? 'text-blue-600' :
                              doc.type === 'contract' ? 'text-purple-600' :
                              doc.type === 'invoice' ? 'text-green-600' :
                              doc.type === 'report' ? 'text-orange-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            {doc.file_url && (
                              <p className="text-xs text-gray-500">파일 첨부됨</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          doc.type === 'quote' ? 'bg-blue-100 text-blue-800' :
                          doc.type === 'contract' ? 'bg-purple-100 text-purple-800' :
                          doc.type === 'invoice' ? 'bg-green-100 text-green-800' :
                          doc.type === 'report' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getTypeLabel(doc.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {doc.project?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {doc.client?.name || doc.project?.client?.name || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={doc.status} type="document" />
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(doc.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDocument(doc)}
                            disabled={!doc.file_url}
                            title={doc.file_url ? '문서 보기' : '파일이 없습니다'}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownloadDocument(doc)}
                            disabled={!doc.file_url}
                            title={doc.file_url ? '다운로드' : '파일이 없습니다'}
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDocumentMenu(doc)}
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileTextIcon className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg mb-2">문서가 없습니다</p>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' 
              ? '검색 조건에 맞는 문서가 없습니다.' 
              : '첫 번째 문서를 생성해보세요.'}
          </p>
          <Button onClick={handleNewDocument} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            새 문서 만들기
          </Button>
        </div>
      )}

      {/* 문서 생성 모달 */}
      <DocumentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      </div>
    </DashboardLayout>
  );
}