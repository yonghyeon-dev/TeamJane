"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-context'
import { useNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/lib/react-query/hooks/useNotifications'
import { getUserDisplayInfo, formatTimeAgo, formatUserInfo, formatUserInfoVertical } from '@/lib/utils/user-display'
import Button from '@/components/ui/Button'
import {
  Home,
  FolderOpen,
  Users,
  FileText,
  Receipt,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  { name: '대시보드', href: '/dashboard', icon: Home },
  { name: '프로젝트', href: '/projects', icon: FolderOpen },
  { name: '클라이언트', href: '/clients', icon: Users },
  { name: '문서', href: '/documents', icon: FileText },
  { name: '청구서', href: '/invoices', icon: Receipt },
  { name: '설정', href: '/settings', icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const userDisplayInfo = getUserDisplayInfo(user)
  
  // 실제 알림 데이터 가져오기
  const { data: notificationsData } = useNotifications({ limit: 10 })
  const { data: unreadCount = 0 } = useUnreadNotificationsCount()
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()
  
  const recentNotifications = notificationsData?.data || []

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
  }

  // 외부 클릭 시 알림 닫기 - 메모리 누수 방지 개선
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-notification-dropdown]')) {
        setNotificationsOpen(false)
      }
    }

    // 이벤트 리스너 추가/제거 로직 개선
    if (notificationsOpen) {
      // 약간의 지연을 두어 현재 클릭이 처리된 후 리스너 등록
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, { passive: true })
      }, 0)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }

    // notificationsOpen이 false일 때도 cleanup 함수 반환
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 xl:w-72",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/favicon.ico"
                alt="WEAVE Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">WEAVE</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-700 border border-primary-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="border-t px-4 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                {formatUserInfoVertical(
                  user, 
                  true, 
                  'text-sm font-medium text-gray-900 truncate',
                  'text-xs text-gray-500 truncate'
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="검색..."
                    className="pl-10 pr-4 py-2 w-80 xl:w-96 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" data-notification-dropdown>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={handleNotifications}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">알림</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAllAsReadMutation.mutate()}
                          className="text-xs text-blue-600 hover:text-blue-700"
                          disabled={markAllAsReadMutation.isPending}
                        >
                          {markAllAsReadMutation.isPending ? '처리 중...' : '모두 읽기'}
                        </Button>
                      )}
                    </div>
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              if (!notification.is_read) {
                                markAsReadMutation.mutate(notification.id)
                              }
                              if (notification.action_url) {
                                setNotificationsOpen(false)
                                router.push(notification.action_url)
                              }
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            } ${!notification.is_read ? 'ring-2 ring-offset-1 ring-current' : ''}`}></div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                                {!notification.is_read && (
                                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.created_at)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">알림이 없습니다</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-center text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setNotificationsOpen(false);
                          router.push('/notifications');
                        }}
                      >
                        모든 알림 보기
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="hidden md:block">
                  {formatUserInfoVertical(
                    user, 
                    true, 
                    'text-sm font-medium text-gray-700',
                    'text-xs text-gray-500'
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}