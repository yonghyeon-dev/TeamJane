'use client'

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useDocumentStore } from '@/stores/useDocumentStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useClientStore } from '@/stores/useClientStore'
import type { DocumentInsert } from '@/types/database'
import { X, Upload, File, AlertCircle } from 'lucide-react'

interface DocumentCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DocumentFormData {
  title: string
  type: 'quote' | 'contract' | 'invoice' | 'report' | 'general'
  project_id?: string
  client_id?: string
  file?: File
}

const DocumentCreateModal: React.FC<DocumentCreateModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<DocumentFormData>({
    defaultValues: {
      type: 'general'
    }
  })

  const { createDocument, uploadFile, isLoading, error } = useDocumentStore()
  const { projects } = useProjectStore()
  const { clients } = useClientStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedType = watch('type')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setValue('file', file)
    }
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setValue('file', file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setValue('file', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: DocumentFormData) => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      let fileUrl = null
      let fileSize = null
      let mimeType = null

      // 파일이 선택된 경우 업로드
      if (selectedFile) {
        setUploadProgress(25)
        const uploadResult = await uploadFile(selectedFile, 'documents')
        
        if (uploadResult) {
          fileUrl = uploadResult
          fileSize = selectedFile.size
          mimeType = selectedFile.type
        }
        setUploadProgress(75)
      }

      // 문서 메타데이터 생성
      const documentData: Omit<DocumentInsert, 'user_id'> = {
        title: data.title,
        type: data.type,
        project_id: data.project_id || null,
        client_id: data.client_id || null,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: mimeType,
        status: 'draft'
      }

      setUploadProgress(90)
      await createDocument(documentData)
      setUploadProgress(100)

      // 성공 시 폼 리셋하고 모달 닫기
      reset()
      setSelectedFile(null)
      setUploadProgress(0)
      onClose()
    } catch (error) {
      console.error('문서 생성 중 오류:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedFile(null)
    setUploadProgress(0)
    onClose()
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      quote: '견적서',
      contract: '계약서',
      invoice: '청구서',
      report: '보고서',
      general: '일반문서'
    }
    return labels[type as keyof typeof labels] || type
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="새 문서 생성"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            취소
          </Button>
          <Button
            type="submit"
            form="document-form"
            disabled={isLoading || isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? '업로드 중...' : isLoading ? '생성 중...' : '문서 생성'}
          </Button>
        </div>
      }
    >
      <form id="document-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 문서 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            문서 제목 *
          </label>
          <Input
            {...register('title', { 
              required: '문서 제목을 입력해주세요' 
            })}
            placeholder="문서 제목을 입력하세요"
            className={errors.title ? 'border-red-300' : ''}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* 문서 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            문서 유형 *
          </label>
          <select
            {...register('type', { required: '문서 유형을 선택해주세요' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="general">일반문서</option>
            <option value="quote">견적서</option>
            <option value="contract">계약서</option>
            <option value="invoice">청구서</option>
            <option value="report">보고서</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* 프로젝트 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연관 프로젝트 (선택사항)
          </label>
          <select
            {...register('project_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">프로젝트 선택 안함</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* 클라이언트 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연관 클라이언트 (선택사항)
          </label>
          <select
            {...register('client_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">클라이언트 선택 안함</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company && `(${client.company})`}
              </option>
            ))}
          </select>
        </div>

        {/* 파일 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 첨부 (선택사항)
          </label>
          
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                파일을 드래그해서 놓거나 클릭해서 선택하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (최대 50MB)
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            className="hidden"
          />
        </div>

        {/* 업로드 진행률 */}
        {isUploading && uploadProgress > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800 mb-2">업로드 중...</p>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

      </form>
    </Modal>
  )
}

export default DocumentCreateModal