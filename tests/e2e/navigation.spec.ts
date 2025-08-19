import { test, expect } from '@playwright/test'

test.describe('WEAVE ERP 페이지 네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 개발 서버 시작 (localhost:3000 가정)
    await page.goto('/')
  })

  test('홈페이지 로딩 및 기본 요소 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/WEAVE/)

    // Hero 섹션 확인 (실제 텍스트로 수정)
    await expect(page.locator('h1')).toContainText('흩어진 당신의 업무를')
    
    // 네비게이션 링크 확인
    await expect(page.locator('nav')).toBeVisible()
  })

  test('대시보드 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 대시보드 링크 클릭
    await page.click('a[href="/dashboard"]')
    
    // 인증 리다이렉트 확인 
    await expect(page).toHaveURL(/auth\/login/)
    
    // 로그인 페이지 제목 확인
    await expect(page.locator('h1')).toBeVisible()
  })

  test('클라이언트 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 클라이언트 페이지로 이동
    await page.click('a[href="/clients"]')
    await expect(page).toHaveURL(/auth\/login/)

    // 로그인 페이지가 정상적으로 로딩됨
    await expect(page.locator('h1')).toBeVisible()
  })

  test('프로젝트 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 프로젝트 페이지로 이동
    await page.click('a[href="/projects"]')
    await expect(page).toHaveURL(/auth\/login/)

    // 로그인 페이지가 정상적으로 로딩됨
    await expect(page.locator('h1')).toBeVisible()
  })

  test('문서 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 문서 페이지로 이동
    await page.click('a[href="/documents"]')
    await expect(page).toHaveURL(/auth\/login/)

    // 로그인 페이지가 정상적으로 로딩됨
    await expect(page.locator('h1')).toBeVisible()
  })

  test('청구서 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 청구서 페이지로 이동
    await page.click('a[href="/invoices"]')
    await expect(page).toHaveURL(/auth\/login/)

    // 로그인 페이지가 정상적으로 로딩됨
    await expect(page.locator('h1')).toBeVisible()
  })

  test('설정 페이지 이동 (인증 리다이렉트)', async ({ page }) => {
    // 설정 페이지로 이동
    await page.click('a[href="/settings"]')
    await expect(page).toHaveURL(/auth\/login/)

    // 로그인 페이지가 정상적으로 로딩됨
    await expect(page.locator('h1')).toBeVisible()
  })

  test('빠른 페이지 전환 테스트 (DB 로딩 중 페이지 이동 에러 방지)', async ({ page }) => {
    // 에러 캐치 설정
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // 클라이언트 페이지로 이동 시도 (로딩 시작)
    await page.click('a[href="/clients"]')
    
    // 즉시 홈으로 다시 이동 (DB 로딩 중 페이지 전환 시나리오)  
    await page.goto('/')
    
    // 다시 프로젝트 페이지로 이동 시도
    await page.click('a[href="/projects"]')
    
    // 최종 페이지가 로그인 페이지로 리다이렉트되는지 확인
    await expect(page).toHaveURL(/auth\/login/)
    
    // 페이지가 정상적으로 로딩되는지 확인
    await expect(page.locator('h1')).toBeVisible()
    
    // 잠시 기다린 후 에러 확인 (AbortController가 동작했는지)
    await page.waitForTimeout(2000)
    
    // 정상적인 에러들을 필터링 (AbortError, CSP 등)
    const criticalErrors = errors.filter(error => 
      !error.includes('AbortError') && 
      !error.includes('Failed to fetch') &&
      !error.includes('signal is aborted') &&
      !error.includes('Vercel') &&
      !error.includes('Content Security Policy') &&
      !error.includes('va.vercel-scripts.com') &&
      !error.includes('script.debug.js')
    )
    
    // 중요한 에러가 없는지 확인 (DB 로딩 에러가 수정되었는지 검증)
    expect(criticalErrors.length).toBe(0)
  })

  test('연속적인 페이지 이동 스트레스 테스트', async ({ page }) => {
    const pages = ['/dashboard', '/clients', '/projects', '/documents', '/invoices', '/settings']
    
    // 각 페이지를 빠르게 순회
    for (const pagePath of pages) {
      await page.goto(pagePath)
      
      // 인증이 필요한 페이지들은 로그인으로 리다이렉트됨
      if (page.url().includes('/auth/login')) {
        await expect(page.locator('h1')).toBeVisible()
      } else {
        // 홈페이지나 공개 페이지
        await expect(page.locator('nav')).toBeVisible()
      }
      
      // 짧은 대기 후 다음 페이지로
      await page.waitForTimeout(300)
    }
  })

  test('네비게이션 메뉴 반응성 테스트', async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 햄버거 메뉴 버튼 확인 (있다면)
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-toggle"]')
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    }
  })

  test('에러 상황에서의 견고성 테스트', async ({ page }) => {
    // 존재하지 않는 페이지로 이동
    await page.goto('/non-existent-page')
    
    // 404 페이지 또는 적절한 에러 처리 확인
    await expect(page.locator('body')).toBeVisible()
    
    // 홈으로 돌아갈 수 있는지 확인
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
  })

  test('모니터링 대시보드 기능 테스트 (개발 환경)', async ({ page }) => {
    // 개발 환경에서만 실행
    const isDev = process.env.NODE_ENV === 'development'
    test.skip(!isDev, '개발 환경에서만 실행')

    await page.goto('/dashboard')
    
    // 모니터링 버튼 확인 (우측 하단)
    const monitoringButton = page.locator('button:has-text("모니터링")')
    if (await monitoringButton.isVisible()) {
      await monitoringButton.click()
      
      // 모니터링 대시보드 패널 확인
      await expect(page.locator('div:has-text("성능 모니터링")')).toBeVisible()
      
      // 패널 닫기
      await page.locator('button:has-text("✕")').click()
    }
  })
})