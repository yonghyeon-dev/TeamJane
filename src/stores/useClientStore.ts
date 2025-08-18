import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ClientsAPI } from '@/lib/api/clients'
import type { Client } from '@/types/database'

interface ClientStoreState {
  clients: Client[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  statusFilter: string
}

interface ClientStoreActions {
  // Data fetching
  fetchClients: () => Promise<void>
  
  // CRUD operations
  createClient: (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  
  // UI state management
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setError: (error: string | null) => void
  
  // Optimistic updates
  addClientOptimistic: (client: Client) => void
  updateClientOptimistic: (id: string, updates: Partial<Client>) => void
  removeClientOptimistic: (id: string) => void
}

type ClientStore = ClientStoreState & ClientStoreActions

export const useClientStore = create<ClientStore>()(
  immer((set, get) => ({
    // Initial state
    clients: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    statusFilter: 'all',

    // Data fetching
    fetchClients: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await ClientsAPI.getClients({
          search: get().searchQuery,
          status: get().statusFilter === 'all' ? undefined : get().statusFilter,
        })

        if (response.success && response.data) {
          set((state) => {
            state.clients = response.data
            state.isLoading = false
          })
        } else {
          throw new Error(response.error || 'Failed to fetch clients')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error'
          state.isLoading = false
        })
      }
    },

    // CRUD operations with optimistic updates
    createClient: async (clientData) => {
      try {
        const response = await ClientsAPI.createClient(clientData)
        
        if (response.success && response.data) {
          // Optimistic update - add to local state immediately
          set((state) => {
            state.clients.unshift(response.data)
          })
          
          console.log('클라이언트가 성공적으로 생성되었습니다:', response.data)
        } else {
          throw new Error(response.error || 'Failed to create client')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create client'
        })
        throw error
      }
    },

    updateClient: async (id, updates) => {
      // Optimistic update
      const originalClient = get().clients.find(c => c.id === id)
      if (originalClient) {
        set((state) => {
          const index = state.clients.findIndex(c => c.id === id)
          if (index !== -1) {
            state.clients[index] = { ...state.clients[index], ...updates }
          }
        })
      }

      try {
        const response = await ClientsAPI.updateClient(id, updates)
        
        if (!response.success) {
          // Revert optimistic update on failure
          if (originalClient) {
            set((state) => {
              const index = state.clients.findIndex(c => c.id === id)
              if (index !== -1) {
                state.clients[index] = originalClient
              }
            })
          }
          throw new Error(response.error || 'Failed to update client')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update client'
        })
        throw error
      }
    },

    deleteClient: async (id) => {
      // Optimistic update
      const originalClients = [...get().clients]
      set((state) => {
        state.clients = state.clients.filter(c => c.id !== id)
      })

      try {
        const response = await ClientsAPI.deleteClient(id)
        
        if (!response.success) {
          // Revert optimistic update on failure
          set((state) => {
            state.clients = originalClients
          })
          throw new Error(response.error || 'Failed to delete client')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete client'
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
    addClientOptimistic: (client) => {
      set((state) => {
        state.clients.unshift(client)
      })
    },

    updateClientOptimistic: (id, updates) => {
      set((state) => {
        const index = state.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          state.clients[index] = { ...state.clients[index], ...updates }
        }
      })
    },

    removeClientOptimistic: (id) => {
      set((state) => {
        state.clients = state.clients.filter(c => c.id !== id)
      })
    },
  }))
)

// Computed selectors
export const useClientSelectors = () => {
  const store = useClientStore()
  
  return {
    filteredClients: store.clients.filter(client => {
      const matchesSearch = store.searchQuery 
        ? client.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
          client.company?.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(store.searchQuery.toLowerCase())
        : true
      
      const matchesStatus = store.statusFilter === 'all' || client.status === store.statusFilter
      
      return matchesSearch && matchesStatus
    }),
    
    clientStats: {
      total: store.clients.length,
      active: store.clients.filter(c => c.status === 'active').length,
      potential: store.clients.filter(c => c.status === 'potential').length,
      inactive: store.clients.filter(c => c.status === 'inactive').length,
    }
  }
}