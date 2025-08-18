-- WEAVE ERP MVP Seed Data
-- Test data for development and testing

-- Sample clients (will be associated with authenticated user)
INSERT INTO public.clients (id, user_id, name, company, email, phone, status, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', auth.uid(), '김철수', 'ABC Corp', 'kim@abccorp.com', '010-1234-5678', 'active', '주요 클라이언트'),
('550e8400-e29b-41d4-a716-446655440002', auth.uid(), '이영희', 'XYZ Inc', 'lee@xyzinc.com', '010-9876-5432', 'active', '장기 협력 업체'),
('550e8400-e29b-41d4-a716-446655440003', auth.uid(), '박민수', 'DEF Ltd', 'park@defltd.com', '010-5555-7777', 'potential', '잠재 고객'),
('550e8400-e29b-41d4-a716-446655440004', auth.uid(), '정소연', 'GHI Studio', 'jung@ghistudio.com', '010-3333-4444', 'inactive', '과거 클라이언트')
ON CONFLICT (id) DO NOTHING;

-- Sample projects
INSERT INTO public.projects (id, user_id, client_id, name, description, status, budget, progress, start_date, due_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', auth.uid(), '550e8400-e29b-41d4-a716-446655440001', 'ABC 스타트업 웹사이트 디자인', '스타트업을 위한 현대적인 웹사이트 디자인 및 개발', 'in_progress', 2500000.00, 75, '2024-01-01', '2024-01-15'),
('660e8400-e29b-41d4-a716-446655440002', auth.uid(), '550e8400-e29b-41d4-a716-446655440002', 'XYZ 모바일 앱 개발', '크로스 플랫폼 모바일 애플리케이션 개발', 'review', 5000000.00, 90, '2024-01-05', '2024-01-20'),
('660e8400-e29b-41d4-a716-446655440003', auth.uid(), '550e8400-e29b-41d4-a716-446655440003', 'DEF 브랜딩 프로젝트', '브랜드 아이덴티티 및 로고 디자인', 'planning', 1800000.00, 25, '2024-01-10', '2024-01-25'),
('660e8400-e29b-41d4-a716-446655440004', auth.uid(), '550e8400-e29b-41d4-a716-446655440004', 'GHI 로고 디자인', '로고 및 브랜딩 리뉴얼', 'completed', 800000.00, 100, '2023-12-01', '2023-12-15')
ON CONFLICT (id) DO NOTHING;

-- Sample invoices
INSERT INTO public.invoices (id, user_id, project_id, client_id, invoice_number, amount, tax_amount, total_amount, status, issue_date, due_date, paid_date) VALUES
('770e8400-e29b-41d4-a716-446655440001', auth.uid(), '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', 2500000.00, 250000.00, 2750000.00, 'paid', '2024-01-01', '2024-01-15', '2024-01-14'),
('770e8400-e29b-41d4-a716-446655440002', auth.uid(), '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', 5000000.00, 500000.00, 5500000.00, 'sent', '2024-01-05', '2024-01-20', NULL),
('770e8400-e29b-41d4-a716-446655440003', auth.uid(), '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'INV-2024-003', 1800000.00, 180000.00, 1980000.00, 'overdue', '2023-12-15', '2023-12-30', NULL),
('770e8400-e29b-41d4-a716-446655440004', auth.uid(), '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'INV-2024-004', 800000.00, 80000.00, 880000.00, 'draft', '2024-01-10', '2024-01-25', NULL)
ON CONFLICT (invoice_number) DO NOTHING;

-- Sample documents
INSERT INTO public.documents (id, user_id, project_id, client_id, title, type, status, file_size) VALUES
('880e8400-e29b-41d4-a716-446655440001', auth.uid(), '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ABC Corp 웹사이트 디자인 견적서', 'quote', 'approved', 250000),
('880e8400-e29b-41d4-a716-446655440002', auth.uid(), '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'XYZ Inc 모바일 앱 개발 계약서', 'contract', 'sent', 892000),
('880e8400-e29b-41d4-a716-446655440003', auth.uid(), '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'DEF Ltd 브랜딩 프로젝트 청구서', 'invoice', 'paid', 156000),
('880e8400-e29b-41d4-a716-446655440004', auth.uid(), NULL, NULL, '2023년 4분기 수익 보고서', 'report', 'draft', 1200000)
ON CONFLICT (id) DO NOTHING;

-- Create a function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  year_part TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  SELECT COALESCE(MAX(CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';
  
  RETURN 'INV-' || year_part || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;