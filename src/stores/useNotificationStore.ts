import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'invoice' | 'project' | 'client' | 'document' | 'system'
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

interface NotificationState {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  setNotifications: (notifications: Notification[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type NotificationStore = NotificationState & NotificationActions

// 임시 목업 데이터 (추후 API 연동시 제거)
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '새 청구서 생성됨',
    message: 'INV-20241201-001 청구서가 성공적으로 생성되었습니다.',
    type: 'success',
    category: 'invoice',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5분 전
    actionUrl: '/invoices'
  },
  {
    id: '2',
    title: '프로젝트 완료',
    message: '웹사이트 리뉴얼 프로젝트가 완료되었습니다.',
    type: 'success',
    category: 'project',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1시간 전
    actionUrl: '/projects'
  },
  {
    id: '3',
    title: '결제 알림',
    message: 'ABC 컴퍼니 청구서 결제 기한이 3일 남았습니다.',
    type: 'warning',
    category: 'invoice',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    actionUrl: '/invoices'
  },
  {
    id: '4',
    title: '새 클라이언트 등록',
    message: '홍길동님이 새 클라이언트로 등록되었습니다.',
    type: 'info',
    category: 'client',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    actionUrl: '/clients'
  },
  {
    id: '5',
    title: '문서 업로드 완료',
    message: '계약서_ABC컴퍼니.pdf 파일이 업로드되었습니다.',
    type: 'success',
    category: 'document',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    actionUrl: '/documents'
  },
  {
    id: '6',
    title: '시스템 업데이트',
    message: '새로운 기능이 추가되었습니다. 업데이트 내용을 확인하세요.',
    type: 'info',
    category: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
  },
  {
    id: '7',
    title: '연체 알림',
    message: 'DEF 컴퍼니 청구서가 7일 연체되었습니다.',
    type: 'error',
    category: 'invoice',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    actionUrl: '/invoices'
  }
]

export const useNotificationStore = create<NotificationStore>()(
  immer((set, get) => ({
    // State
    notifications: [],
    isLoading: false,
    error: null,

    // Actions
    addNotification: (notificationData) =>
      set((state) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        state.notifications.unshift(newNotification)
      }),

    markAsRead: (id) =>
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id)
        if (notification) {
          notification.isRead = true
        }
      }),

    markAllAsRead: () =>
      set((state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true
        })
      }),

    deleteNotification: (id) =>
      set((state) => {
        state.notifications = state.notifications.filter((n) => n.id !== id)
      }),

    setNotifications: (notifications) =>
      set((state) => {
        state.notifications = notifications
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading
      }),

    setError: (error) =>
      set((state) => {
        state.error = error
      }),
  }))
)

// Selectors
export const useNotificationSelectors = () => {
  const store = useNotificationStore()
  
  return {
    unreadCount: store.notifications.filter(n => !n.isRead).length,
    recentNotifications: [...store.notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5), // 최근 5개만
    ...store
  }
}

// Initialize mock data (추후 API 연동시 제거)
export const initializeMockNotifications = () => {
  const store = useNotificationStore.getState()
  if (store.notifications.length === 0) {
    store.setNotifications(mockNotifications)
  }
}