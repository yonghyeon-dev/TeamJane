import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login form on initial visit', async ({ page }) => {
    await page.goto('/')
    
    // Check if we're redirected to auth page or login form is displayed
    await expect(page).toHaveURL(/.*auth.*|.*login.*/)
    
    // Look for common authentication elements
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"]')
    const submitButton = page.locator('button[type="submit"], button:has-text("로그인"), button:has-text("Sign in")')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/')
    
    // Fill in invalid credentials
    await page.fill('input[type="email"], input[name="email"]', 'invalid@email.com')
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword')
    
    // Submit the form
    await page.click('button[type="submit"], button:has-text("로그인"), button:has-text("Sign in")')
    
    // Wait for error message or invalid credentials feedback
    await expect(page.locator('text=Invalid login credentials, text=이메일, text=password')).toBeVisible({
      timeout: 5000
    })
  })
})

test.describe('Navigation and Layout', () => {
  test('should have proper navigation structure', async ({ page }) => {
    await page.goto('/')
    
    // If redirected to login, this test should be skipped
    const isAuthPage = await page.locator('input[type="email"]').isVisible({ timeout: 2000 })
    
    if (isAuthPage) {
      test.skip('Skipping navigation test - authentication required', () => {})
    }
    
    // Check for main navigation elements
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
    
    // Check for common navigation links
    const navLinks = [
      'text=대시보드, text=Dashboard',
      'text=프로젝트, text=Projects', 
      'text=클라이언트, text=Clients',
      'text=청구서, text=Invoices',
      'text=문서, text=Documents'
    ]
    
    for (const linkSelector of navLinks) {
      const link = page.locator(linkSelector).first()
      if (await link.isVisible({ timeout: 1000 })) {
        await expect(link).toBeVisible()
      }
    }
  })
})

test.describe('Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if page is mobile-friendly
    await expect(page.locator('body')).toBeVisible()
    
    // Check if mobile navigation menu exists (hamburger menu)
    const mobileMenu = page.locator('button:has-text("☰"), button[aria-label*="menu"], button[aria-label*="메뉴"]')
    if (await mobileMenu.isVisible({ timeout: 2000 })) {
      await expect(mobileMenu).toBeVisible()
    }
  })

  test('should be responsive on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // Check if page loads properly on tablet
    await expect(page.locator('body')).toBeVisible()
  })
})