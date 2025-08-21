// 일정 관리용 React Query 훅
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Schedule {
  id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time?: string
  client_id?: string
  project_id?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange'
  created_at: string
  updated_at: string
  // 관계 데이터
  client?: {
    id: string
    name: string
  }
  project?: {
    id: string
    name: string
  }
}

const supabase = createClient()

// 일정 목록 가져오기
export function useSchedules(params?: {
  date?: string // YYYY-MM-DD 형식
  limit?: number
}) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: async () => {
      let query = supabase
        .from('schedules')
        .select(`
          *,
          client:clients(id, name),
          project:projects(id, name)
        `)
        .order('start_time', { ascending: true })

      // 특정 날짜 필터링
      if (params?.date) {
        const startOfDay = `${params.date}T00:00:00.000Z`
        const endOfDay = `${params.date}T23:59:59.999Z`
        query = query
          .gte('start_time', startOfDay)
          .lte('start_time', endOfDay)
      }

      // 제한 개수
      if (params?.limit) {
        query = query.limit(params.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('일정 조회 오류:', error)
        throw new Error(`일정을 불러올 수 없습니다: ${error.message}`)
      }

      return {
        data: data as Schedule[],
        count: data?.length || 0
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 오늘의 일정 가져오기
export function useTodaySchedules() {
  const today = new Date().toISOString().split('T')[0]
  return useSchedules({ date: today, limit: 10 })
}

// 다가오는 일정 가져오기
export function useUpcomingSchedules(limit = 5) {
  return useQuery({
    queryKey: ['upcoming-schedules', limit],
    queryFn: async () => {
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          client:clients(id, name),
          project:projects(id, name)
        `)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('다가오는 일정 조회 오류:', error)
        throw new Error(`다가오는 일정을 불러올 수 없습니다: ${error.message}`)
      }

      return {
        data: data as Schedule[],
        count: data?.length || 0
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 일정 생성
export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newSchedule: Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert([newSchedule])
        .select()
        .single()

      if (error) {
        console.error('일정 생성 오류:', error)
        throw new Error(`일정을 생성할 수 없습니다: ${error.message}`)
      }

      return data as Schedule
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-schedules'] })
    },
  })
}

// 일정 수정
export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Schedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('일정 수정 오류:', error)
        throw new Error(`일정을 수정할 수 없습니다: ${error.message}`)
      }

      return data as Schedule
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-schedules'] })
    },
  })
}

// 일정 삭제
export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('일정 삭제 오류:', error)
        throw new Error(`일정을 삭제할 수 없습니다: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-schedules'] })
    },
  })
}