'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/enhanced/StatusBadge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import InvoiceForm from '@/components/forms/InvoiceForm';
import { useInvoiceStore, useInvoiceSelectors } from '@/stores/useInvoiceStore';
import { useError } from '@/contexts/ErrorContext';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  MoreHorizontalIcon,
  DollarSignIcon,
  CalendarIcon,
  SendIcon,
  AlertCircleIcon,
  LoaderIcon,
  SortAscIcon,
  SortDescIcon,
  XIcon
} from 'lucide-react';


export default function InvoicesPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError, handleApiError } = useError();
  
  // Zustand 상태 관리 사용
  const { 
    invoices, 
    isLoading, 
    error, 
    searchQuery, 
    statusFilter,
    fetchInvoices, 
    updateInvoice,
    setSearchQuery, 
    setStatusFilter,
    setError 
  } = useInvoiceStore();
  
  const { filteredInvoices, invoiceStats } = useInvoiceSelectors();
  
  // 컴포넌트 마운트 시 청구서 데이터 로드
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        await fetchInvoices();
      } catch (err) {
        handleApiError(err, '청구서 데이터 로드 실패');
      }
    };
    
    loadInvoices();
  }, [fetchInvoices, handleApiError]);

  // 검색어 debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchInvoices();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchInvoices]);

  // 상태 필터 변경 시 즉시 검색
  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, fetchInvoices]);

  // 정렬된 청구서 목록
  const sortedFilteredInvoices = [...filteredInvoices].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'invoice_number':
        aValue = a.invoice_number?.toLowerCase() || '';
        bValue = b.invoice_number?.toLowerCase() || '';
        break;
      case 'amount':
        aValue = Number(a.amount) || 0;
        bValue = Number(b.amount) || 0;
        break;
      case 'due_date':
        aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
        bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
        break;
      case 'issue_date':
        aValue = a.issue_date ? new Date(a.issue_date).getTime() : 0;
        bValue = b.issue_date ? new Date(b.issue_date).getTime() : 0;
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

  const handleNewInvoice = () => {
    setIsCreateModalOpen(true);
  };

  const handleInvoiceCreated = async () => {
    try {
      setIsCreateModalOpen(false);
      showSuccess('청구서 생성 완료', '새 청구서가 성공적으로 생성되었습니다.');
      
      if (error) {
        setError(null);
      }
    } catch (err) {
      handleApiError(err, '청구서 생성 실패');
    }
  };

  const handleSendInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      await updateInvoice(invoiceId, { status: 'sent' });
      showSuccess('청구서 발송', `청구서 ${invoiceNumber}가 발송되었습니다.`);
    } catch (err) {
      handleApiError(err, '청구서 발송 실패');
    }
  };

  const handleInvoiceMenu = (invoiceId: string, invoiceNumber: string) => {
    alert(`청구서 ${invoiceNumber} 메뉴 기능은 곧 출시됩니다!`);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">청구서</h1>
          <p className="text-gray-600 mt-2">
            청구서 발행과 결제 현황을 관리하세요
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
              오류: {error}
            </div>
          )}
        </div>
        <Button className="gap-2" onClick={handleNewInvoice} disabled={isLoading}>
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          새 청구서
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="청구서 번호, 클라이언트, 프로젝트 검색..."
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
          <option value="draft">임시저장</option>
          <option value="sent">발송됨</option>
          <option value="overdue">연체</option>
          <option value="paid">결제완료</option>
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
                <option value="invoice_number">청구서 번호</option>
                <option value="amount">금액</option>
                <option value="issue_date">발행일</option>
                <option value="due_date">마감일</option>
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
                총 {filteredInvoices.length}개 청구서
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
                <p className="text-sm font-medium text-gray-600">전체 청구서</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    invoiceStats.total
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 청구 금액</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    `₩${invoiceStats.totalAmount.toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">수금 완료</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    `₩${invoiceStats.paidAmount.toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">미수금</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    `₩${invoiceStats.pendingAmount.toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>청구서 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && invoices.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <LoaderIcon className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-gray-600">청구서를 불러오는 중...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">청구서 번호</th>
                    <th className="text-left py-3 px-4 font-medium">클라이언트</th>
                    <th className="text-left py-3 px-4 font-medium">프로젝트</th>
                    <th className="text-left py-3 px-4 font-medium">금액</th>
                    <th className="text-left py-3 px-4 font-medium">상태</th>
                    <th className="text-left py-3 px-4 font-medium">발행일</th>
                    <th className="text-left py-3 px-4 font-medium">마감일</th>
                    <th className="text-right py-3 px-4 font-medium">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredInvoices.map((invoice) => {
                    const daysUntilDue = invoice.due_date ? getDaysUntilDue(invoice.due_date) : 0;
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium">{invoice.invoice_number || '-'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">{invoice.project?.client?.name || '클라이언트 정보 없음'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">{invoice.project?.name || '프로젝트 정보 없음'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">₩{Number(invoice.amount || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={invoice.status} type="invoice" />
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('ko-KR') : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ko-KR') : '-'}
                            </span>
                            {invoice.status !== 'paid' && invoice.due_date && daysUntilDue < 0 && (
                              <span className="text-xs text-red-600">
                                {Math.abs(daysUntilDue)}일 연체
                              </span>
                            )}
                            {invoice.status !== 'paid' && invoice.due_date && daysUntilDue >= 0 && daysUntilDue <= 7 && (
                              <span className="text-xs text-yellow-600">
                                {daysUntilDue}일 남음
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 justify-end">
                            {invoice.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1" 
                                onClick={() => handleSendInvoice(invoice.id, invoice.invoice_number || '')}
                                disabled={isLoading}
                              >
                                <SendIcon className="h-3 w-3" />
                                발송
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleInvoiceMenu(invoice.id, invoice.invoice_number || '')}
                              disabled={isLoading}
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {sortedFilteredInvoices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 청구서가 없습니다.</p>
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

      {/* 청구서 생성 모달 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="새 청구서 생성"
        size="xl"
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
              form="invoice-form"
              className="min-w-[100px]"
            >
              청구서 생성
            </Button>
          </div>
        }
      >
        <InvoiceForm
          onSuccess={handleInvoiceCreated}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}