import { beforeAll, afterAll, beforeEach } from 'vitest';

// Global test setup
beforeAll(() => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.JWT_SECRET = 'test-secret-key';
  
  // Supabase test configuration
  process.env.SUPABASE_URL = 'https://iwzsvxmttyanzsijlywm.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3enN2eG10dHlhbnpzaWpseXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTM3NTMsImV4cCI6MjA3NDcyOTc1M30.hc0PjJkDIxg7za1nA8Ohc7qnvPoOkxnRuvZm4tkZ5w0';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3enN2eG10dHlhbnpzaWpseXdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1Mzc1MywiZXhwIjoyMDc0NzI5NzUzfQ.CjjNoYl7HxY9FBulvXF1fdXCyyDuJ-P_de4ALzkoSYk';
  
  // Use different port for tests to avoid conflicts
  process.env.PORT = '5001';
});

afterAll(() => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
});
