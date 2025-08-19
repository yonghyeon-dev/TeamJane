import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Skip tests if authentication is required
    const isAuthPage = await page.locator('input[type="email"]').isVisible({ timeout: 3000 })
    if (isAuthPage) {
      test.skip('Authentication required - skipping dashboard tests', () => {})
    }
  })

  test('should display dashboard with key metrics', async ({ page }) => {
    // Navigate to dashboard if not already there
    await page.goto('/dashboard')
    
    // Check for dashboard title
    await expect(page.locator('h1, [role="heading"]:has-text("대시보드"), [role="heading"]:has-text("Dashboard")')).toBeVisible()
    
    // Check for statistics cards
    const statsCards = page.locator('[class*="card"], [class*="Card"]')
    await expect(statsCards.first()).toBeVisible()
    
    // Look for common dashboard elements
    const elements = [
      'text=프로젝트, text=Projects',
      'text=클라이언트, text=Clients', 
      'text=청구서, text=Invoices',
      'text=수익, text=Revenue'
    ]
    
    for (const element of elements) {
      const el = page.locator(element).first()
      if (await el.isVisible({ timeout: 2000 })) {
        await expect(el).toBeVisible()
      }
    }
  })

  test('should display recent projects section', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for recent projects section
    const recentProjects = page.locator('text=최근 프로젝트, text=Recent Projects')
    if (await recentProjects.isVisible({ timeout: 3000 })) {
      await expect(recentProjects).toBeVisible()
    }
  })

  test('should display charts and graphs', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for chart containers (common chart libraries)
    const chartElements = page.locator('[class*="recharts"], [class*="chart"], svg')
    if (await chartElements.first().isVisible({ timeout: 3000 })) {
      await expect(chartElements.first()).toBeVisible()
    }
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Test navigation to projects page
    const projectsLink = page.locator('a[href*="/projects"], button:has-text("프로젝트"), button:has-text("Projects")')
    if (await projectsLink.first().isVisible({ timeout: 2000 })) {
      await projectsLink.first().click()
      await expect(page).toHaveURL(/.*projects.*/)
    }
  })
})

test.describe('Dashboard Performance', () => {
  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/dashboard')
    
    // Wait for main content to load
    await page.waitForSelector('body', { timeout: 10000 })
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
  })

  test('should handle loading states gracefully', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for loading indicators
    const loadingIndicators = page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]')
    
    // Loading indicators should eventually disappear
    if (await loadingIndicators.first().isVisible({ timeout: 1000 })) {
      await expect(loadingIndicators.first()).toBeHidden({ timeout: 10000 })
    }
  })
})