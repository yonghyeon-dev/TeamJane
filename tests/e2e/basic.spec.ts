import { test, expect } from '@playwright/test'

test.describe('Basic Application Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible()
    
    // Check for basic HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
    
    // Check if the app has loaded (should have some content)
    const hasContent = await page.locator('main, [role="main"], #__next').isVisible({ timeout: 5000 })
    expect(hasContent).toBeTruthy()
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check for viewport meta tag (responsive design)
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).toContain('width=device-width')
    
    // Check for title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })
})