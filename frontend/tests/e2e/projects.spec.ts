import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should display projects page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Projekty');
    await expect(page.locator('[data-testid="create-project-btn"]')).toBeVisible();
  });

  test('user can create new project', async ({ page }) => {
    // Navigate to create project page
    await page.click('[data-testid="create-project-btn"]');
    await expect(page).toHaveURL('/projects/new');

    // Fill project form
    await page.fill('[data-testid="project-name"]', 'Test Project E2E');
    await page.fill('[data-testid="project-number"]', 'P2025/E2E/01');
    
    // Select client (assuming dropdown)
    await page.click('[data-testid="client-select"]');
    await page.click('[data-testid="client-option-1"]');
    
    // Save project
    await page.click('[data-testid="save-btn"]');
    
    // Verify redirect to projects list
    await expect(page).toHaveURL('/projects');
    
    // Verify project appears in list
    await expect(page.locator('[data-testid="project-list"]'))
      .toContainText('Test Project E2E');
  });

  test('should display project details', async ({ page }) => {
    // Assuming there's a project in the list
    await page.click('[data-testid="project-item-1"]');
    
    await expect(page.locator('[data-testid="project-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="project-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="project-status"]')).toBeVisible();
  });

  test('should filter projects by status', async ({ page }) => {
    // Test status filter
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-testid="status-active"]');
    
    // Verify only active projects are shown
    const projectItems = page.locator('[data-testid^="project-item"]');
    const count = await projectItems.count();
    
    for (let i = 0; i < count; i++) {
      await expect(projectItems.nth(i)).toContainText('active');
    }
  });

  test('should search projects', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Test');
    
    // Verify search results
    await expect(page.locator('[data-testid="project-list"]'))
      .toContainText('Test');
  });
});
