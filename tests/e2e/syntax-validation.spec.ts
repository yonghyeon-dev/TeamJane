import { test, expect } from '@playwright/test'

test.describe('사이트 문법오류 및 런타임 에러 진단', () => {
  
  test('홈페이지 로딩 및 JavaScript 에러 확인', async ({ page }) => {
    // 콘솔 에러 수집
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    page.on('pageerror', (err) => {
      pageErrors.push(err.message)
    })
    
    // 네트워크 에러 수집
    const networkErrors: string[] = []
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push(`${response.status()} ${response.url()}`)
      }
    })
    
    // 홈페이지 접속
    console.log('🌐 홈페이지 접속 시도...')
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    
    // 페이지 기본 요소 확인
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    
    // 에러 결과 출력
    console.log('\n📊 진단 결과:')
    console.log(`✅ 페이지 로딩: 성공`)
    console.log(`🎯 콘솔 에러: ${consoleErrors.length}개`)
    console.log(`💥 페이지 에러: ${pageErrors.length}개`)
    console.log(`🌐 네트워크 에러: ${networkErrors.length}개`)
    
    if (consoleErrors.length > 0) {
      console.log('\n🔴 콘솔 에러 목록:')
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }
    
    if (pageErrors.length > 0) {
      console.log('\n💥 페이지 에러 목록:')
      pageErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 네트워크 에러 목록:')
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }
    
    // 심각한 에러가 있는지 확인
    const hasCriticalErrors = pageErrors.length > 0 || 
      consoleErrors.some(error => 
        error.includes('SyntaxError') || 
        error.includes('TypeError') ||
        error.includes('ReferenceError')
      )
    
    if (hasCriticalErrors) {
      console.log('\n🚨 심각한 문법/런타임 에러 발견!')
    } else {
      console.log('\n✅ 심각한 에러 없음 - 사이트 정상 동작')
    }
  })
  
  test('주요 UI 컴포넌트 렌더링 확인', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    console.log('\n🧩 UI 컴포넌트 검증:')
    
    // Navbar 확인
    const navbar = page.locator('nav, header').first()
    await expect(navbar).toBeVisible()
    console.log('✅ Navbar: 정상 렌더링')
    
    // Hero 섹션 확인
    const heroTitle = page.locator('h1')
    await expect(heroTitle).toBeVisible()
    const titleText = await heroTitle.textContent()
    console.log(`✅ Hero 제목: "${titleText}"`)
    
    // Footer 확인
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    console.log('✅ Footer: 정상 렌더링')
    
    // 버튼 클릭 가능 확인
    const buttons = page.locator('button, a[role="button"]')
    const buttonCount = await buttons.count()
    console.log(`✅ 버튼 ${buttonCount}개 발견`)
    
    if (buttonCount > 0) {
      // 첫 번째 버튼 hover 테스트
      await buttons.first().hover()
      console.log('✅ 버튼 상호작용: 정상')
    }
  })
  
  test('브라우저별 호환성 확인', async ({ page, browserName }) => {
    console.log(`\n🌐 ${browserName} 브라우저 테스트`)
    
    await page.goto('http://localhost:3000')
    
    // JavaScript 기본 기능 확인
    const jsCheck = await page.evaluate(() => {
      try {
        // ES6+ 기능 확인
        const arrow = () => 'test'
        const [a, b] = [1, 2]
        const obj = { test: 'value', ...{} }
        
        return {
          arrow: arrow() === 'test',
          destructuring: a === 1 && b === 2,
          spread: obj.test === 'value',
          support: true
        }
      } catch (error) {
        return {
          support: false,
          error: error.message
        }
      }
    })
    
    console.log(`✅ ${browserName} JavaScript 지원:`, jsCheck.support ? '정상' : '문제 있음')
    
    if (!jsCheck.support) {
      console.log(`🔴 ${browserName} 에러:`, jsCheck.error)
    }
  })
  
  test('CSS 스타일 및 Tailwind 동작 확인', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    console.log('\n🎨 CSS 및 스타일 검증:')
    
    // Tailwind CSS 클래스 적용 확인
    const heroSection = page.locator('h1').first()
    
    if (await heroSection.isVisible()) {
      const styles = await heroSection.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          color: computed.color,
          marginBottom: computed.marginBottom
        }
      })
      
      console.log('✅ Hero 제목 스타일:', styles)
      
      // 폰트 크기가 적절한지 확인 (text-5xl 등)
      const fontSizeNum = parseFloat(styles.fontSize)
      if (fontSizeNum > 32) {
        console.log('✅ 대형 제목 스타일: 정상 적용')
      } else {
        console.log('⚠️ 제목 크기가 예상보다 작음')
      }
    }
    
    // 색상 테마 적용 확인
    const primaryElements = page.locator('[class*="primary"]')
    const primaryCount = await primaryElements.count()
    console.log(`✅ Primary 색상 요소: ${primaryCount}개`)
    
    // 반응형 디자인 확인
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(1000) // 반응형 전환 대기
    
    const isMobileMenuVisible = await page.locator('[class*="mobile"]').isVisible()
    console.log(`✅ 모바일 반응형: ${isMobileMenuVisible ? '메뉴 표시' : '데스크톱 모드'}`)
  })
  
  test('성능 및 로딩 속도 측정', async ({ page }) => {
    console.log('\n⚡ 성능 측정:')
    
    const startTime = Date.now()
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle' 
    })
    
    const loadTime = Date.now() - startTime
    console.log(`✅ 전체 로딩 시간: ${loadTime}ms`)
    
    // Web Vitals 측정
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('web-vital' in window) {
          resolve({ available: false })
        } else {
          // 기본 성능 지표
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          resolve({
            available: true,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
          })
        }
      })
    })
    
    if (webVitals.available) {
      console.log('✅ 성능 지표:', webVitals)
    }
    
    // 성능 기준 체크
    if (loadTime < 3000) {
      console.log('✅ 로딩 성능: 우수 (3초 미만)')
    } else if (loadTime < 5000) {
      console.log('⚠️ 로딩 성능: 보통 (3-5초)')
    } else {
      console.log('🔴 로딩 성능: 개선 필요 (5초 초과)')
    }
  })
})