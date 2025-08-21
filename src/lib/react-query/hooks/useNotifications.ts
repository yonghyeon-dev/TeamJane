// 알림 시스템용 React Query 훅
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  action_url?: string
  related_type?: string
  related_id?: string
  created_at: string
  read_at?: string
}

const supabase = createClient()

// 알림 목록 가져오기
export function useNotifications(params?: {
  limit?: number
  unreadOnly?: boolean
}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      // 읽지 않은 알림만 필터링
      if (params?.unreadOnly) {
        query = query.eq('is_read', false)
      }

      // 제한 개수
      if (params?.limit) {
        query = query.limit(params.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('알림 조회 오류:', error)
        throw new Error(`알림을 불러올 수 없습니다: ${error.message}`)
      }

      return {
        data: data as Notification[],
        count: data?.length || 0,
        unreadCount: data?.filter(n => !n.is_read).length || 0
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

// 읽지 않은 알림 개수
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (error) {
        console.error('읽지 않은 알림 개수 조회 오류:', error)
        return 0
      }

      return count || 0
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 1, // 1분
  })
}

// 알림 읽음 처리
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('알림 읽음 처리 오류:', error)
        throw new Error(`알림을 읽음 처리할 수 없습니다: ${error.message}`)
      }

      return data as Notification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
}

// 모든 알림 읽음 처리
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('is_read', false)
        .select()

      if (error) {
        console.error('모든 알림 읽음 처리 오류:', error)
        throw new Error(`모든 알림을 읽음 처리할 수 없습니다: ${error.message}`)
      }

      return data as Notification[]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
}

// 알림 생성 (시스템용)
export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newNotification: Omit<Notification, 'id' | 'created_at' | 'read_at'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select()
        .single()

      if (error) {
        console.error('알림 생성 오류:', error)
        throw new Error(`알림을 생성할 수 없습니다: ${error.message}`)
      }

      return data as Notification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
}

// 알림 삭제
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('알림 삭제 오류:', error)
        throw new Error(`알림을 삭제할 수 없습니다: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    },
  })
}