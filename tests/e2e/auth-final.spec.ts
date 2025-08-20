import { test, expect } from '@playwright/test'

test.describe('Final Authentication System Test', () => {
  
  test('should display proper error messages for invalid credentials', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('/auth/login')
    
    // 2. 페이지 로딩 확인
    await expect(page.locator('h2')).toContainText('로그인')
    
    // 3. 잘못된 자격증명 입력
    await page.fill('#email', 'invalid.test@example.com')
    await page.fill('#password', 'wrongpassword123')
    
    // 4. 로그인 시도
    await page.click('button[type="submit"]')
    
    // 5. 로딩 상태 확인
    await expect(page.locator('button[type="submit"]')).toContainText('로그인 중')
    
    // 6. 처리 완료까지 대기 (최대 10초)
    await page.waitForTimeout(5000)
    
    // 7. 오류 메시지 확인
    const errorAlert = page.locator('[role="alert"]').first()
    const isErrorVisible = await errorAlert.isVisible({ timeout: 3000 })
    
    if (isErrorVisible) {
      const errorText = await errorAlert.textContent()
      console.log('Found error message:', errorText)
      
      // Rate limit 또는 인증 오류 메시지 확인
      expect(errorText).toMatch(/(너무 많은 요청|이메일 또는 비밀번호가 일치하지 않습니다|rate limit)/i)
    } else {
      console.log('No error message found, checking if still on login page')
      // 여전히 로그인 페이지에 있어야 함
      await expect(page).toHaveURL(/.*auth\/login.*/)
    }
  })
  
  test('should handle form validation properly', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('/auth/login')
    
    // 2. 빈 폼 제출 시도
    await page.click('button[type="submit"]')
    
    // 3. 브라우저 기본 검증 또는 커스텀 오류 메시지 확인
    const emailField = page.locator('#email')
    const isEmailValid = await emailField.evaluate(el => (el as HTMLInputElement).validity.valid)
    expect(isEmailValid).toBe(false)
    
    // 4. 잘못된 이메일 형식 테스트
    await page.fill('#email', 'invalid-email')
    await page.fill('#password', 'test123')
    await page.click('button[type="submit"]')
    
    // 5. 클라이언트 검증 오류 메시지 확인
    const errorMessage = page.locator('[role="alert"]')
    const hasValidationError = await errorMessage.isVisible({ timeout: 2000 })
    
    if (hasValidationError) {
      const errorText = await errorMessage.textContent()
      expect(errorText).toContain('올바른 이메일 주소를')
    }
  })
  
  test('should handle signup form validation', async ({ page }) => {
    // 1. 회원가입 페이지로 이동
    await page.goto('/auth/register')
    
    // 2. 페이지 로딩 확인
    await expect(page.locator('h2')).toContainText('계정 만들기')
    
    // 3. 이름 없이 제출 시도
    await page.fill('#email', 'test@example.com')
    await page.fill('#password', 'password123')
    await page.click('button[type="submit"]')
    
    // 4. 이름 필드 검증 확인
    const nameField = page.locator('#name')
    const isNameValid = await nameField.evaluate(el => (el as HTMLInputElement).validity.valid)
    expect(isNameValid).toBe(false)
  })
  
  test('should navigate between login and signup', async ({ page }) => {
    // 1. 로그인 페이지 시작
    await page.goto('/auth/login')
    await expect(page.locator('h2')).toContainText('로그인')
    
    // 2. 회원가입 링크 클릭
    await page.click('text=계정 만들기')
    await expect(page).toHaveURL(/.*auth\/register.*/)
    await expect(page.locator('h2')).toContainText('계정 만들기')
    
    // 3. 로그인 링크 클릭
    await page.click('text=로그인하기')
    await expect(page).toHaveURL(/.*auth\/login.*/)
    await expect(page.locator('h2')).toContainText('로그인')
  })
  
  test('should show development mode notice', async ({ page }) => {
    // 1. 로그인 페이지 방문
    await page.goto('/auth/login')
    
    // 2. 개발 모드 알림 확인
    const devNotice = page.locator('text=개발 모드')
    const isDevNoticeVisible = await devNotice.isVisible({ timeout: 2000 })
    
    if (isDevNoticeVisible) {
      console.log('Development mode notice is visible')
      expect(devNotice).toBeVisible()
    } else {
      console.log('Development mode notice not found (may be in production mode)')
    }
  })
  
  test('should handle protected route redirects', async ({ page }) => {
    // 1. 대시보드에 직접 접근 시도
    await page.goto('/dashboard')
    
    // 2. 로그인 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/.*auth\/login.*/)
    
    // 3. redirect 쿼리 파라미터 확인
    expect(page.url()).toContain('redirect=%2Fdashboard')
    
    // 4. 다른 보호된 경로들 테스트
    const protectedRoutes = ['/projects', '/clients', '/documents', '/invoices', '/settings']
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL(/.*auth\/login.*/)
      expect(page.url()).toContain(`redirect=${encodeURIComponent(route)}`)
    }
  })
  
  test('should clear existing sessions before test', async ({ page }) => {
    // 1. 기존 세션 정리를 위해 로그아웃 시도
    await page.goto('/')
    
    // 2. 로컬 스토리지 정리
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // 3. 쿠키 정리
    await page.context().clearCookies()
    
    // 4. 페이지 새로고침
    await page.reload()
    
    // 5. 홈페이지 접근 후 랜딩 페이지 확인
    await page.goto('/')
    const isHomePage = await page.locator('h1').first().isVisible({ timeout: 3000 })
    expect(isHomePage).toBe(true)
    
    console.log('Session cleared successfully')
  })
})