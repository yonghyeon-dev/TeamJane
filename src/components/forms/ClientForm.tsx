'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ClientsAPI } from '@/lib/api/clients';
import { ClientInsert } from '@/types/database';

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    website: '',
    notes: ''
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '클라이언트 이름은 필수입니다';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일은 필수입니다';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = '올바른 웹사이트 URL 형식이 아닙니다 (http:// 또는 https:// 포함)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData: Omit<ClientInsert, 'user_id'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        address: formData.address.trim() || null,
        website: formData.website.trim() || null,
        notes: formData.notes.trim() || null
      };

      const response = await ClientsAPI.createClient(submitData);
      
      if (response.success && response.data) {
        console.log('클라이언트 생성 성공:', response.data);
        onSuccess?.();
      } else {
        setErrors({ general: response.error || '클라이언트 생성에 실패했습니다' });
      }
    } catch (error) {
      console.error('클라이언트 생성 오류:', error);
      setErrors({ general: '예상치 못한 오류가 발생했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="client-form" onSubmit={handleSubmit} className="p-6 space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            클라이언트 이름 *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="홍길동"
            className={errors.name ? 'border-red-300' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            회사명
          </label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="ABC 컴퍼니"
            className={errors.company ? 'border-red-300' : ''}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일 *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="client@example.com"
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            전화번호
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="010-1234-5678"
            className={errors.phone ? 'border-red-300' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          웹사이트
        </label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://www.example.com"
          className={errors.website ? 'border-red-300' : ''}
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          주소
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="서울시 강남구 테헤란로 123"
          className={errors.address ? 'border-red-300' : ''}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          메모
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="클라이언트에 대한 추가 정보..."
          rows={3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.notes ? 'border-red-300' : ''
          }`}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
      </div>

    </form>
  );
}