import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { InvoicesAPI } from '@/lib/api/invoices'
import type { Invoice, InvoiceWithProjectAndClient } from '@/types/database'

interface InvoiceStoreState {
  invoices: InvoiceWithProjectAndClient[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  statusFilter: string
}

interface InvoiceStoreActions {
  // Data fetching
  fetchInvoices: () => Promise<void>
  
  // CRUD operations
  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  
  // UI state management
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setError: (error: string | null) => void
  
  // Optimistic updates
  addInvoiceOptimistic: (invoice: InvoiceWithProjectAndClient) => void
  updateInvoiceOptimistic: (id: string, updates: Partial<InvoiceWithProjectAndClient>) => void
  removeInvoiceOptimistic: (id: string) => void
}

type InvoiceStore = InvoiceStoreState & InvoiceStoreActions

export const useInvoiceStore = create<InvoiceStore>()(
  immer((set, get) => ({
    // Initial state
    invoices: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    statusFilter: 'all',

    // Data fetching
    fetchInvoices: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await InvoicesAPI.getInvoices({
          search: get().searchQuery,
          status: get().statusFilter === 'all' ? undefined : get().statusFilter,
        })

        if (response.success && response.data) {
          set((state) => {
            state.invoices = response.data
            state.isLoading = false
          })
        } else {
          throw new Error(response.error || 'Failed to fetch invoices')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error'
          state.isLoading = false
        })
      }
    },

    // CRUD operations with optimistic updates
    createInvoice: async (invoiceData) => {
      try {
        const response = await InvoicesAPI.createInvoice(invoiceData)
        
        if (response.success && response.data) {
          // Optimistic update - add to local state immediately
          set((state) => {
            state.invoices.unshift(response.data)
          })
          
          console.log('청구서가 성공적으로 생성되었습니다:', response.data)
        } else {
          throw new Error(response.error || 'Failed to create invoice')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create invoice'
        })
        throw error
      }
    },

    updateInvoice: async (id, updates) => {
      // Optimistic update
      const originalInvoice = get().invoices.find(i => i.id === id)
      if (originalInvoice) {
        set((state) => {
          const index = state.invoices.findIndex(i => i.id === id)
          if (index !== -1) {
            state.invoices[index] = { ...state.invoices[index], ...updates }
          }
        })
      }

      try {
        const response = await InvoicesAPI.updateInvoice(id, updates)
        
        if (!response.success) {
          // Revert optimistic update on failure
          if (originalInvoice) {
            set((state) => {
              const index = state.invoices.findIndex(i => i.id === id)
              if (index !== -1) {
                state.invoices[index] = originalInvoice
              }
            })
          }
          throw new Error(response.error || 'Failed to update invoice')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update invoice'
        })
        throw error
      }
    },

    deleteInvoice: async (id) => {
      // Optimistic update
      const originalInvoices = [...get().invoices]
      set((state) => {
        state.invoices = state.invoices.filter(i => i.id !== id)
      })

      try {
        const response = await InvoicesAPI.deleteInvoice(id)
        
        if (!response.success) {
          // Revert optimistic update on failure
          set((state) => {
            state.invoices = originalInvoices
          })
          throw new Error(response.error || 'Failed to delete invoice')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete invoice'
        })
        throw error
      }
    },

    // UI state management
    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query
      })
    },

    setStatusFilter: (status) => {
      set((state) => {
        state.statusFilter = status
      })
    },

    setError: (error) => {
      set((state) => {
        state.error = error
      })
    },

    // Optimistic update helpers
    addInvoiceOptimistic: (invoice) => {
      set((state) => {
        state.invoices.unshift(invoice)
      })
    },

    updateInvoiceOptimistic: (id, updates) => {
      set((state) => {
        const index = state.invoices.findIndex(i => i.id === id)
        if (index !== -1) {
          state.invoices[index] = { ...state.invoices[index], ...updates }
        }
      })
    },

    removeInvoiceOptimistic: (id) => {
      set((state) => {
        state.invoices = state.invoices.filter(i => i.id !== id)
      })
    },
  }))
)

// Computed selectors
export const useInvoiceSelectors = () => {
  const store = useInvoiceStore()
  
  return {
    filteredInvoices: store.invoices.filter(invoice => {
      const matchesSearch = store.searchQuery 
        ? invoice.invoice_number?.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
          invoice.project?.name?.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
          invoice.project?.client?.name?.toLowerCase().includes(store.searchQuery.toLowerCase())
        : true
      
      const matchesStatus = store.statusFilter === 'all' || invoice.status === store.statusFilter
      
      return matchesSearch && matchesStatus
    }),
    
    invoiceStats: {
      total: store.invoices.length,
      draft: store.invoices.filter(i => i.status === 'draft').length,
      sent: store.invoices.filter(i => i.status === 'sent').length,
      paid: store.invoices.filter(i => i.status === 'paid').length,
      overdue: store.invoices.filter(i => i.status === 'overdue').length,
      totalAmount: store.invoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
      paidAmount: store.invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
      pendingAmount: store.invoices
        .filter(i => ['sent', 'overdue'].includes(i.status))
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    }
  }
}