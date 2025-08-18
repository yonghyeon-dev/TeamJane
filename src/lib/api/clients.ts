// Clients API Layer
import { createClient } from '../supabase/client'
import { Client, ClientInsert, ClientUpdate, ApiResponse, PaginatedResponse } from '../../types/database'

const supabase = createClient()

export class ClientsAPI {
  // Get all clients for the current user
  static async getClients(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Client>> {
    try {
      const { page = 1, limit = 10, status, search } = params || {}
      const offset = (page - 1) * limit

      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // Get total count
      const { count } = await supabase
        .from('clients')
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
      console.error('Error fetching clients:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch clients',
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      }
    }
  }

  // Get a single client by ID
  static async getClient(id: string): Promise<ApiResponse<Client>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
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
      console.error('Error fetching client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch client'
      }
    }
  }

  // Create a new client
  static async createClient(clientData: Omit<ClientInsert, 'user_id'>): Promise<ApiResponse<Client>> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
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
        message: 'Client created successfully'
      }
    } catch (error) {
      console.error('Error creating client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create client'
      }
    }
  }

  // Update an existing client
  static async updateClient(id: string, updates: ClientUpdate): Promise<ApiResponse<Client>> {
    try {
      const { data, error } = await supabase
        .from('clients')
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
        message: 'Client updated successfully'
      }
    } catch (error) {
      console.error('Error updating client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update client'
      }
    }
  }

  // Delete a client
  static async deleteClient(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'Client deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete client'
      }
    }
  }

  // Get client statistics
  static async getClientStats(): Promise<ApiResponse<{
    total: number
    active: number
    inactive: number
    potential: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('status')

      if (error) {
        throw error
      }

      const stats = {
        total: data.length,
        active: data.filter((c: any) => c.status === 'active').length,
        inactive: data.filter((c: any) => c.status === 'inactive').length,
        potential: data.filter((c: any) => c.status === 'potential').length
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching client stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch client statistics'
      }
    }
  }

  // Get clients with project counts
  static async getClientsWithProjectCounts(): Promise<ApiResponse<(Client & { project_count: number })[]>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          projects(count)
        `)

      if (error) {
        throw error
      }

      const clientsWithCounts = data?.map((client: any) => ({
        ...client,
        project_count: Array.isArray(client.projects) ? client.projects.length : 0
      })) || []

      return {
        success: true,
        data: clientsWithCounts
      }
    } catch (error) {
      console.error('Error fetching clients with project counts:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch clients with project counts'
      }
    }
  }

  // Get client's projects
  static async getClientProjects(clientId: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error fetching client projects:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch client projects'
      }
    }
  }

  // Get recent clients
  static async getRecentClients(limit: number = 5): Promise<ApiResponse<Client[]>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error fetching recent clients:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent clients'
      }
    }
  }

  // Update client status
  static async updateStatus(id: string, status: Client['status']): Promise<ApiResponse<Client>> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Client status updated successfully'
      }
    } catch (error) {
      console.error('Error updating client status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update client status'
      }
    }
  }
}