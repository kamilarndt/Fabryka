import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import app from '../../server';
import { supabase } from '../../lib/supabase';
import { clearMockData } from '../../lib/supabase-mock';

describe('Projects API', () => {
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    // Clear all mock data before each test
    clearMockData();
  });

  afterEach(async () => {
    // Cleanup test data
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  describe('GET /api/projects', () => {
    it('should return empty array when no projects exist', async () => {
      const response = await fetch(`${baseUrl}/api/projects`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual([]);
    });

    it('should return projects list', async () => {
      // Create test project
      const testProject = {
        name: 'Test Project',
        project_number: 'P2025/TEST/01',
        status: 'draft',
        client_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      await supabase.from('projects').insert(testProject);

      const response = await fetch(`${baseUrl}/api/projects`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        name: 'Test Project',
        project_number: 'P2025/TEST/01',
        status: 'draft'
      });
    });

    it('should filter projects by status', async () => {
      // Create test projects with different statuses
      const projects = [
        { name: 'Active Project', project_number: 'P2025/ACT/01', status: 'active', client_id: '123e4567-e89b-12d3-a456-426614174000' },
        { name: 'Draft Project', project_number: 'P2025/DRF/01', status: 'draft', client_id: '123e4567-e89b-12d3-a456-426614174000' }
      ];

      await supabase.from('projects').insert(projects);

      const response = await fetch(`${baseUrl}/api/projects?status=active`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe('active');
    });
  });

  describe('POST /api/projects', () => {
    it('should create new project', async () => {
      const newProject = {
        name: 'New Test Project',
        project_number: 'P2025/NEW/01',
        status: 'draft',
        client_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      const response = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      
      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data).toMatchObject({
        name: 'New Test Project',
        project_number: 'P2025/NEW/01',
        status: 'draft'
      });
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('created_at');
    });

    it('should validate required fields', async () => {
      const invalidProject = {
        name: '', // Empty name should fail
        project_number: 'P2025/INV/01'
      };

      const response = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidProject),
      });
      
      expect(response.status).toBe(400);
    });

    it('should validate project number uniqueness', async () => {
      const project = {
        name: 'Test Project',
        project_number: 'P2025/DUP/01',
        status: 'draft',
        client_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      // Create first project
      const response1 = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      expect(response1.status).toBe(201);

      // Try to create duplicate
      const response2 = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      expect(response2.status).toBe(409);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update existing project', async () => {
      // Create test project
      const { data: project } = await supabase
        .from('projects')
        .insert({
          name: 'Original Name',
          project_number: 'P2025/UPD/01',
          status: 'draft',
          client_id: '123e4567-e89b-12d3-a456-426614174000'
        })
        .select()
        .single();

      const updateData = {
        name: 'Updated Name',
        status: 'active'
      };

      const response = await fetch(`${baseUrl}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.name).toBe('Updated Name');
      expect(data.status).toBe('active');
      expect(data.updated_at).not.toBe(project.updated_at);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await fetch(`${baseUrl}/api/projects/${fakeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete existing project', async () => {
      // Create test project
      const { data: project } = await supabase
        .from('projects')
        .insert({
          name: 'To Delete',
          project_number: 'P2025/DEL/01',
          status: 'draft',
          client_id: '123e4567-e89b-12d3-a456-426614174000'
        })
        .select()
        .single();

      const response = await fetch(`${baseUrl}/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(204);

      // Verify deletion
      const { data: deletedProject } = await supabase
        .from('projects')
        .select()
        .eq('id', project.id)
        .single();

      expect(deletedProject).toBeNull();
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await fetch(`${baseUrl}/api/projects/${fakeId}`, {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(404);
    });
  });
});