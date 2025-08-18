// Invoices API Layer
import { createClient } from '../supabase/client'
import { Invoice, InvoiceInsert, InvoiceUpdate, InvoiceWithProjectAndClient, ApiResponse, PaginatedResponse } from '../../types/database'

const supabase = createClient()

export class InvoicesAPI {
  // Get all invoices for the current user
  static async getInvoices(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<InvoiceWithProjectAndClient>> {
    try {
      const { page = 1, limit = 10, status, search } = params || {}
      const offset = (page - 1) * limit

      let query = supabase
        .from('invoices')
        .select(`
          *,
          project:projects(*),
          client:clients(*)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`invoice_number.ilike.%${search}%,notes.ilike.%${search}%`)
      }

      // Get total count
      const { count } = await supabase
        .from('invoices')
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
      console.error('Error fetching invoices:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoices',
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false
      }
    }
  }

  // Get a single invoice by ID
  static async getInvoice(id: string): Promise<ApiResponse<InvoiceWithProjectAndClient>> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          project:projects(*),
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
      console.error('Error fetching invoice:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoice'
      }
    }
  }

  // Generate new invoice number
  static async generateInvoiceNumber(): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase
        .rpc('generate_invoice_number')

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || ''
      }
    } catch (error) {
      console.error('Error generating invoice number:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate invoice number'
      }
    }
  }

  // Create a new invoice
  static async createInvoice(invoiceData: Omit<InvoiceInsert, 'user_id' | 'invoice_number'>): Promise<ApiResponse<Invoice>> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Generate invoice number
      const { data: invoiceNumber, error: numberError } = await supabase
        .rpc('generate_invoice_number')

      if (numberError) {
        throw numberError
      }

      // Calculate total amount
      const totalAmount = invoiceData.amount + (invoiceData.tax_amount || 0)

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          user_id: user.id,
          invoice_number: invoiceNumber,
          total_amount: totalAmount
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return {
        success: true,
        data,
        message: 'Invoice created successfully'
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice'
      }
    }
  }

  // Update an existing invoice
  static async updateInvoice(id: string, updates: InvoiceUpdate): Promise<ApiResponse<Invoice>> {
    try {
      // Recalculate total if amount or tax_amount is updated
      if (updates.amount !== undefined || updates.tax_amount !== undefined) {
        const { data: currentInvoice } = await supabase
          .from('invoices')
          .select('amount, tax_amount')
          .eq('id', id)
          .single()

        const amount = updates.amount ?? currentInvoice?.amount ?? 0
        const taxAmount = updates.tax_amount ?? currentInvoice?.tax_amount ?? 0
        updates.total_amount = amount + taxAmount
      }

      const { data, error } = await supabase
        .from('invoices')
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
        message: 'Invoice updated successfully'
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update invoice'
      }
    }
  }

  // Delete an invoice
  static async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'Invoice deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete invoice'
      }
    }
  }

  // Update invoice status
  static async updateStatus(id: string, status: Invoice['status']): Promise<ApiResponse<Invoice>> {
    try {
      const updateData: InvoiceUpdate = { status }

      // If status is paid, set paid_date
      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString().split('T')[0]
      }

      const { data, error } = await supabase
        .from('invoices')
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
        message: 'Invoice status updated successfully'
      }
    } catch (error) {
      console.error('Error updating invoice status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update invoice status'
      }
    }
  }

  // Get invoice statistics
  static async getInvoiceStats(): Promise<ApiResponse<{
    total: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    overdueAmount: number
    draft: number
    sent: number
    paid: number
    overdue: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('status, total_amount, due_date')

      if (error) {
        throw error
      }

      const today = new Date().toISOString().split('T')[0]
      
      const stats = {
        total: data.length,
        totalAmount: data.reduce((sum: any, invoice: any) => sum + (invoice.total_amount || 0), 0),
        paidAmount: data
          .filter((invoice: any) => invoice.status === 'paid')
          .reduce((sum: any, invoice: any) => sum + (invoice.total_amount || 0), 0),
        pendingAmount: data
          .filter((invoice: any) => invoice.status === 'sent')
          .reduce((sum: any, invoice: any) => sum + (invoice.total_amount || 0), 0),
        overdueAmount: data
          .filter((invoice: any) => invoice.status === 'overdue' || 
            (invoice.status === 'sent' && invoice.due_date < today))
          .reduce((sum: any, invoice: any) => sum + (invoice.total_amount || 0), 0),
        draft: data.filter((invoice: any) => invoice.status === 'draft').length,
        sent: data.filter((invoice: any) => invoice.status === 'sent').length,
        paid: data.filter((invoice: any) => invoice.status === 'paid').length,
        overdue: data.filter((invoice: any) => invoice.status === 'overdue' || 
          (invoice.status === 'sent' && invoice.due_date < today)).length
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching invoice stats:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoice statistics'
      }
    }
  }

  // Send invoice (update status to sent)
  static async sendInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return this.updateStatus(id, 'sent')
  }

  // Mark invoice as paid
  static async markAsPaid(id: string): Promise<ApiResponse<Invoice>> {
    return this.updateStatus(id, 'paid')
  }

  // Get recent invoices
  static async getRecentInvoices(limit: number = 5): Promise<ApiResponse<InvoiceWithProjectAndClient[]>> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          project:projects(*),
          client:clients(*)
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
      console.error('Error fetching recent invoices:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent invoices'
      }
    }
  }

  // Get overdue invoices
  static async getOverdueInvoices(): Promise<ApiResponse<InvoiceWithProjectAndClient[]>> {
    try {
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          project:projects(*),
          client:clients(*)
        `)
        .or(`status.eq.overdue,and(status.eq.sent,due_date.lt.${today})`)
        .order('due_date', { ascending: true })

      if (error) {
        throw error
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error fetching overdue invoices:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch overdue invoices'
      }
    }
  }
}