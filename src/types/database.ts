// Database types for WEAVE ERP MVP
// Auto-generated from Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          address: string | null
          website: string | null
          status: 'active' | 'inactive' | 'potential'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          status?: 'active' | 'inactive' | 'potential'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          status?: 'active' | 'inactive' | 'potential'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          budget: number | null
          progress: number
          start_date: string | null
          due_date: string | null
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          budget?: number | null
          progress?: number
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          budget?: number | null
          progress?: number
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          client_id: string | null
          invoice_number: string
          amount: number
          tax_amount: number
          total_amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          paid_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          client_id?: string | null
          invoice_number: string
          amount: number
          tax_amount?: number
          total_amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          paid_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          client_id?: string | null
          invoice_number?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string
          paid_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          client_id: string | null
          invoice_id: string | null
          title: string
          type: 'quote' | 'contract' | 'invoice' | 'report' | 'general'
          file_url: string | null
          file_size: number | null
          mime_type: string | null
          status: 'draft' | 'sent' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          client_id?: string | null
          invoice_id?: string | null
          title: string
          type?: 'quote' | 'contract' | 'invoice' | 'report' | 'general'
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          client_id?: string | null
          invoice_id?: string | null
          title?: string
          type?: 'quote' | 'contract' | 'invoice' | 'report' | 'general'
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      client_status: 'active' | 'inactive' | 'potential'
      project_status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      document_type: 'quote' | 'contract' | 'invoice' | 'report' | 'general'
      document_status: 'draft' | 'sent' | 'approved' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Entity types
export type Profile = Tables<'profiles'>
export type Client = Tables<'clients'>
export type Project = Tables<'projects'>
export type Invoice = Tables<'invoices'>
export type Document = Tables<'documents'>

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

// Extended types with relationships
export type ProjectWithClient = Project & {
  client?: Client | null
}

export type InvoiceWithProjectAndClient = Invoice & {
  project?: Project | null
  client?: Client | null
}

export type DocumentWithRelations = Document & {
  project?: Project | null
  client?: Client | null
  invoice?: Invoice | null
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Form types for frontend
export interface ClientFormData {
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
  status: 'active' | 'inactive' | 'potential'
  notes?: string
}

export interface ProjectFormData {
  name: string
  description?: string
  client_id?: string
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  budget?: number
  progress: number
  start_date?: string
  due_date?: string
}

export interface InvoiceFormData {
  project_id?: string
  client_id?: string
  amount: number
  tax_amount?: number
  issue_date: string
  due_date: string
  notes?: string
}

// Dashboard statistics types
export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalClients: number
  activeClients: number
  totalRevenue: number
  paidInvoices: number
  pendingInvoices: number
  overdueInvoices: number
  recentProjects: ProjectWithClient[]
  recentInvoices: InvoiceWithProjectAndClient[]
}