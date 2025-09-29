import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects');
  });

  test('should display projects page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Projekty' })).toBeVisible();
    await expect(page.getByText('Zarządzaj projektami produkcyjnymi')).toBeVisible();
  });

  test('should show "Nowy Projekt" button', async ({ page }) => {
    const newProjectButton = page.getByRole('link', { name: 'Nowy Projekt' });
    await expect(newProjectButton).toBeVisible();
    await expect(newProjectButton).toHaveAttribute('href', '/projects/new');
  });

  test('should display tabs for current and archived projects', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Aktualne/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Archiwalne/ })).toBeVisible();
  });

  test('should show project count badges in tabs', async ({ page }) => {
    const currentTab = page.getByRole('tab', { name: /Aktualne/ });
    const archivedTab = page.getByRole('tab', { name: /Archiwalne/ });
    
    await expect(currentTab.locator('[data-testid="badge"]')).toBeVisible();
    await expect(archivedTab.locator('[data-testid="badge"]')).toBeVisible();
  });

  test('should display search input', async ({ page }) => {
    await expect(page.getByPlaceholder('Szukaj projektów...')).toBeVisible();
  });

  test('should display status filter', async ({ page }) => {
    await expect(page.getByText('Status')).toBeVisible();
  });

  test('should display sort controls', async ({ page }) => {
    await expect(page.getByText('Sortuj')).toBeVisible();
    await expect(page.getByText('Kolejność')).toBeVisible();
  });

  test('should show "Więcej filtrów" button', async ({ page }) => {
    await expect(page.getByText('Więcej filtrów')).toBeVisible();
  });

  test('should expand advanced filters when clicked', async ({ page }) => {
    const moreFiltersButton = page.getByText('Więcej filtrów');
    await moreFiltersButton.click();
    
    await expect(page.getByText('Zaawansowane filtry:')).toBeVisible();
    await expect(page.getByText('Klient:')).toBeVisible();
    await expect(page.getByText('Moduły:')).toBeVisible();
    await expect(page.getByText('Miasto:')).toBeVisible();
    await expect(page.getByText('Zakres dat:')).toBeVisible();
    await expect(page.getByText('Promień wyszukiwania (km):')).toBeVisible();
  });

  test('should show view mode controls', async ({ page }) => {
    await expect(page.getByText('Siatka')).toBeVisible();
    await expect(page.getByText('Lista')).toBeVisible();
  });

  test('should show refresh button', async ({ page }) => {
    await expect(page.getByText('Odśwież')).toBeVisible();
  });
});

test.describe('Project Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should filter projects by search term', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Szukaj projektów...');
    await searchInput.fill('test project');
    
    // Wait for search to be processed
    await page.waitForTimeout(500);
    
    // Verify search input has the value
    await expect(searchInput).toHaveValue('test project');
  });

  test('should filter projects by status', async ({ page }) => {
    const statusSelect = page.getByText('Status');
    await statusSelect.click();
    
    await page.getByText('Aktywny').click();
    
    // Verify status filter is applied
    await expect(page.getByText('Status: Aktywny')).toBeVisible();
  });

  test('should filter projects by multiple statuses', async ({ page }) => {
    const statusSelect = page.getByText('Status');
    await statusSelect.click();
    
    await page.getByText('Aktywny').click();
    await page.getByText('Zakończony').click();
    
    // Verify multiple status filters are applied
    await expect(page.getByText('Status: Aktywny, Zakończony')).toBeVisible();
  });

  test('should sort projects by different criteria', async ({ page }) => {
    const sortSelect = page.getByText('Sortuj');
    await sortSelect.click();
    
    await page.getByText('Nazwa projektu').click();
    
    // Verify sort is applied
    await expect(page.getByText('Nazwa projektu')).toBeVisible();
  });

  test('should change sort order', async ({ page }) => {
    const sortOrderSelect = page.getByText('Kolejność');
    await sortOrderSelect.click();
    
    await page.getByText('Rosnąco').click();
    
    // Verify sort order is applied
    await expect(page.getByText('Rosnąco')).toBeVisible();
  });

  test('should clear all filters', async ({ page }) => {
    // Apply some filters first
    const searchInput = page.getByPlaceholder('Szukaj projektów...');
    await searchInput.fill('test');
    
    const statusSelect = page.getByText('Status');
    await statusSelect.click();
    await page.getByText('Aktywny').click();
    
    // Clear filters
    const clearButton = page.getByText('Wyczyść wszystko');
    await clearButton.click();
    
    // Verify filters are cleared
    await expect(searchInput).toHaveValue('');
    await expect(page.queryByText('Status: Aktywny')).not.toBeVisible();
  });

  test('should remove individual filter tags', async ({ page }) => {
    // Apply a filter
    const searchInput = page.getByPlaceholder('Szukaj projektów...');
    await searchInput.fill('test');
    
    // Remove the filter tag
    const filterTag = page.getByText('Szukaj: test');
    const closeButton = filterTag.locator('button').first();
    await closeButton.click();
    
    // Verify filter is removed
    await expect(searchInput).toHaveValue('');
  });
});

test.describe('Project View Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should switch between grid and list view', async ({ page }) => {
    const gridButton = page.getByText('Siatka');
    const listButton = page.getByText('Lista');
    
    // Default should be grid view
    await expect(gridButton).toHaveAttribute('data-active', 'true');
    
    // Switch to list view
    await listButton.click();
    await expect(listButton).toHaveAttribute('data-active', 'true');
    
    // Switch back to grid view
    await gridButton.click();
    await expect(gridButton).toHaveAttribute('data-active', 'true');
  });
});

test.describe('Project Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should display project information in cards', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    
    // Check if project card contains basic information
    await expect(projectCard.locator('[data-testid="project-name"]')).toBeVisible();
    await expect(projectCard.locator('[data-testid="project-client"]')).toBeVisible();
    await expect(projectCard.locator('[data-testid="project-status"]')).toBeVisible();
    await expect(projectCard.locator('[data-testid="project-progress"]')).toBeVisible();
  });

  test('should show project actions', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    
    // Check for action buttons
    await expect(projectCard.getByText('Zobacz')).toBeVisible();
    await expect(projectCard.getByText('Edytuj')).toBeVisible();
    
    // Check for more actions menu
    const moreButton = projectCard.getByLabel('Więcej opcji');
    await expect(moreButton).toBeVisible();
  });

  test('should open project actions menu', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const moreButton = projectCard.getByLabel('Więcej opcji');
    
    await moreButton.click();
    
    // Check for menu items
    await expect(page.getByText('Zobacz szczegóły')).toBeVisible();
    await expect(page.getByText('Edytuj')).toBeVisible();
    await expect(page.getByText('Archiwizuj')).toBeVisible();
    await expect(page.getByText('Usuń')).toBeVisible();
  });

  test('should show different actions for archived projects', async ({ page }) => {
    // Switch to archived tab
    await page.getByRole('tab', { name: /Archiwalne/ }).click();
    
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const moreButton = projectCard.getByLabel('Więcej opcji');
    
    await moreButton.click();
    
    // Check for unarchive option instead of archive
    await expect(page.getByText('Przywróć')).toBeVisible();
  });
});

test.describe('Project Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should navigate to project details when view button is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const viewButton = projectCard.getByText('Zobacz');
    
    await viewButton.click();
    
    // Should navigate to project details page
    await expect(page).toHaveURL(/\/projekt\/\d+/);
  });

  test('should navigate to project edit when edit button is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const editButton = projectCard.getByText('Edytuj');
    
    await editButton.click();
    
    // Should navigate to project edit page
    await expect(page).toHaveURL(/\/projekt\/\d+\/edit/);
  });

  test('should show confirmation dialog when delete is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const moreButton = projectCard.getByLabel('Więcej opcji');
    
    await moreButton.click();
    await page.getByText('Usuń').click();
    
    // Should show confirmation dialog
    await expect(page.getByText(/Czy na pewno chcesz usunąć projekt/)).toBeVisible();
  });

  test('should archive project when archive is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const moreButton = projectCard.getByLabel('Więcej opcji');
    
    await moreButton.click();
    await page.getByText('Archiwizuj').click();
    
    // Project should be moved to archived tab
    await page.getByRole('tab', { name: /Archiwalne/ }).click();
    await expect(page.locator('[data-testid="project-card"]')).toBeVisible();
  });
});

test.describe('Loading and Error States', () => {
  test('should show loading state initially', async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects');
    
    // Should show loading spinner
    await expect(page.getByText('Ładowanie projektów...')).toBeVisible();
  });

  test('should show error state when projects fail to load', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/projects*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });
    
    await page.goto('/projects');
    
    // Should show error message
    await expect(page.getByText('Błąd ładowania projektów')).toBeVisible();
    await expect(page.getByText('Internal Server Error')).toBeVisible();
    await expect(page.getByText('Spróbuj ponownie')).toBeVisible();
  });

  test('should retry loading when retry button is clicked', async ({ page }) => {
    // Mock API to return error first, then success
    let callCount = 0;
    await page.route('**/api/projects*', route => {
      callCount++;
      if (callCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' })
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            projects: [],
            pagination: { page: 1, limit: 10, total: 0, pages: 0 }
          })
        });
      }
    });
    
    await page.goto('/projects');
    
    // Click retry button
    await page.getByText('Spróbuj ponownie').click();
    
    // Should show empty state
    await expect(page.getByText('Brak projektów')).toBeVisible();
  });
});

test.describe('Empty States', () => {
  test('should show empty state when no projects exist', async ({ page }) => {
    // Mock API to return empty projects
    await page.route('**/api/projects*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        })
      });
    });
    
    await page.goto('/projects');
    
    // Should show empty state
    await expect(page.getByText('Brak projektów')).toBeVisible();
    await expect(page.getByText('Nie masz jeszcze żadnych projektów. Utwórz pierwszy projekt, aby rozpocząć pracę.')).toBeVisible();
    await expect(page.getByText('Odśwież')).toBeVisible();
  });

  test('should show filtered empty state when no projects match filters', async ({ page }) => {
    // Mock API to return empty projects
    await page.route('**/api/projects*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        })
      });
    });
    
    await page.goto('/projects');
    
    // Apply a filter
    const searchInput = page.getByPlaceholder('Szukaj projektów...');
    await searchInput.fill('nonexistent');
    
    // Should show filtered empty state
    await expect(page.getByText('Nie znaleziono projektów spełniających kryteria wyszukiwania.')).toBeVisible();
  });
});

test.describe('Pagination', () => {
  test('should show pagination controls when multiple pages exist', async ({ page }) => {
    // Mock API to return paginated data
    await page.route('**/api/projects*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [
            {
              id: '1',
              name: 'Project 1',
              project_number: 'P2025/01/01',
              status: 'active',
              client_id: 'client-1',
              modules: ['overview'],
              timeline: { startDate: '2025-01-01', endDate: '2025-03-01', milestones: [] },
              budget: { planned: 100000, spent: 50000, remaining: 50000 },
              client: { id: 'client-1', name: 'Client 1', email: 'client@test.com' },
              location: { address: 'Street 1', city: 'Warsaw', postalCode: '00-001' },
              progress: 50,
              createdBy: 'user-1',
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z'
            }
          ],
          pagination: { page: 1, limit: 10, total: 25, pages: 3 }
        })
      });
    });
    
    await page.goto('/projects');
    
    // Should show pagination info
    await expect(page.getByText('25 projektów')).toBeVisible();
    await expect(page.getByText('Strona 1 z 3')).toBeVisible();
    
    // Should show pagination controls
    await expect(page.getByText('Poprzednia')).toBeVisible();
    await expect(page.getByText('Następna')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    // Mock API to return paginated data
    let pageNumber = 1;
    await page.route('**/api/projects*', route => {
      const url = new URL(route.request().url());
      const requestedPage = parseInt(url.searchParams.get('page') || '1');
      pageNumber = requestedPage;
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [
            {
              id: pageNumber.toString(),
              name: `Project ${pageNumber}`,
              project_number: `P2025/01/0${pageNumber}`,
              status: 'active',
              client_id: 'client-1',
              modules: ['overview'],
              timeline: { startDate: '2025-01-01', endDate: '2025-03-01', milestones: [] },
              budget: { planned: 100000, spent: 50000, remaining: 50000 },
              client: { id: 'client-1', name: 'Client 1', email: 'client@test.com' },
              location: { address: 'Street 1', city: 'Warsaw', postalCode: '00-001' },
              progress: 50,
              createdBy: 'user-1',
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z'
            }
          ],
          pagination: { page: pageNumber, limit: 10, total: 25, pages: 3 }
        })
      });
    });
    
    await page.goto('/projects');
    
    // Click next page
    await page.getByText('Następna').click();
    
    // Should show page 2
    await expect(page.getByText('Strona 2 z 3')).toBeVisible();
  });
});