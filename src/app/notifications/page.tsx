'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  X,
  AlertCircle,
  Info,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Settings
} from 'lucide-react';

// 알림 타입 정의
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'invoice' | 'project' | 'client' | 'document' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 임시 알림 데이터
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '새 청구서 생성됨',
    message: 'INV-20241201-001 청구서가 성공적으로 생성되었습니다.',
    type: 'success',
    category: 'invoice',
    isRead: false,
    createdAt: '2024-12-01T09:30:00Z',
    actionUrl: '/invoices'
  },
  {
    id: '2',
    title: '프로젝트 완료',
    message: '웹사이트 리뉴얼 프로젝트가 완료되었습니다.',
    type: 'success',
    category: 'project',
    isRead: false,
    createdAt: '2024-12-01T08:15:00Z',
    actionUrl: '/projects'
  },
  {
    id: '3',
    title: '결제 알림',
    message: 'ABC 컴퍼니 청구서 결제 기한이 3일 남았습니다.',
    type: 'warning',
    category: 'invoice',
    isRead: true,
    createdAt: '2024-12-01T07:00:00Z',
    actionUrl: '/invoices'
  },
  {
    id: '4',
    title: '새 클라이언트 등록',
    message: '홍길동님이 새 클라이언트로 등록되었습니다.',
    type: 'info',
    category: 'client',
    isRead: true,
    createdAt: '2024-11-30T16:45:00Z',
    actionUrl: '/clients'
  },
  {
    id: '5',
    title: '문서 업로드 완료',
    message: '계약서_ABC컴퍼니.pdf 파일이 업로드되었습니다.',
    type: 'success',
    category: 'document',
    isRead: false,
    createdAt: '2024-11-30T14:20:00Z',
    actionUrl: '/documents'
  },
  {
    id: '6',
    title: '시스템 업데이트',
    message: '새로운 기능이 추가되었습니다. 업데이트 내용을 확인하세요.',
    type: 'info',
    category: 'system',
    isRead: true,
    createdAt: '2024-11-30T10:00:00Z'
  },
  {
    id: '7',
    title: '연체 알림',
    message: 'DEF 컴퍼니 청구서가 7일 연체되었습니다.',
    type: 'error',
    category: 'invoice',
    isRead: false,
    createdAt: '2024-11-29T09:00:00Z',
    actionUrl: '/invoices'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    
    return matchesSearch && matchesType && matchesCategory && matchesReadStatus;
  });

  // 알림 읽음 표시
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // 모든 알림 읽음 표시
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // 알림 삭제
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 아이콘 렌더링
  const getIcon = (type: Notification['type'], category: Notification['category']) => {
    if (category === 'invoice') return <DollarSign className="w-5 h-5" />;
    if (category === 'project') return <Calendar className="w-5 h-5" />;
    if (category === 'client') return <Users className="w-5 h-5" />;
    if (category === 'document') return <FileText className="w-5 h-5" />;
    if (category === 'system') return <Settings className="w-5 h-5" />;
    
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  // 색상 클래스
  const getColorClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">알림</h1>
            <p className="text-gray-600 mt-2">
              모든 알림과 업데이트를 확인하세요
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              읽지 않은 알림: {unreadCount}개
            </span>
            <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
              모두 읽음
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                <Input
                  placeholder="알림 제목 또는 내용 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">모든 타입</option>
                <option value="info">정보</option>
                <option value="success">성공</option>
                <option value="warning">경고</option>
                <option value="error">오류</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">모든 카테고리</option>
                <option value="invoice">청구서</option>
                <option value="project">프로젝트</option>
                <option value="client">클라이언트</option>
                <option value="document">문서</option>
                <option value="system">시스템</option>
              </select>

              {/* Unread Only Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">읽지 않은 알림만</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
                <p className="text-gray-600">
                  {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || showUnreadOnly
                    ? '검색 조건에 맞는 알림이 없습니다.'
                    : '새로운 알림이 도착하면 여기에 표시됩니다.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id} className={`transition-all ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${getColorClasses(notification.type)}`}>
                      {getIcon(notification.type, notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                            {!notification.isRead && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                새 알림
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              읽음
                            </Button>
                          )}
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                markAsRead(notification.id);
                                // TODO: Navigate to action URL
                                if (notification.actionUrl) {
                                  window.location.href = notification.actionUrl;
                                }
                              }}
                            >
                              보기
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}