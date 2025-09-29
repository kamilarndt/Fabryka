import { test, expect } from '@playwright/test';

test.describe('Project Workflow', () => {
  test('complete project creation workflow', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-btn"]');

    // Create new project
    await page.goto('/projects');
    await page.click('[data-testid="create-project-btn"]');
    
    await page.fill('[data-testid="project-name"]', 'Complete Workflow Project');
    await page.fill('[data-testid="project-number"]', 'P2025/WF/01');
    await page.click('[data-testid="client-select"]');
    await page.click('[data-testid="client-option-1"]');
    await page.click('[data-testid="save-btn"]');

    // Verify project created
    await expect(page.locator('[data-testid="project-list"]'))
      .toContainText('Complete Workflow Project');

    // Navigate to project details
    await page.click('[data-testid="project-item-latest"]');
    
    // Add elements to project
    await page.click('[data-testid="elements-tab"]');
    await page.click('[data-testid="add-element-btn"]');
    
    await page.fill('[data-testid="element-name"]', 'Test Element 1');
    await page.fill('[data-testid="element-quantity"]', '5');
    await page.click('[data-testid="save-element-btn"]');

    // Verify element added
    await expect(page.locator('[data-testid="elements-list"]'))
      .toContainText('Test Element 1');

    // Generate quotation
    await page.click('[data-testid="quotation-tab"]');
    await page.click('[data-testid="generate-quotation-btn"]');
    
    // Verify quotation generated
    await expect(page.locator('[data-testid="quotation-content"]'))
      .toBeVisible();
  });

  test('materials management workflow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-btn"]');

    // Navigate to materials
    await page.goto('/materials');
    
    // Add new material
    await page.click('[data-testid="add-material-btn"]');
    
    await page.fill('[data-testid="material-name"]', 'Test Material');
    await page.fill('[data-testid="material-sku"]', 'TM001');
    await page.selectOption('[data-testid="material-unit"]', 'szt');
    await page.fill('[data-testid="material-price"]', '25.50');
    await page.click('[data-testid="save-material-btn"]');

    // Verify material added
    await expect(page.locator('[data-testid="materials-list"]'))
      .toContainText('Test Material');

    // Update stock
    await page.click('[data-testid="material-item-TM001"]');
    await page.fill('[data-testid="stock-quantity"]', '100');
    await page.click('[data-testid="update-stock-btn"]');

    // Verify stock updated
    await expect(page.locator('[data-testid="current-stock"]'))
      .toContainText('100');
  });
});
