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
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  CalendarIcon
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'estimate' | 'contract' | 'invoice' | 'report';
  client: string;
  status: 'draft' | 'sent' | 'approved' | 'paid';
  amount?: number;
  createdDate: string;
  dueDate?: string;
  fileSize: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'ABC Corp 웹사이트 디자인 견적서',
    type: 'estimate',
    client: 'ABC Corp',
    status: 'approved',
    amount: 2500000,
    createdDate: '2024-01-05',
    dueDate: '2024-01-15',
    fileSize: '245KB'
  },
  {
    id: '2',
    title: 'XYZ Inc 모바일 앱 개발 계약서',
    type: 'contract',
    client: 'XYZ Inc',
    status: 'sent',
    amount: 5000000,
    createdDate: '2024-01-08',
    fileSize: '892KB'
  },
  {
    id: '3',
    title: 'DEF Ltd 브랜딩 프로젝트 청구서',
    type: 'invoice',
    client: 'DEF Ltd',
    status: 'paid',
    amount: 1800000,
    createdDate: '2024-01-10',
    dueDate: '2024-01-25',
    fileSize: '156KB'
  },
  {
    id: '4',
    title: '2023년 4분기 수익 보고서',
    type: 'report',
    client: '내부 문서',
    status: 'draft',
    createdDate: '2024-01-12',
    fileSize: '1.2MB'
  }
];

const typeColors = {
  'estimate': 'bg-blue-100 text-blue-800',
  'contract': 'bg-purple-100 text-purple-800',
  'invoice': 'bg-green-100 text-green-800',
  'report': 'bg-gray-100 text-gray-800'
};

const typeLabels = {
  'estimate': '견적서',
  'contract': '계약서',
  'invoice': '청구서',
  'report': '보고서'
};

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'sent': 'bg-blue-100 text-blue-800',
  'approved': 'bg-yellow-100 text-yellow-800',
  'paid': 'bg-green-100 text-green-800'
};

const statusLabels = {
  'draft': '임시저장',
  'sent': '발송됨',
  'approved': '승인됨',
  'paid': '결제완료'
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

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
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          새 문서
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="문서 제목 또는 클라이언트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">모든 문서</option>
          <option value="estimate">견적서</option>
          <option value="contract">계약서</option>
          <option value="invoice">청구서</option>
          <option value="report">보고서</option>
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
                <p className="text-sm font-medium text-gray-600">전체 문서</p>
                <p className="text-2xl font-bold">{documents.length}</p>
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
                <p className="text-sm font-medium text-gray-600">견적서</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.type === 'estimate').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">청구서</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.type === 'invoice').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 금액</p>
                <p className="text-2xl font-bold">
                  ₩{documents.filter(d => d.amount).reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>문서 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">문서 제목</th>
                  <th className="text-left py-3 px-4 font-medium">유형</th>
                  <th className="text-left py-3 px-4 font-medium">클라이언트</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">금액</th>
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
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileTextIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          {doc.dueDate && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              마감: {doc.dueDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={typeColors[doc.type]}>
                        {typeLabels[doc.type]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{doc.client}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[doc.status]}>
                        {statusLabels[doc.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {doc.amount ? (
                        <span className="font-medium">₩{doc.amount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{doc.createdDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{doc.fileSize}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 문서가 없습니다.</p>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}