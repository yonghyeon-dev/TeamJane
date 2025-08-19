'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DateInput from '@/components/ui/DateInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useInvoiceStore } from '@/stores/useInvoiceStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useError } from '@/contexts/ErrorContext';
import type { Invoice } from '@/types/database';
import { PlusIcon, XIcon, LoaderIcon } from 'lucide-react';

// 청구서 생성 스키마
const invoiceSchema = z.object({
  project_id: z.string().min(1, '프로젝트를 선택해주세요'),
  invoice_number: z.string().min(1, '청구서 번호를 입력해주세요'),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
  issue_date: z.string().min(1, '발행일을 선택해주세요'),
  due_date: z.string().min(1, '마감일을 선택해주세요'),
  description: z.string().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  items: z.array(z.object({
    description: z.string().min(1, '항목 설명을 입력해주세요'),
    quantity: z.number().min(1, '수량은 1 이상이어야 합니다'),
    unit_price: z.number().min(0, '단가는 0 이상이어야 합니다'),
    total: z.number()
  })).min(1, '최소 1개의 항목이 필요합니다')
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Invoice>;
  renderFooter?: (props: { 
    onSubmit: () => void; 
    onCancel: () => void; 
    isLoading: boolean; 
  }) => React.ReactNode;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function InvoiceForm({ onSuccess, onCancel, initialData, renderFooter }: InvoiceFormProps) {
  const { createInvoice, isLoading } = useInvoiceStore();
  const { projects, fetchProjects } = useProjectStore();
  const { showError } = useError();
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30일 후
      items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }],
      ...initialData
    }
  });

  // 프로젝트 목록 로드
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  // 항목 추가
  const addItem = () => {
    const newItems = [...items, { description: '', quantity: 1, unit_price: 0, total: 0 }];
    setItems(newItems);
    setValue('items', newItems);
  };

  // 항목 제거
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setValue('items', newItems);
      calculateTotal(newItems);
    }
  };

  // 항목 업데이트
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // 수량 또는 단가가 변경되면 총액 계산
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setItems(newItems);
    setValue('items', newItems);
    calculateTotal(newItems);
  };

  // 전체 금액 계산
  const calculateTotal = (itemList: InvoiceItem[]) => {
    const total = itemList.reduce((sum, item) => sum + item.total, 0);
    setValue('amount', total);
  };

  // 청구서 번호 자동 생성
  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  useEffect(() => {
    if (!initialData?.invoice_number) {
      setValue('invoice_number', generateInvoiceNumber());
    }
  }, [setValue, initialData]);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // 항목 데이터 검증
      if (items.some(item => !item.description.trim() || item.quantity <= 0 || item.unit_price < 0)) {
        showError('입력 오류', '모든 항목의 정보를 올바르게 입력해주세요.');
        return;
      }

      const invoiceData = {
        ...data,
        items: JSON.stringify(items), // JSON 문자열로 저장
        amount: items.reduce((sum, item) => sum + item.total, 0)
      };

      await createInvoice(invoiceData);
      reset();
      setItems([{ description: '', quantity: 1, unit_price: 0, total: 0 }]);
      onSuccess?.();
    } catch (error) {
      console.error('청구서 생성 실패:', error);
      showError('청구서 생성 실패', '청구서 생성 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    reset();
    setItems([{ description: '', quantity: 1, unit_price: 0, total: 0 }]);
    onCancel?.();
  };

  return (
    <form id="invoice-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트 *
              </label>
              <select
                {...register('project_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">프로젝트를 선택하세요</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.client?.name || '클라이언트 정보 없음'}
                  </option>
                ))}
              </select>
              {errors.project_id && (
                <p className="mt-1 text-sm text-red-600">{errors.project_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                청구서 번호 *
              </label>
              <Input
                {...register('invoice_number')}
                placeholder="INV-20241201-001"
                error={errors.invoice_number?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                발행일 *
              </label>
              <Controller
                name="issue_date"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    placeholder="발행일을 선택하세요"
                  />
                )}
              />
              {errors.issue_date && (
                <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마감일 *
              </label>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    placeholder="마감일을 선택하세요"
                  />
                )}
              />
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="draft">임시저장</option>
                <option value="sent">발송됨</option>
                <option value="paid">결제완료</option>
                <option value="overdue">연체</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                메모
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="추가 설명이나 메모를 입력하세요"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 청구 항목 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>청구 항목</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <PlusIcon className="w-4 h-4 mr-2" />
            항목 추가
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    항목 설명 *
                  </label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="작업 내용을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수량 *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단가 *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      합계
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      ₩{item.total.toLocaleString()}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 총 금액 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>총 금액:</span>
              <span className="text-teal-600">
                ₩{items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

    </form>
  );
}