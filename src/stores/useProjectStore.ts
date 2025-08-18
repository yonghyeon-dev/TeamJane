import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ProjectsAPI } from '@/lib/api/projects'
import type { Project, ProjectWithClient } from '@/types/database'

interface ProjectStoreState {
  projects: ProjectWithClient[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  statusFilter: string
}

interface ProjectStoreActions {
  // Data fetching
  fetchProjects: () => Promise<void>
  
  // CRUD operations
  createProject: (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  
  // UI state management
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setError: (error: string | null) => void
  
  // Optimistic updates
  addProjectOptimistic: (project: ProjectWithClient) => void
  updateProjectOptimistic: (id: string, updates: Partial<ProjectWithClient>) => void
  removeProjectOptimistic: (id: string) => void
}

type ProjectStore = ProjectStoreState & ProjectStoreActions

export const useProjectStore = create<ProjectStore>()(
  immer((set, get) => ({
    // Initial state
    projects: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    statusFilter: 'all',

    // Data fetching
    fetchProjects: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await ProjectsAPI.getProjects({
          search: get().searchQuery,
          status: get().statusFilter === 'all' ? undefined : get().statusFilter,
        })

        if (response.success && response.data) {
          set((state) => {
            state.projects = response.data
            state.isLoading = false
          })
        } else {
          throw new Error(response.error || 'Failed to fetch projects')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error'
          state.isLoading = false
        })
      }
    },

    // CRUD operations with optimistic updates
    createProject: async (projectData) => {
      try {
        const response = await ProjectsAPI.createProject(projectData)
        
        if (response.success && response.data) {
          // Optimistic update - add to local state immediately
          set((state) => {
            state.projects.unshift(response.data)
          })
          
          console.log('프로젝트가 성공적으로 생성되었습니다:', response.data)
          return response.data
        } else {
          throw new Error(response.error || 'Failed to create project')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create project'
        set((state) => {
          state.error = errorMessage
        })
        throw error
      }
    },

    updateProject: async (id, updates) => {
      // Optimistic update
      const originalProject = get().projects.find(p => p.id === id)
      if (originalProject) {
        set((state) => {
          const index = state.projects.findIndex(p => p.id === id)
          if (index !== -1) {
            state.projects[index] = { ...state.projects[index], ...updates }
          }
        })
      }

      try {
        const response = await ProjectsAPI.updateProject(id, updates)
        
        if (!response.success) {
          // Revert optimistic update on failure
          if (originalProject) {
            set((state) => {
              const index = state.projects.findIndex(p => p.id === id)
              if (index !== -1) {
                state.projects[index] = originalProject
              }
            })
          }
          throw new Error(response.error || 'Failed to update project')
        }
        return response.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update project'
        set((state) => {
          state.error = errorMessage
        })
        throw error
      }
    },

    deleteProject: async (id) => {
      // Optimistic update
      const originalProjects = [...get().projects]
      set((state) => {
        state.projects = state.projects.filter(p => p.id !== id)
      })

      try {
        const response = await ProjectsAPI.deleteProject(id)
        
        if (!response.success) {
          // Revert optimistic update on failure
          set((state) => {
            state.projects = originalProjects
          })
          throw new Error(response.error || 'Failed to delete project')
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete project'
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
    addProjectOptimistic: (project) => {
      set((state) => {
        state.projects.unshift(project)
      })
    },

    updateProjectOptimistic: (id, updates) => {
      set((state) => {
        const index = state.projects.findIndex(p => p.id === id)
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...updates }
        }
      })
    },

    removeProjectOptimistic: (id) => {
      set((state) => {
        state.projects = state.projects.filter(p => p.id !== id)
      })
    },
  }))
)

// Computed selectors
export const useProjectSelectors = () => {
  const store = useProjectStore()
  
  return {
    filteredProjects: store.projects.filter(project => {
      const matchesSearch = store.searchQuery 
        ? project.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
          project.client?.name?.toLowerCase().includes(store.searchQuery.toLowerCase())
        : true
      
      const matchesStatus = store.statusFilter === 'all' || project.status === store.statusFilter
      
      return matchesSearch && matchesStatus
    }),
    
    projectStats: {
      total: store.projects.length,
      inProgress: store.projects.filter(p => p.status === 'in_progress').length,
      completed: store.projects.filter(p => p.status === 'completed').length,
      totalBudget: store.projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
    }
  }
}