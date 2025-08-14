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
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  UserIcon
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'prospect';
  totalProjects: number;
  totalRevenue: number;
  lastContact: string;
  avatar?: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: '김철수',
    company: 'ABC Corp',
    email: 'kim@abccorp.com',
    phone: '010-1234-5678',
    status: 'active',
    totalProjects: 3,
    totalRevenue: 8500000,
    lastContact: '2024-01-10'
  },
  {
    id: '2', 
    name: '이영희',
    company: 'XYZ Inc',
    email: 'lee@xyzinc.com',
    phone: '010-9876-5432',
    status: 'active',
    totalProjects: 2,
    totalRevenue: 12000000,
    lastContact: '2024-01-08'
  },
  {
    id: '3',
    name: '박민수',
    company: 'DEF Ltd',
    email: 'park@defltd.com', 
    phone: '010-5555-7777',
    status: 'prospect',
    totalProjects: 0,
    totalRevenue: 0,
    lastContact: '2024-01-05'
  },
  {
    id: '4',
    name: '정소연',
    company: 'GHI Studio',
    email: 'jung@ghistudio.com',
    phone: '010-3333-4444',
    status: 'inactive',
    totalProjects: 1,
    totalRevenue: 2500000,
    lastContact: '2023-12-15'
  }
];

const statusColors = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'prospect': 'bg-blue-100 text-blue-800'
};

const statusLabels = {
  'active': '활성',
  'inactive': '비활성',
  'prospect': '잠재고객'
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          새 클라이언트
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="이름, 회사, 이메일 검색..."
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
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="prospect">잠재고객</option>
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
                <p className="text-sm font-medium text-gray-600">전체 클라이언트</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600" />
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
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-green-600" />
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
                  {clients.filter(c => c.status === 'prospect').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 매출</p>
                <p className="text-2xl font-bold">
                  ₩{clients.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BuildingIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
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
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className={statusColors[client.status]}>
                {statusLabels[client.status]}
              </Badge>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MailIcon className="h-4 w-4" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  {client.phone}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{client.totalProjects}</p>
                  <p className="text-xs text-gray-600">프로젝트</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ₩{(client.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-600">총 매출</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>마지막 연락</span>
                <span>{client.lastContact}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  연락하기
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  상세보기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 클라이언트가 없습니다.</p>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}