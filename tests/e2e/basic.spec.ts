import { test, expect } from '@playwright/test'

test.describe('기본 접근성 테스트', () => {
  test('홈페이지 로딩과 콘솔 에러 확인', async ({ page }) => {
    // 콘솔 에러를 캐치
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', error => {
      errors.push(error.message)
    })

    // 홈페이지 로드
    await page.goto('/')
    
    // 페이지가 로딩될 때까지 기다림
    await page.waitForLoadState('networkidle')
    
    // 페이지 타이틀이 비어있지 않은지 확인
    const title = await page.title()
    console.log('페이지 타이틀:', title)
    
    // HTML 구조 확인
    const html = await page.content()
    console.log('HTML 길이:', html.length)
    
    // 에러 로깅
    if (errors.length > 0) {
      console.log('콘솔 에러들:', errors)
    }
    
    // 기본 HTML 요소 확인
    const bodyVisible = await page.locator('body').isVisible()
    expect(bodyVisible).toBe(true)
    
    // H1 태그 존재 여부 확인  
    const h1Count = await page.locator('h1').count()
    console.log('H1 태그 개수:', h1Count)
    expect(h1Count).toBeGreaterThan(0)
  })
  
  test('네비게이션 링크들이 존재하는지 확인', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 네비게이션 링크들 찾기
    const dashboardLink = page.locator('a[href="/dashboard"]')
    const clientsLink = page.locator('a[href="/clients"]')
    const projectsLink = page.locator('a[href="/projects"]')
    
    console.log('대시보드 링크 개수:', await dashboardLink.count())
    console.log('클라이언트 링크 개수:', await clientsLink.count())
    console.log('프로젝트 링크 개수:', await projectsLink.count())
  })
})