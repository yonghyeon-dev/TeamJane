import { test, expect } from '@playwright/test'

test.describe('Login System Diagnosis', () => {
  test('should properly handle home page and auth flow', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('/')
    
    // 2. 홈페이지가 정상 로드되는지 확인
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('text=흩어진 당신의 업무를')).toBeVisible()
    
    // 3. 로그인 버튼 클릭
    const loginButton = page.locator('a[href="/auth/login"]').first()
    await expect(loginButton).toBeVisible()
    await loginButton.click()
    
    // 4. 로그인 페이지로 이동 확인
    await expect(page).toHaveURL(/.*auth\/login.*/)
    
    // 5. 로그인 폼 요소들 확인
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // 6. 폼 필드 확인
    await expect(page.locator('text=이메일')).toBeVisible()
    await expect(page.locator('text=비밀번호')).toBeVisible()
    await expect(page.locator('text=로그인')).toBeVisible()
  })
  
  test('should handle invalid login credentials', async ({ page }) => {
    // 1. 로그인 페이지로 직접 이동
    await page.goto('/auth/login')
    
    // 2. 잘못된 자격증명 입력
    await page.fill('input[type="email"]', 'invalid@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // 3. 로그인 시도
    await page.click('button[type="submit"]')
    
    // 4. 오류 메시지 또는 로딩 상태 확인
    // (Supabase 인증 실패 메시지가 나타날 때까지 대기)
    await page.waitForTimeout(3000) // 인증 처리 대기
    
    // 5. 여전히 로그인 페이지에 있는지 확인
    await expect(page).toHaveURL(/.*auth\/login.*/)
    
    // 6. 오류 메시지 확인 (존재한다면)
    const errorAlert = page.locator('[role="alert"]')
    const generalError = page.locator('text*="Invalid"')
    const koreanError = page.locator('text*="오류"')
    
    const isAlertVisible = await errorAlert.isVisible({ timeout: 2000 })
    const isGeneralErrorVisible = await generalError.isVisible({ timeout: 1000 })
    const isKoreanErrorVisible = await koreanError.isVisible({ timeout: 1000 })
    
    if (isAlertVisible) {
      console.log('Alert message found:', await errorAlert.textContent())
    } else if (isGeneralErrorVisible) {
      console.log('General error found:', await generalError.textContent())
    } else if (isKoreanErrorVisible) {
      console.log('Korean error found:', await koreanError.textContent())
    } else {
      console.log('No specific error message found, but login form is still present')
    }
  })
  
  test('should handle protected route access without authentication', async ({ page }) => {
    // 1. 비로그인 상태에서 대시보드 접근 시도
    await page.goto('/dashboard')
    
    // 2. 로그인 페이지로 리다이렉션 확인
    await expect(page).toHaveURL(/.*auth\/login.*/)
    
    // 3. redirect 쿼리 파라미터 확인
    expect(page.url()).toContain('redirect=%2Fdashboard')
    
    // 4. 로그인 폼이 표시되는지 확인
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })
  
  test('should check Supabase configuration and client initialization', async ({ page }) => {
    // 1. 페이지 로드 시 콘솔 로그 모니터링
    const logs: string[] = []
    page.on('console', msg => {
      logs.push(msg.text())
    })
    
    // 2. 홈페이지 방문
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    // 3. Supabase 관련 로그 확인
    const supabaseLogsExist = logs.some(log => 
      log.includes('Supabase') || 
      log.includes('supabase') ||
      log.includes('환경변수') ||
      log.includes('클라이언트 생성')
    )
    
    console.log('Console logs:', logs.filter(log => 
      log.includes('Supabase') || log.includes('supabase')
    ))
    
    expect(supabaseLogsExist).toBeTruthy()
    
    // 4. 로그인 페이지에서도 확인
    await page.goto('/auth/login')
    await page.waitForTimeout(1000)
  })
  
  test('should test signup flow', async ({ page }) => {
    // 1. 회원가입 페이지 방문
    await page.goto('/auth/register')
    
    // 2. 회원가입 폼 요소 확인
    await expect(page.locator('input[name="name"], input[id="name"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // 3. 테스트 데이터로 회원가입 시도 (실제 DB에 영향 없도록 임시 이메일)
    const testEmail = `test.${Date.now()}@example.com`
    
    await page.fill('input[name="name"], input[id="name"]', 'Test User')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', 'testpassword123')
    
    // 4. 회원가입 버튼 클릭
    await page.click('button[type="submit"]')
    
    // 5. 처리 중 상태 확인
    await page.waitForTimeout(2000)
    
    // 6. 결과 확인 (이메일 인증 페이지로 이동하거나 오류 메시지)
    const currentUrl = page.url()
    console.log('After signup attempt, current URL:', currentUrl)
    
    // 성공 시 이메일 인증 페이지로, 실패 시 회원가입 페이지에 머물러야 함
    expect(currentUrl).toMatch(/\/(auth\/verify-email|auth\/register)/)
  })
})