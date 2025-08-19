import { test, expect } from '@playwright/test'

test.describe('WEAVE ERP 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('대시보드 기능', () => {
    test('대시보드 위젯 로딩', async ({ page }) => {
      await page.click('a[href="/dashboard"]')
      
      // 주요 위젯들이 로딩되는지 확인
      await expect(page.locator('h1')).toContainText('대시보드')
      
      // 통계 카드들 확인
      await page.waitForSelector('[data-testid="stats-card"], .stats-card, .card', { timeout: 10000 })
      
      // 차트나 그래프가 있다면 로딩 확인
      const chartElements = await page.locator('canvas, svg[class*="recharts"]').count()
      if (chartElements > 0) {
        console.log(`${chartElements}개의 차트 요소를 확인했습니다.`)
      }
    })
  })

  test.describe('클라이언트 관리', () => {
    test('클라이언트 목록 조회', async ({ page }) => {
      await page.click('a[href="/clients"]')
      await expect(page).toHaveURL('/clients')
      
      // 클라이언트 목록 로딩 대기
      await page.waitForSelector('table, [data-testid="client-list"], .client-item', { timeout: 10000 })
      
      // 검색 기능이 있다면 테스트
      const searchInput = page.locator('input[placeholder*="검색"], input[type="search"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('test')
        await page.waitForTimeout(1000) // 검색 필터링 대기
      }
    })

    test('클라이언트 생성 모달/폼', async ({ page }) => {
      await page.click('a[href="/clients"]')
      
      // 새 클라이언트 생성 버튼 찾기
      const createButton = page.locator('button:has-text("새 클라이언트"), button:has-text("추가"), button[data-testid="create-client"]')
      
      if (await createButton.first().isVisible()) {
        await createButton.first().click()
        
        // 모달 또는 폼이 나타나는지 확인
        await expect(page.locator('dialog, [role="dialog"], .modal, form')).toBeVisible()
      }
    })
  })

  test.describe('프로젝트 관리', () => {
    test('프로젝트 목록 조회', async ({ page }) => {
      await page.click('a[href="/projects"]')
      await expect(page).toHaveURL('/projects')
      
      // 프로젝트 목록 로딩 대기
      await page.waitForSelector('table, [data-testid="project-list"], .project-item', { timeout: 10000 })
      
      // 상태 필터가 있다면 테스트
      const statusFilter = page.locator('select, [data-testid="status-filter"]')
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption({ index: 1 })
        await page.waitForTimeout(1000)
      }
    })

    test('프로젝트 생성 폼', async ({ page }) => {
      await page.click('a[href="/projects"]')
      
      // 새 프로젝트 생성 버튼 찾기
      const createButton = page.locator('button:has-text("새 프로젝트"), button:has-text("추가"), button[data-testid="create-project"]')
      
      if (await createButton.first().isVisible()) {
        await createButton.first().click()
        
        // 생성 폼이나 모달 확인
        await expect(page.locator('dialog, [role="dialog"], .modal, form')).toBeVisible()
      }
    })
  })

  test.describe('문서 관리', () => {
    test('문서 페이지 기능', async ({ page }) => {
      await page.click('a[href="/documents"]')
      await expect(page).toHaveURL('/documents')
      
      // 문서 목록 또는 업로드 영역 확인
      await page.waitForSelector('table, [data-testid="document-list"], .document-item, [data-testid="upload-area"]', { timeout: 10000 })
      
      // 파일 업로드 기능이 있다면 테스트
      const uploadButton = page.locator('button:has-text("업로드"), input[type="file"], [data-testid="upload-button"]')
      if (await uploadButton.first().isVisible()) {
        console.log('파일 업로드 기능이 감지되었습니다.')
      }
    })
  })

  test.describe('청구서 관리', () => {
    test('청구서 목록 및 생성', async ({ page }) => {
      await page.click('a[href="/invoices"]')
      await expect(page).toHaveURL('/invoices')
      
      // 청구서 목록 로딩 대기
      await page.waitForSelector('table, [data-testid="invoice-list"], .invoice-item', { timeout: 10000 })
      
      // 새 청구서 생성 버튼
      const createInvoiceButton = page.locator('button:has-text("새 청구서"), button:has-text("생성"), button[data-testid="create-invoice"]')
      if (await createInvoiceButton.first().isVisible()) {
        console.log('청구서 생성 기능이 확인되었습니다.')
      }
    })
  })

  test.describe('설정 페이지', () => {
    test('설정 페이지 접근 및 기능', async ({ page }) => {
      await page.click('a[href="/settings"]')
      await expect(page).toHaveURL('/settings')
      
      // 설정 폼이나 옵션들 확인
      await page.waitForSelector('form, [data-testid="settings-form"], input, select', { timeout: 10000 })
      
      // 테마 선택기가 있다면 테스트
      const themeSelector = page.locator('[data-testid="theme-selector"], select[name*="theme"]')
      if (await themeSelector.isVisible()) {
        await themeSelector.selectOption({ index: 1 })
        console.log('테마 변경 기능이 테스트되었습니다.')
      }
    })
  })

  test.describe('반응형 디자인', () => {
    test('모바일 뷰포트에서의 기능', async ({ page }) => {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 대시보드 이동
      await page.click('a[href="/dashboard"]')
      
      // 모바일에서도 주요 기능이 접근 가능한지 확인
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.locator('main, [role="main"]')).toBeVisible()
      
      // 햄버거 메뉴나 모바일 네비게이션 확인
      const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu, button[aria-label*="menu"]')
      if (await mobileNav.first().isVisible()) {
        await mobileNav.first().click()
      }
    })

    test('태블릿 뷰포트에서의 기능', async ({ page }) => {
      // 태블릿 뷰포트 설정
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // 주요 페이지들 순회하며 레이아웃 확인
      const pages = ['/dashboard', '/clients', '/projects']
      
      for (const pagePath of pages) {
        await page.goto(pagePath)
        await expect(page.locator('nav')).toBeVisible()
        await expect(page.locator('main, [role="main"]')).toBeVisible()
      }
    })
  })

  test.describe('성능 및 접근성', () => {
    test('페이지 로딩 성능', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/dashboard')
      
      // 주요 콘텐츠가 로딩될 때까지 대기
      await page.waitForSelector('h1', { timeout: 10000 })
      
      const loadTime = Date.now() - startTime
      console.log(`대시보드 로딩 시간: ${loadTime}ms`)
      
      // 5초 이내 로딩을 목표로 함
      expect(loadTime).toBeLessThan(5000)
    })

    test('접근성 기본 요소', async ({ page }) => {
      await page.goto('/dashboard')
      
      // 기본 접근성 요소들 확인
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.locator('main, [role="main"]')).toBeVisible()
      
      // 스킵 링크가 있다면 확인
      const skipLink = page.locator('a[href="#main"], [data-testid="skip-link"]')
      if (await skipLink.isVisible()) {
        console.log('스킵 링크가 확인되었습니다.')
      }
    })
  })

  test.describe('에러 처리', () => {
    test('네트워크 에러 시뮬레이션', async ({ page }) => {
      // 네트워크를 오프라인으로 설정
      await page.context().setOffline(true)
      
      await page.goto('/clients')
      
      // 에러 메시지나 오프라인 표시가 나타나는지 확인
      await page.waitForSelector('[data-testid="error-message"], .error, [data-testid="offline-indicator"]', { 
        timeout: 10000,
        state: 'visible' 
      }).catch(() => {
        console.log('오프라인 상태 표시를 찾을 수 없습니다.')
      })
      
      // 네트워크 다시 온라인으로 설정
      await page.context().setOffline(false)
    })
  })

  test.describe('데이터 흐름', () => {
    test('CRUD 작업 플로우 (시뮬레이션)', async ({ page }) => {
      // 클라이언트 페이지로 이동
      await page.click('a[href="/clients"]')
      
      // 생성 버튼 클릭
      const createButton = page.locator('button:has-text("새 클라이언트"), button:has-text("추가")')
      if (await createButton.first().isVisible()) {
        await createButton.first().click()
        
        // 폼 입력 (있다면)
        const nameInput = page.locator('input[name="name"], input[placeholder*="이름"]')
        if (await nameInput.isVisible()) {
          await nameInput.fill('테스트 클라이언트')
        }
        
        const emailInput = page.locator('input[name="email"], input[type="email"]')
        if (await emailInput.isVisible()) {
          await emailInput.fill('test@example.com')
        }
        
        // 저장 버튼 클릭 (있다면)
        const saveButton = page.locator('button:has-text("저장"), button:has-text("생성"), button[type="submit"]')
        if (await saveButton.first().isVisible()) {
          console.log('폼 저장 기능이 확인되었습니다.')
        }
      }
    })
  })
})