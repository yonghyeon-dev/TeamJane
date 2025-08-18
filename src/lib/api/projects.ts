// Projects API Layer
import { createClient } from '../supabase/client'
import { Project, ProjectInsert, ProjectUpdate, ProjectWithClient, ApiResponse, PaginatedResponse } from '../../types/database'

const supabase = createClient()

export class ProjectsAPI {
  // Get all projects for the current user
  static async getProjects(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<ProjectWithClient>> {
    try {
      const { page = 1, limit = 10, status, search } = params || {}
      const offset = (page - 1) * limit

      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Get total count
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      // Get paginated data
      const { data, error } = await query
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || [],
        page,
        limit,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      }
    }
  }

  // Get a single project by ID
  static async getProject(id: string): Promise<ApiResponse<ProjectWithClient>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project'
      }
    }
  }

  // Create a new project
  static async createProject(projectData: Omit<ProjectInsert, 'user_id'>): Promise<ApiResponse<Project>> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Project created successfully'
      }
    } catch (error) {
      console.error('Error creating project:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create project'
      }
    }
  }

  // Update an existing project
  static async updateProject(id: string, updates: ProjectUpdate): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Project updated successfully'
      }
    } catch (error) {
      console.error('Error updating project:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project'
      }
    }
  }

  // Delete a project
  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'Project deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete project'
      }
    }
  }

  // Get project statistics
  static async getProjectStats(): Promise<ApiResponse<{
    total: number
    active: number
    completed: number
    planning: number
    review: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status')

      if (error) {
        throw error
      }

      const stats = {
        total: data.length,
        active: data.filter((p: any) => p.status === 'in_progress').length,
        completed: data.filter((p: any) => p.status === 'completed').length,
        planning: data.filter((p: any) => p.status === 'planning').length,
        review: data.filter((p: any) => p.status === 'review').length
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching project stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project statistics'
      }
    }
  }

  // Update project progress
  static async updateProgress(id: string, progress: number): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ progress })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Project progress updated successfully'
      }
    } catch (error) {
      console.error('Error updating project progress:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project progress'
      }
    }
  }

  // Update project status
  static async updateStatus(id: string, status: Project['status']): Promise<ApiResponse<Project>> {
    try {
      const updateData: ProjectUpdate = { status }
      
      // If status is completed, set completed_date
      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString().split('T')[0]
        updateData.progress = 100
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Project status updated successfully'
      }
    } catch (error) {
      console.error('Error updating project status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update project status'
      }
    }
  }
}