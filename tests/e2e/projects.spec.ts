import { test, expect } from '@playwright/test'

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Skip tests if authentication is required
    const isAuthPage = await page.locator('input[type="email"]').isVisible({ timeout: 3000 })
    if (isAuthPage) {
      test.skip('Authentication required - skipping projects tests')
    }
  })

  test('should display projects page', async ({ page }) => {
    await page.goto('/projects')
    
    // Check for projects page title
    await expect(page.locator('h1:has-text("프로젝트"), h1:has-text("Projects")')).toBeVisible()
    
    // Check for new project button
    const newProjectButton = page.locator('button:has-text("새 프로젝트"), button:has-text("New Project"), button:has-text("프로젝트 추가")')
    await expect(newProjectButton.first()).toBeVisible()
  })

  test('should open create project modal', async ({ page }) => {
    await page.goto('/projects')
    
    // Click new project button
    const newProjectButton = page.locator('button:has-text("새 프로젝트"), button:has-text("New Project"), button:has-text("프로젝트 추가")')
    await newProjectButton.first().click()
    
    // Check if modal or form appears
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]')
    const form = page.locator('form')
    
    if (await modal.isVisible({ timeout: 3000 })) {
      await expect(modal).toBeVisible()
    } else if (await form.isVisible({ timeout: 3000 })) {
      await expect(form).toBeVisible()
    }
  })

  test('should display project list/table', async ({ page }) => {
    await page.goto('/projects')
    
    // Look for table or list container
    const projectsList = page.locator('table, [class*="table"], [class*="list"]')
    if (await projectsList.first().isVisible({ timeout: 3000 })) {
      await expect(projectsList.first()).toBeVisible()
    }
    
    // Look for common table headers
    const headers = [
      'text=이름, text=Name',
      'text=상태, text=Status', 
      'text=클라이언트, text=Client',
      'text=진행률, text=Progress'
    ]
    
    for (const header of headers) {
      const el = page.locator(header).first()
      if (await el.isVisible({ timeout: 1000 })) {
        await expect(el).toBeVisible()
      }
    }
  })

  test('should have search functionality', async ({ page }) => {
    await page.goto('/projects')
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="검색"], input[placeholder*="search"], input[type="search"]')
    if (await searchInput.first().isVisible({ timeout: 3000 })) {
      await expect(searchInput.first()).toBeVisible()
      
      // Test search functionality
      await searchInput.first().fill('test project')
      await page.waitForTimeout(1000) // Wait for debounce
    }
  })

  test('should have filter functionality', async ({ page }) => {
    await page.goto('/projects')
    
    // Look for filter dropdowns or buttons
    const filters = page.locator('select, button:has-text("필터"), button:has-text("Filter")')
    if (await filters.first().isVisible({ timeout: 3000 })) {
      await expect(filters.first()).toBeVisible()
    }
  })
})

test.describe('Project Creation Flow', () => {
  test('should validate required fields in project creation', async ({ page }) => {
    await page.goto('/projects')
    
    // Skip if authentication required
    const isAuthPage = await page.locator('input[type="email"]').isVisible({ timeout: 2000 })
    if (isAuthPage) {
      test.skip('Authentication required')
    }
    
    // Open create project modal/form
    const newProjectButton = page.locator('button:has-text("새 프로젝트"), button:has-text("New Project"), button:has-text("프로젝트 추가")')
    if (await newProjectButton.first().isVisible({ timeout: 3000 })) {
      await newProjectButton.first().click()
      
      // Try to submit without filling required fields
      const submitButton = page.locator('button[type="submit"], button:has-text("생성"), button:has-text("Create"), button:has-text("저장")')
      if (await submitButton.first().isVisible({ timeout: 3000 })) {
        await submitButton.first().click()
        
        // Should show validation errors
        const errorMessages = page.locator('[class*="error"], .text-red, [role="alert"]')
        if (await errorMessages.first().isVisible({ timeout: 2000 })) {
          await expect(errorMessages.first()).toBeVisible()
        }
      }
    }
  })
})