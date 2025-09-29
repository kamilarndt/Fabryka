# NextFab Testing Guide

## Overview

NextFab follows a comprehensive Test-Driven Development (TDD) approach with multiple testing layers to ensure code quality and reliability.

## Testing Stack

- **Unit Tests**: Vitest (fast, Vite-native test runner)
- **E2E Tests**: Playwright (cross-browser testing)
- **Coverage**: c8 (V8 coverage reports)
- **Mocking**: Vitest built-in mocking + MSW for API mocking

## Test Structure

```
tests/
├── unit/                    # Unit tests (Vitest)
│   ├── lib/                 # Utility functions
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   └── api/                # API layer tests
├── e2e/                    # End-to-end tests (Playwright)
│   ├── auth/               # Authentication flows
│   ├── projects/           # Project management
│   └── workflows/          # Complete user workflows
├── fixtures/               # Test data
│   ├── projects.ts
│   ├── clients.ts
│   └── materials.ts
└── helpers/                # Test utilities
    └── test-utils.tsx
```

## Running Tests

### All Tests
```bash
# Run all tests with coverage
npm run test:all

# Windows PowerShell
.\scripts\run-tests.ps1
```

### Frontend Tests
```bash
cd frontend

# Unit tests
npm run test:unit          # Run once
npm run test:watch         # Watch mode
npm run test:ui            # Interactive UI

# E2E tests
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # Interactive E2E UI

# Coverage
npm run test:coverage      # Generate coverage report
```

### Backend Tests
```bash
cd backend

# Unit tests
npm run test:unit          # Run once
npm run test:watch         # Watch mode

# Coverage
npm run test:coverage      # Generate coverage report
```

## Test Categories

### 1. Unit Tests
Test individual functions, components, and utilities in isolation.

**Example:**
```typescript
import { describe, it, expect } from 'vitest';

describe('generateElementCode', () => {
  it('should return a string starting with "EL-"', () => {
    const code = generateElementCode();
    expect(code).toMatch(/^EL-/);
    expect(code.length).toBeGreaterThan(3);
  });
});
```

### 2. Component Tests
Test React components with user interactions.

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';

describe('ProjectCard', () => {
  it('should render project name', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId('project-name')).toHaveTextContent('Test Project');
  });
});
```

### 3. API Tests
Test backend API endpoints and database operations.

**Example:**
```typescript
import request from 'supertest';
import app from '../server';

describe('Projects API', () => {
  it('should create new project', async () => {
    const newProject = {
      name: 'Test Project',
      project_number: 'P2025/01/01',
      status: 'draft'
    };

    const response = await request(app)
      .post('/api/projects')
      .send(newProject)
      .expect(201);

    expect(response.body).toMatchObject(newProject);
  });
});
```

### 4. E2E Tests
Test complete user workflows across the application.

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('user can create new project', async ({ page }) => {
  await page.goto('/projects');
  await page.click('[data-testid="create-project-btn"]');
  await page.fill('[data-testid="project-name"]', 'Test Project');
  await page.click('[data-testid="save-btn"]');
  
  await expect(page.locator('[data-testid="project-list"]'))
    .toContainText('Test Project');
});
```

## Test Data & Fixtures

### Using Test Fixtures
```typescript
import { mockProjects, createMockProject } from '../fixtures/projects';

describe('ProjectService', () => {
  it('should fetch projects', () => {
    const projects = mockProjects;
    expect(projects).toHaveLength(3);
  });

  it('should create project with custom data', () => {
    const customProject = createMockProject({
      name: 'Custom Project',
      status: 'active'
    });
    expect(customProject.name).toBe('Custom Project');
  });
});
```

## Coverage Requirements

- **Minimum Coverage**: 80% for all metrics
- **Critical Paths**: 100% coverage (auth, payments, data integrity)
- **New Code**: Must have tests before merging

### Coverage Commands
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

## Mocking Strategy

### API Mocking
```typescript
import { vi } from 'vitest';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockData, error: null }))
        }))
      }))
    }))
  }
}));
```

### Component Mocking
```typescript
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  })
}));
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: |
    npm run test:unit
    npm run test:e2e
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hooks
Tests must pass before code can be committed:
```bash
# Husky pre-commit hook
npm run test:unit
npm run lint
```

## Best Practices

### 1. TDD Workflow
1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### 2. Test Naming
- Use descriptive test names
- Follow pattern: "should [expected behavior] when [condition]"
- Group related tests with `describe` blocks

### 3. Test Organization
- One test file per source file
- Mirror the source directory structure
- Keep tests focused and atomic

### 4. Data Attributes
Use `data-testid` for reliable element selection:
```tsx
<button data-testid="save-project-btn">Save Project</button>
```

### 5. Async Testing
Always wait for async operations:
```typescript
await waitFor(() => {
  expect(screen.getByText('Project saved')).toBeInTheDocument();
});
```

## Debugging Tests

### Vitest Debug
```bash
# Run specific test with debug info
npm run test:watch -- --reporter=verbose

# Debug in VS Code
# Set breakpoint and run "Debug Current Test File"
```

### Playwright Debug
```bash
# Debug E2E tests
npm run test:e2e:ui

# Run with browser visible
npx playwright test --headed

# Debug specific test
npx playwright test projects.spec.ts --debug
```

## Performance Testing

### Load Testing
```typescript
import { test, expect } from '@playwright/test';

test('should handle multiple concurrent users', async ({ browser }) => {
  const contexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
    browser.newContext()
  ]);

  const pages = await Promise.all(
    contexts.map(context => context.newPage())
  );

  await Promise.all(
    pages.map(page => page.goto('/projects'))
  );
});
```

## Test Maintenance

### Regular Tasks
- Update test data when schema changes
- Review and update E2E tests for UI changes
- Monitor coverage reports for regressions
- Update fixtures when adding new features

### Test Review Checklist
- [ ] Tests cover happy path and edge cases
- [ ] Error scenarios are tested
- [ ] Tests are fast and reliable
- [ ] No hardcoded values or magic numbers
- [ ] Proper cleanup after tests
- [ ] Clear and descriptive test names

## Troubleshooting

### Common Issues

**Tests timing out:**
```typescript
// Increase timeout for slow tests
test('slow operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

**Flaky E2E tests:**
```typescript
// Wait for elements to be stable
await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' });
```

**Mock not working:**
```typescript
// Ensure mock is called before import
vi.mock('./module', () => ({
  function: vi.fn()
}));
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
