# Weave 도메인 모델 설계

## 핵심 엔티티 관계도

```mermaid
erDiagram
    User ||--o{ Client : manages
    User ||--o{ Project : owns
    User ||--o{ Document : creates
    User ||--o{ Invoice : issues
    User ||--o{ Transaction : records
    User ||--o{ TaxCalculation : calculates
    
    Client ||--o{ Project : commissions
    Client ||--o{ Document : receives
    Client ||--o{ Invoice : pays
    Client ||--o{ ClientDocument : uploads
    
    Project ||--o{ Document : contains
    Project ||--o{ Invoice : generates
    Project ||--o{ ProjectTask : includes
    Project ||--o{ ProjectDocument : stores
    Project ||--o{ TimeEntry : tracks
    
    Invoice ||--o{ Transaction : creates
    Invoice ||--o{ InvoiceItem : contains
    
    Document ||--o{ DocumentVersion : has_versions
    Document ||--o{ DocumentSignature : requires
    
    User {
        string email
        string name
        string business_name
        string phone
        string business_number
        string role
        datetime created_at
    }
    
    Client {
        string company_name
        string contact_name
        string email
        string phone
        string address
        string business_number
        text notes
        datetime created_at
    }
    
    Project {
        string title
        text description
        string status
        decimal budget
        date start_date
        date end_date
        integer progress
        datetime created_at
    }
    
    Document {
        string document_type
        string title
        string number
        json content
        string status
        datetime created_at
    }
    
    Invoice {
        string invoice_number
        date issue_date
        date due_date
        decimal total_amount
        decimal tax_amount
        string status
        datetime paid_at
    }
    
    Transaction {
        string transaction_type
        decimal amount
        date transaction_date
        string description
        string category
    }
    
    TaxCalculation {
        string income_type
        decimal gross_amount
        decimal tax_rate
        decimal tax_amount
        decimal net_amount
        integer year
        integer month
    }
```

## 상태 정의

### Project Status
- `pending` - 진행 전
- `in_progress` - 진행 중
- `feedback` - 피드백
- `completed` - 완료
- `cancelled` - 취소됨

### Document Type
- `quote` - 견적서
- `contract` - 계약서
- `invoice` - 청구서
- `receipt` - 거래명세서

### Document Status
- `draft` - 초안
- `sent` - 발송됨
- `viewed` - 열람됨
- `signed` - 서명됨
- `cancelled` - 취소됨

### Invoice Status
- `draft` - 초안
- `issued` - 발행됨
- `paid` - 입금완료
- `overdue` - 연체
- `cancelled` - 취소됨

### Transaction Type
- `income` - 수입
- `expense` - 지출
- `tax` - 세금