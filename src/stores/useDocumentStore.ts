import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DocumentsAPI } from '@/lib/api/documents'
import type { Document, DocumentWithRelations } from '@/types/database'

// Request cancellation을 위한 AbortController 관리
let abortController: AbortController | null = null

interface DocumentStoreState {
  documents: DocumentWithRelations[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  typeFilter: string
  statusFilter: string
}

interface DocumentStoreActions {
  // Data fetching
  fetchDocuments: () => Promise<void>
  
  // CRUD operations
  createDocument: (documentData: Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  
  // File operations
  uploadFile: (file: File, folder?: string) => Promise<string | null>
  
  // UI state management
  setSearchQuery: (query: string) => void
  setTypeFilter: (type: string) => void
  setStatusFilter: (status: string) => void
  setError: (error: string | null) => void
  
  // Optimistic updates
  addDocumentOptimistic: (document: DocumentWithRelations) => void
  updateDocumentOptimistic: (id: string, updates: Partial<DocumentWithRelations>) => void
  removeDocumentOptimistic: (id: string) => void
}

type DocumentStore = DocumentStoreState & DocumentStoreActions

export const useDocumentStore = create<DocumentStore>()(
  immer((set, get) => ({
    // Initial state
    documents: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    typeFilter: 'all',
    statusFilter: 'all',

    // Data fetching
    fetchDocuments: async () => {
      // 이전 요청 취소
      if (abortController) {
        abortController.abort()
      }
      abortController = new AbortController()

      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await DocumentsAPI.getDocuments({
          search: get().searchQuery,
          type: get().typeFilter === 'all' ? undefined : get().typeFilter,
          status: get().statusFilter === 'all' ? undefined : get().statusFilter,
          signal: abortController.signal
        })

        // 요청이 중단되었는지 확인
        if (abortController.signal.aborted) {
          return
        }

        if (response.success && response.data) {
          set((state) => {
            state.documents = response.data
            state.isLoading = false
          })
        } else {
          throw new Error(response.error || 'Failed to fetch documents')
        }
      } catch (error) {
        // AbortError는 무시 (의도적인 취소)
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        // 컴포넌트가 언마운트된 후에는 상태 업데이트 하지 않음
        if (!abortController?.signal.aborted) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error'
            state.isLoading = false
          })
        }
      }
    },

    // CRUD operations with optimistic updates
    createDocument: async (documentData) => {
      try {
        const response = await DocumentsAPI.createDocument(documentData)
        
        if (response.success && response.data) {
          // Optimistic update - add to local state immediately
          set((state) => {
            state.documents.unshift(response.data)
          })
          
          console.log('문서가 성공적으로 생성되었습니다:', response.data)
        } else {
          throw new Error(response.error || 'Failed to create document')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create document'
        })
        throw error
      }
    },

    updateDocument: async (id, updates) => {
      // Optimistic update
      const originalDocument = get().documents.find(d => d.id === id)
      if (originalDocument) {
        set((state) => {
          const index = state.documents.findIndex(d => d.id === id)
          if (index !== -1) {
            state.documents[index] = { ...state.documents[index], ...updates }
          }
        })
      }

      try {
        const response = await DocumentsAPI.updateDocument(id, updates)
        
        if (!response.success) {
          // Revert optimistic update on failure
          if (originalDocument) {
            set((state) => {
              const index = state.documents.findIndex(d => d.id === id)
              if (index !== -1) {
                state.documents[index] = originalDocument
              }
            })
          }
          throw new Error(response.error || 'Failed to update document')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update document'
        })
        throw error
      }
    },

    deleteDocument: async (id) => {
      // Optimistic update
      const originalDocuments = [...get().documents]
      set((state) => {
        state.documents = state.documents.filter(d => d.id !== id)
      })

      try {
        const response = await DocumentsAPI.deleteDocument(id)
        
        if (!response.success) {
          // Revert optimistic update on failure
          set((state) => {
            state.documents = originalDocuments
          })
          throw new Error(response.error || 'Failed to delete document')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete document'
        })
        throw error
      }
    },

    // File operations
    uploadFile: async (file, folder) => {
      try {
        const response = await DocumentsAPI.uploadFile(file, folder)
        
        if (response.success && response.data) {
          return response.data
        } else {
          throw new Error(response.error || 'Failed to upload file')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to upload file'
        })
        return null
      }
    },

    // UI state management
    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query
      })
    },

    setTypeFilter: (type) => {
      set((state) => {
        state.typeFilter = type
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
    addDocumentOptimistic: (document) => {
      set((state) => {
        state.documents.unshift(document)
      })
    },

    updateDocumentOptimistic: (id, updates) => {
      set((state) => {
        const index = state.documents.findIndex(d => d.id === id)
        if (index !== -1) {
          state.documents[index] = { ...state.documents[index], ...updates }
        }
      })
    },

    removeDocumentOptimistic: (id) => {
      set((state) => {
        state.documents = state.documents.filter(d => d.id !== id)
      })
    },
  }))
)

// Computed selectors
export const useDocumentSelectors = () => {
  const store = useDocumentStore()
  
  return {
    filteredDocuments: store.documents.filter(document => {
      const matchesSearch = store.searchQuery 
        ? document.title.toLowerCase().includes(store.searchQuery.toLowerCase())
        : true
      
      const matchesType = store.typeFilter === 'all' || document.type === store.typeFilter
      const matchesStatus = store.statusFilter === 'all' || document.status === store.statusFilter
      
      return matchesSearch && matchesType && matchesStatus
    }),
    
    documentStats: {
      total: store.documents.length,
      quote: store.documents.filter(d => d.type === 'quote').length,
      contract: store.documents.filter(d => d.type === 'contract').length,
      invoice: store.documents.filter(d => d.type === 'invoice').length,
      report: store.documents.filter(d => d.type === 'report').length,
      general: store.documents.filter(d => d.type === 'general').length,
      draft: store.documents.filter(d => d.status === 'draft').length,
      sent: store.documents.filter(d => d.status === 'sent').length,
      approved: store.documents.filter(d => d.status === 'approved').length,
      rejected: store.documents.filter(d => d.status === 'rejected').length,
      totalSize: store.documents.reduce((sum, d) => sum + (d.file_size || 0), 0),
    }
  }
}