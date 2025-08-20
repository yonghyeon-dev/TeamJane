import { test, expect } from '@playwright/test'

test.describe('컴파일 실패 실시간 진단', () => {
  
  test('브라우저에서 실제 컴파일 상태 확인', async ({ page }) => {
    // 콘솔 에러와 네트워크 에러 수집
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    const networkErrors: { status: number, url: string }[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
        console.log('🔴 Console Error:', msg.text())
      } else if (msg.type() === 'warn') {
        console.log('⚠️ Console Warning:', msg.text())
      }
    })
    
    page.on('pageerror', (err) => {
      pageErrors.push(err.message)
      console.log('💥 Page Error:', err.message)
    })
    
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push({ status: response.status(), url: response.url() })
        console.log(`🌐 Network Error: ${response.status()} ${response.url()}`)
      }
    })
    
    // 페이지 접속 시도 - 타임아웃 연장
    console.log('🚀 페이지 접속 시작...')
    
    try {
      const response = await page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 // 60초 타임아웃
      })
      
      console.log(`✅ HTTP 응답 상태: ${response?.status()}`)
      
      // 페이지 타이틀 확인
      const title = await page.title()
      console.log(`📄 페이지 제목: "${title}"`)
      
      // 기본 DOM 요소 확인
      const bodyContent = await page.locator('body').textContent()
      const hasContent = bodyContent && bodyContent.length > 100
      console.log(`📝 페이지 콘텐츠 길이: ${bodyContent?.length || 0}`)
      
      if (hasContent) {
        console.log('✅ 페이지 콘텐츠 정상 로드됨')
        
        // 주요 요소들 확인
        const h1Exists = await page.locator('h1').isVisible({ timeout: 5000 }).catch(() => false)
        const navExists = await page.locator('nav, header').isVisible({ timeout: 5000 }).catch(() => false)
        
        console.log(`🔍 H1 요소: ${h1Exists ? '존재' : '없음'}`)
        console.log(`🧭 Nav 요소: ${navExists ? '존재' : '없음'}`)
        
        if (h1Exists) {
          const h1Text = await page.locator('h1').textContent()
          console.log(`📰 H1 텍스트: "${h1Text}"`)
        }
      } else {
        console.log('🔴 페이지 콘텐츠가 거의 없음 - 컴파일 실패 가능성')
      }
      
    } catch (error) {
      console.log('🚨 페이지 로딩 실패:', error.message)
    }
    
    // 에러 요약
    console.log('\n📊 진단 요약:')
    console.log(`🔴 콘솔 에러: ${consoleErrors.length}개`)
    console.log(`💥 페이지 에러: ${pageErrors.length}개`)
    console.log(`🌐 네트워크 에러: ${networkErrors.length}개`)
    
    if (consoleErrors.length > 0) {
      console.log('\n📋 콘솔 에러 상세:')
      consoleErrors.forEach((error, i) => console.log(`  ${i+1}. ${error}`))
    }
    
    if (pageErrors.length > 0) {
      console.log('\n📋 페이지 에러 상세:')
      pageErrors.forEach((error, i) => console.log(`  ${i+1}. ${error}`))
    }
    
    if (networkErrors.length > 0) {
      console.log('\n📋 네트워크 에러 상세:')
      networkErrors.forEach((error, i) => console.log(`  ${i+1}. ${error.status} ${error.url}`))
    }
  })
  
  test('컴파일된 JavaScript 파일 직접 확인', async ({ page }) => {
    console.log('\n🔍 Next.js 정적 파일 직접 확인:')
    
    // Next.js 메인 번들 파일들 확인
    const staticFiles = [
      'http://localhost:3000/_next/static/chunks/webpack.js',
      'http://localhost:3000/_next/static/chunks/main.js',
      'http://localhost:3000/_next/static/chunks/pages/_app.js'
    ]
    
    for (const url of staticFiles) {
      try {
        const response = await page.goto(url, { timeout: 10000 })
        console.log(`✅ ${url}: ${response?.status()}`)
      } catch (error) {
        console.log(`🔴 ${url}: 접근 실패 - ${error.message}`)
      }
    }
  })
  
  test('개발자 도구에서 실시간 에러 모니터링', async ({ page }) => {
    console.log('\n🛠️ 개발자 도구 실시간 모니터링:')
    
    // 개발자 도구를 활용한 상세 분석
    await page.goto('http://localhost:3000')
    
    // React DevTools 감지
    const hasReact = await page.evaluate(() => {
      return typeof window.React !== 'undefined' || 
             typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined'
    })
    console.log(`⚛️ React 감지: ${hasReact ? '있음' : '없음'}`)
    
    // Next.js 환경 확인
    const nextConfig = await page.evaluate(() => {
      return {
        nextVersion: window.__NEXT_DATA__?.buildId ? 'Next.js 감지됨' : '감지 안됨',
        routerReady: window.__NEXT_DATA__?.page ? '라우터 준비됨' : '라우터 문제',
        buildId: window.__NEXT_DATA__?.buildId?.substring(0, 8) || 'N/A'
      }
    })
    console.log('🔧 Next.js 상태:', nextConfig)
    
    // 스타일 로딩 확인
    const stylesLoaded = await page.evaluate(() => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style')
      return stylesheets.length
    })
    console.log(`🎨 로드된 스타일시트: ${stylesLoaded}개`)
    
    // JavaScript 실행 환경 체크
    const jsEnvironment = await page.evaluate(() => {
      try {
        return {
          es6Support: typeof Promise !== 'undefined',
          asyncSupport: typeof async !== 'undefined',
          arrowFunctions: eval('(() => true)()'),
          modules: typeof module !== 'undefined'
        }
      } catch (e) {
        return { error: e.message }
      }
    })
    console.log('🔬 JavaScript 환경:', jsEnvironment)
  })
})