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
  CalendarIcon,
  DollarSignIcon,
  UsersIcon
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  dueDate: string;
  budget: number;
  team: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ABC 스타트업 웹사이트 디자인',
    client: 'ABC Corp',
    status: 'in-progress',
    progress: 75,
    dueDate: '2024-01-15',
    budget: 2500000,
    team: ['김디자이너', '이개발자']
  },
  {
    id: '2',
    name: 'XYZ 모바일 앱 개발',
    client: 'XYZ Inc',
    status: 'review',
    progress: 90,
    dueDate: '2024-01-20',
    budget: 5000000,
    team: ['박개발자', '최기획자', '신디자이너']
  },
  {
    id: '3',
    name: 'DEF 브랜딩 프로젝트',
    client: 'DEF Ltd',
    status: 'planning',
    progress: 25,
    dueDate: '2024-01-25',
    budget: 1800000,
    team: ['윤디자이너']
  }
];

const statusColors = {
  'planning': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800'
};

const statusLabels = {
  'planning': '진행 전',
  'in-progress': '진행 중',
  'review': '피드백',
  'completed': '완료'
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          새 프로젝트
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="프로젝트 또는 클라이언트 검색..."
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
          <option value="planning">진행 전</option>
          <option value="in-progress">진행 중</option>
          <option value="review">피드백</option>
          <option value="completed">완료</option>
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
                <p className="text-sm font-medium text-gray-600">전체 프로젝트</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-4 w-4 text-blue-600" />
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
                  {projects.filter(p => p.status === 'in-progress').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-green-600" />
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
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-yellow-600" />
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
                  ₩{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSignIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle>{project.name}</CardTitle>
                  <p className="text-sm text-gray-600">{project.client}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={statusColors[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {project.dueDate}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSignIcon className="h-4 w-4" />
                  ₩{project.budget.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                    >
                      {member.charAt(0)}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  상세보기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">검색 조건에 맞는 프로젝트가 없습니다.</p>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}