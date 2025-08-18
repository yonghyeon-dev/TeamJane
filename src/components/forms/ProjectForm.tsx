'use client'

import React, { useState, useEffect } from 'react'
import { ProjectFormData, Client } from '../../types/database'
import { ProjectsAPI } from '../../lib/api/projects'
import { ClientsAPI } from '../../lib/api/clients'
import Button from '../ui/Button'
import Input from '../ui/Input'
import DateInput from '../ui/DateInput'
import { Calendar, DollarSign, User } from 'lucide-react'

interface ProjectFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<ProjectFormData>
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSuccess,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    client_id: '',
    status: 'planning',
    budget: 0,
    progress: 0,
    start_date: '',
    due_date: '',
    ...initialData
  })

  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true)
      try {
        const response = await ClientsAPI.getClients({ limit: 100 })
        if (response.success && response.data) {
          setClients(response.data)
        }
      } catch (error) {
        console.error('Failed to load clients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('프로젝트명은 필수입니다')
      return false
    }

    if (formData.budget && formData.budget < 0) {
      setError('예산은 0보다 크거나 같아야 합니다')
      return false
    }

    if (formData.progress < 0 || formData.progress > 100) {
      setError('진행률은 0-100% 사이여야 합니다')
      return false
    }

    if (formData.start_date && formData.due_date) {
      if (new Date(formData.start_date) > new Date(formData.due_date)) {
        setError('시작일은 마감일보다 빨라야 합니다')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        client_id: formData.client_id || undefined,
        budget: formData.budget || undefined,
        start_date: formData.start_date || undefined,
        due_date: formData.due_date || undefined
      }

      const response = await ProjectsAPI.createProject(submitData)
      
      if (response.success) {
        onSuccess?.()
      } else {
        setError(response.error || '프로젝트 생성에 실패했습니다')
      }
    } catch (error) {
      setError('프로젝트 생성 중 오류가 발생했습니다')
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form id="project-form" onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            프로젝트명 *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="프로젝트명을 입력하세요"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="프로젝트 설명을 입력하세요"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Client Selection */}
        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
            클라이언트
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              id="client_id"
              value={formData.client_id || ''}
              onChange={(e) => handleInputChange('client_id', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">클라이언트 선택 (선택사항)</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            상태
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as ProjectFormData['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="planning">기획 중</option>
            <option value="in_progress">진행 중</option>
            <option value="review">검토 중</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            예산 (원)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value ? Number(e.target.value) : 0)}
              placeholder="0"
              min="0"
              className="pl-10"
            />
          </div>
        </div>

        {/* Progress */}
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
            진행률 ({formData.progress}%)
          </label>
          <input
            id="progress"
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleInputChange('progress', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <DateInput
              id="start_date"
              value={formData.start_date || ''}
              onChange={(value) => handleInputChange('start_date', value)}
              placeholder="시작일을 선택하세요"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
              마감일
            </label>
            <DateInput
              id="due_date"
              value={formData.due_date || ''}
              onChange={(value) => handleInputChange('due_date', value)}
              placeholder="마감일을 선택하세요"
            />
          </div>
        </div>
      </div>

    </form>
  )
}

export default ProjectForm