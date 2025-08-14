'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  MoreHorizontalIcon,
  DollarSignIcon,
  CalendarIcon,
  SendIcon,
  AlertCircleIcon
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  project: string;
  amount: number;
  status: 'draft' | 'sent' | 'overdue' | 'paid';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    client: 'ABC Corp',
    project: 'ABC 스타트업 웹사이트 디자인',
    amount: 2500000,
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    paidDate: '2024-01-12'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    client: 'XYZ Inc',
    project: 'XYZ 모바일 앱 개발',
    amount: 5000000,
    status: 'sent',
    issueDate: '2024-01-05',
    dueDate: '2024-01-20'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    client: 'DEF Ltd',
    project: 'DEF 브랜딩 프로젝트',
    amount: 1800000,
    status: 'overdue',
    issueDate: '2023-12-15',
    dueDate: '2023-12-30'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    client: 'GHI Studio',
    project: 'GHI 로고 디자인',
    amount: 800000,
    status: 'draft',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25'
  }
];

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'sent': 'bg-blue-100 text-blue-800',
  'overdue': 'bg-red-100 text-red-800',
  'paid': 'bg-green-100 text-green-800'
};

const statusLabels = {
  'draft': '임시저장',
  'sent': '발송됨',
  'overdue': '연체',
  'paid': '결제완료'
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

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
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          새 청구서
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="청구서 번호, 클라이언트, 프로젝트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">모든 상태</option>
          <option value="draft">임시저장</option>
          <option value="sent">발송됨</option>
          <option value="overdue">연체</option>
          <option value="paid">결제완료</option>
        </select>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          필터
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 청구서</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 청구 금액</p>
                <p className="text-2xl font-bold">₩{totalAmount.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">수금 완료</p>
                <p className="text-2xl font-bold">₩{paidAmount.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">₩{pendingAmount.toLocaleString()}</p>
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
                {filteredInvoices.map((invoice) => {
                  const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                  return (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{invoice.client}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{invoice.project}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">₩{invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[invoice.status]}>
                          {statusLabels[invoice.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{invoice.issueDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600">{invoice.dueDate}</span>
                          {invoice.status !== 'paid' && daysUntilDue < 0 && (
                            <span className="text-xs text-red-600">
                              {Math.abs(daysUntilDue)}일 연체
                            </span>
                          )}
                          {invoice.status !== 'paid' && daysUntilDue >= 0 && daysUntilDue <= 7 && (
                            <span className="text-xs text-yellow-600">
                              {daysUntilDue}일 남음
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          {invoice.status === 'draft' && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <SendIcon className="h-3 w-3" />
                              발송
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
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
        </CardContent>
      </Card>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 청구서가 없습니다.</p>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}