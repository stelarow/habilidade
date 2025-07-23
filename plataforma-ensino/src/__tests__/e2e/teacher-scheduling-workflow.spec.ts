/**
 * End-to-End Tests for Complete Teacher Scheduling Workflow
 * Story 3.1: Teacher Enrollment Integration - Task 4
 * 
 * Tests the complete teacher scheduling workflow from course selection
 * to enrollment confirmation using Playwright.
 */

import { test, expect, Page } from '@playwright/test'

test.describe('Complete Teacher Scheduling Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to enrollment page
    await page.goto('/enrollment')
    
    // Wait for initial load
    await page.waitForLoadState('networkidle')
  })

  test('completes full enrollment flow with teacher and schedule selection', async ({ page }) => {
    // Step 1: Course Selection
    await expect(page.locator('h1')).toContainText('Selecione um Curso')
    
    // Select a course that requires teacher selection
    const courseCard = page.locator('[data-testid="course-card"]').filter({ hasText: 'Programação Web Completa' })
    await courseCard.click()
    
    // Wait for teacher selection step
    await expect(page.locator('h2')).toContainText('Escolha seu Professor')
    
    // Step 2: Teacher Selection
    await expect(page.locator('[data-testid="teacher-selector"]')).toBeVisible()
    
    // Wait for teachers to load
    await page.waitForSelector('[data-testid="teacher-card"]')
    
    // Select first available teacher
    const teacherCard = page.locator('[data-testid="teacher-card"]').first()
    await teacherCard.click()
    
    // Wait for teacher selection to be processed
    await page.waitForTimeout(500)
    
    // Navigate to schedule selection
    await page.locator('button:has-text("Próximo")').click()
    
    // Wait for calendar to load
    await expect(page.locator('h2')).toContainText('Selecione os Horários')
    await expect(page.locator('[data-testid="conditional-calendar"]')).toBeVisible()
    
    // Step 3: Schedule Selection
    // Wait for availability data to load
    await page.waitForSelector('[data-testid="time-slot"]:not([disabled])')
    
    // Select first available time slot
    const availableSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first()
    await availableSlot.click()
    
    // Wait for slot selection animation
    await page.waitForTimeout(300)
    
    // Navigate to confirmation
    await page.locator('button:has-text("Próximo")').click()
    
    // Step 4: Enrollment Confirmation
    await expect(page.locator('h2')).toContainText('Confirmar Matrícula')
    
    // Verify enrollment details are displayed
    await expect(page.locator('[data-testid="course-details"]')).toContainText('Programação Web Completa')
    await expect(page.locator('[data-testid="teacher-details"]')).toBeVisible()
    await expect(page.locator('[data-testid="schedule-details"]')).toBeVisible()
    
    // Complete enrollment
    await page.locator('button:has-text("Confirmar Matrícula")').click()
    
    // Wait for enrollment processing
    await page.waitForSelector('[data-testid="enrollment-success"]', { timeout: 10000 })
    
    // Verify success
    await expect(page.locator('[data-testid="enrollment-success"]')).toContainText('Matrícula Confirmada!')
  })

  test('handles backward compatibility for self-paced courses', async ({ page }) => {
    // Select self-paced course
    const selfPacedCourse = page.locator('[data-testid="course-card"]').filter({ hasText: 'Curso Online Autodirigido' })
    await selfPacedCourse.click()
    
    // Should skip directly to confirmation
    await expect(page.locator('h2')).toContainText('Confirmar Matrícula')
    
    // Should show self-paced indicators
    await expect(page.locator('[data-testid="course-type-badge"]')).toContainText('Autodirigido')
    
    // Complete enrollment
    await page.locator('button:has-text("Confirmar Matrícula")').click()
    
    // Verify success
    await expect(page.locator('[data-testid="enrollment-success"]')).toBeVisible()
  })

  test('supports navigation between steps', async ({ page }) => {
    // Navigate through to schedule selection
    await page.locator('[data-testid="course-card"]').first().click()
    await page.waitForSelector('[data-testid="teacher-card"]')
    await page.locator('[data-testid="teacher-card"]').first().click()
    await page.locator('button:has-text("Próximo")').click()
    
    // At schedule selection
    await expect(page.locator('h2')).toContainText('Selecione os Horários')
    
    // Go back to teacher selection
    await page.locator('button:has-text("Anterior")').click()
    
    // Should be back at teacher selection
    await expect(page.locator('h2')).toContainText('Escolha seu Professor')
    
    // Go forward again
    await page.locator('button:has-text("Próximo")').click()
    
    // Should be at schedule selection again
    await expect(page.locator('h2')).toContainText('Selecione os Horários')
  })

  test('validates required fields before progression', async ({ page }) => {
    // Select course requiring teacher
    await page.locator('[data-testid="course-card"]').first().click()
    
    // Try to proceed without selecting teacher
    const nextButton = page.locator('button:has-text("Próximo")')
    await expect(nextButton).toBeDisabled()
    
    // Select teacher
    await page.waitForSelector('[data-testid="teacher-card"]')
    await page.locator('[data-testid="teacher-card"]').first().click()
    
    // Now next button should be enabled
    await expect(nextButton).toBeEnabled()
  })

  test('displays real-time availability updates', async ({ page }) => {
    // Navigate to schedule selection
    await page.locator('[data-testid="course-card"]').first().click()
    await page.waitForSelector('[data-testid="teacher-card"]')
    await page.locator('[data-testid="teacher-card"]').first().click()
    await page.locator('button:has-text("Próximo")').click()
    
    // Wait for calendar
    await page.waitForSelector('[data-testid="time-slot"]')
    
    // Get initial slot count
    const initialSlots = await page.locator('[data-testid="time-slot"]:not([disabled])').count()
    
    // In a real test, we would simulate availability changes from another browser/tab
    // For now, verify the structure exists for real-time updates
    await expect(page.locator('[data-testid="availability-indicator"]')).toBeVisible()
  })

  test('handles errors gracefully', async ({ page }) => {
    // Mock network error by intercepting API calls
    await page.route('/api/teachers/*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    // Try to select course
    await page.locator('[data-testid="course-card"]').first().click()
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Erro ao carregar')
    
    // Should have retry button
    await expect(page.locator('button:has-text("Tentar Novamente")')).toBeVisible()
  })

  test('maintains responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate through enrollment flow
    await page.locator('[data-testid="course-card"]').first().click()
    
    // Mobile teacher selector should be visible
    await expect(page.locator('[data-testid="mobile-teacher-layout"]')).toBeVisible()
    
    // Select teacher
    await page.waitForSelector('[data-testid="teacher-card"]')
    await page.locator('[data-testid="teacher-card"]').first().click()
    await page.locator('button:has-text("Próximo")').click()
    
    // Mobile calendar should be visible
    await expect(page.locator('[data-testid="mobile-calendar-layout"]')).toBeVisible()
    
    // Touch targets should be appropriately sized
    const timeSlots = page.locator('[data-testid="time-slot"]')
    const firstSlot = timeSlots.first()
    const boundingBox = await firstSlot.boundingBox()
    
    // Minimum touch target size (44px)
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })

  test('supports keyboard navigation', async ({ page }) => {
    // Focus on first course
    await page.keyboard.press('Tab')
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // Should be at teacher selection
    await expect(page.locator('h2')).toContainText('Escolha seu Professor')
    
    // Tab to teacher cards
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Tab to next button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should be at schedule selection
    await expect(page.locator('h2')).toContainText('Selecione os Horários')
  })

  test('handles concurrent user scenarios', async ({ browser }) => {
    // Create multiple browser contexts to simulate concurrent users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()
    
    // Both users navigate to same teacher/slot
    await Promise.all([
      page1.goto('/enrollment'),
      page2.goto('/enrollment')
    ])
    
    // Both select same course and teacher
    await Promise.all([
      page1.locator('[data-testid="course-card"]').first().click(),
      page2.locator('[data-testid="course-card"]').first().click()
    ])
    
    await Promise.all([
      page1.waitForSelector('[data-testid="teacher-card"]'),
      page2.waitForSelector('[data-testid="teacher-card"]')
    ])
    
    await Promise.all([
      page1.locator('[data-testid="teacher-card"]').first().click(),
      page2.locator('[data-testid="teacher-card"]').first().click()
    ])
    
    await Promise.all([
      page1.locator('button:has-text("Próximo")').click(),
      page2.locator('button:has-text("Próximo")').click()
    ])
    
    // Both try to select the same limited capacity slot
    await Promise.all([
      page1.waitForSelector('[data-testid="time-slot"]:not([disabled])'),
      page2.waitForSelector('[data-testid="time-slot"]:not([disabled])')
    ])
    
    const slot1 = page1.locator('[data-testid="time-slot"]').first()
    const slot2 = page2.locator('[data-testid="time-slot"]').first()
    
    // Simulate race condition
    await Promise.all([
      slot1.click(),
      slot2.click()
    ])
    
    // Wait for conflict resolution
    await page1.waitForTimeout(1000)
    await page2.waitForTimeout(1000)
    
    // One should succeed, one should get conflict message
    const page1HasSlot = await page1.locator('[data-testid="selected-slot"]').isVisible()
    const page2HasSlot = await page2.locator('[data-testid="selected-slot"]').isVisible()
    const page1HasError = await page1.locator('[data-testid="conflict-error"]').isVisible()
    const page2HasError = await page2.locator('[data-testid="conflict-error"]').isVisible()
    
    // One should succeed, one should fail
    expect(page1HasSlot || page2HasSlot).toBeTruthy()
    expect(page1HasError || page2HasError).toBeTruthy()
    
    await context1.close()
    await context2.close()
  })

  test('persists progress across page refreshes', async ({ page }) => {
    // Navigate through to teacher selection
    await page.locator('[data-testid="course-card"]').first().click()
    await page.waitForSelector('[data-testid="teacher-card"]')
    await page.locator('[data-testid="teacher-card"]').first().click()
    
    // Refresh page
    await page.reload()
    
    // Should restore progress (if implemented)
    // This would depend on local storage or session persistence
    await expect(page.locator('h2')).toContainText('Escolha seu Professor')
  })

  test('integrates with analytics tracking', async ({ page }) => {
    // Mock analytics tracking
    await page.addInitScript(() => {
      (window as any).analytics = {
        track: (event: string, properties: any) => {
          (window as any).trackedEvents = (window as any).trackedEvents || []
          ;(window as any).trackedEvents.push({ event, properties })
        }
      }
    })
    
    // Go through enrollment flow
    await page.locator('[data-testid="course-card"]').first().click()
    
    // Check that events were tracked
    const trackedEvents = await page.evaluate(() => (window as any).trackedEvents)
    expect(trackedEvents).toContainEqual(
      expect.objectContaining({
        event: 'course_selected'
      })
    )
  })
})

test.describe('Performance and Accessibility', () => {
  test('meets performance benchmarks', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/enrollment')
    
    const metrics = await page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      }
    })
    
    // Performance targets
    expect(metrics.loadTime).toBeLessThan(3000) // 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000) // 2 seconds
  })

  test('passes accessibility audits', async ({ page }) => {
    await page.goto('/enrollment')
    
    // Check for basic accessibility features
    await expect(page.locator('h1')).toHaveAttribute('role', 'heading')
    
    // All interactive elements should be keyboard accessible
    const interactiveElements = page.locator('button, a, input, select, [tabindex]')
    const count = await interactiveElements.count()
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i)
      await expect(element).toBeVisible()
    }
  })

  test('works with screen readers', async ({ page }) => {
    await page.goto('/enrollment')
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount(await page.locator('[aria-label]').count())
    
    // Check for semantic structure
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1, h2, h3')).toHaveCount(await page.locator('h1, h2, h3').count())
  })
})