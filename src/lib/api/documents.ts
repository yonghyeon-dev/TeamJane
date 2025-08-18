// Documents API Layer
import { createClient } from '../supabase/client'
import { Document, DocumentInsert, DocumentUpdate, DocumentWithRelations, ApiResponse, PaginatedResponse } from '../../types/database'

const supabase = createClient()

export class DocumentsAPI {
  // Get all documents for the current user
  static async getDocuments(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    search?: string
  }): Promise<PaginatedResponse<DocumentWithRelations>> {
    try {
      const { page = 1, limit = 10, type, status, search } = params || {}
      const offset = (page - 1) * limit

      let query = supabase
        .from('documents')
        .select(`
          *,
          project:projects(*),
          client:clients(*),
          invoice:invoices(*)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (type && type !== 'all') {
        query = query.eq('type', type)
      }

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%`)
      }

      // Get total count
      const { count } = await supabase
        .from('documents')
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
      console.error('Error fetching documents:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      }
    }
  }

  // Get a single document by ID
  static async getDocument(id: string): Promise<ApiResponse<DocumentWithRelations>> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          project:projects(*),
          client:clients(*),
          invoice:invoices(*)
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
      console.error('Error fetching document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document'
      }
    }
  }

  // Create a new document
  static async createDocument(documentData: Omit<DocumentInsert, 'user_id'>): Promise<ApiResponse<Document>> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
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
        message: 'Document created successfully'
      }
    } catch (error) {
      console.error('Error creating document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create document'
      }
    }
  }

  // Update an existing document
  static async updateDocument(id: string, updates: DocumentUpdate): Promise<ApiResponse<Document>> {
    try {
      const { data, error } = await supabase
        .from('documents')
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
        message: 'Document updated successfully'
      }
    } catch (error) {
      console.error('Error updating document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document'
      }
    }
  }

  // Delete a document
  static async deleteDocument(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'Document deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete document'
      }
    }
  }

  // Upload file to Supabase Storage
  static async uploadFile(file: File, folder: string = 'documents'): Promise<ApiResponse<string>> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (error) {
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      return {
        success: true,
        data: urlData.publicUrl,
        message: 'File uploaded successfully'
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      }
    }
  }

  // Delete file from Supabase Storage
  static async deleteFile(filePath: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'File deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      }
    }
  }

  // Update document status
  static async updateStatus(id: string, status: Document['status']): Promise<ApiResponse<Document>> {
    try {
      const { data, error } = await supabase
        .from('documents')
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
        message: 'Document status updated successfully'
      }
    } catch (error) {
      console.error('Error updating document status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document status'
      }
    }
  }

  // Get document statistics
  static async getDocumentStats(): Promise<ApiResponse<{
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    totalSize: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('type, status, file_size')

      if (error) {
        throw error
      }

      const stats = {
        total: data.length,
        byType: data.reduce((acc: Record<string, number>, doc: any) => {
          acc[doc.type] = (acc[doc.type] || 0) + 1
          return acc
        }, {}),
        byStatus: data.reduce((acc: Record<string, number>, doc: any) => {
          acc[doc.status] = (acc[doc.status] || 0) + 1
          return acc
        }, {}),
        totalSize: data.reduce((sum: number, doc: any) => sum + (doc.file_size || 0), 0)
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching document stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document statistics'
      }
    }
  }

  // Get recent documents
  static async getRecentDocuments(limit: number = 5): Promise<ApiResponse<DocumentWithRelations[]>> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          project:projects(*),
          client:clients(*),
          invoice:invoices(*)
        `)
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
      console.error('Error fetching recent documents:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent documents'
      }
    }
  }

  // Search documents
  static async searchDocuments(query: string): Promise<ApiResponse<DocumentWithRelations[]>> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          project:projects(*),
          client:clients(*),
          invoice:invoices(*)
        `)
        .or(`title.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error searching documents:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search documents'
      }
    }
  }
}