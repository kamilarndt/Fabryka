import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../server';
import { supabase } from '../../lib/supabase';
import { clearMockData } from '../../lib/supabase-mock';

describe('Projects API', () => {
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
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toEqual([]);
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

      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
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

      const response = await request(app)
        .get('/api/projects?status=active')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('active');
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

      const response = await request(app)
        .post('/api/projects')
        .send(newProject)
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'New Test Project',
        project_number: 'P2025/NEW/01',
        status: 'draft'
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('created_at');
    });

    it('should validate required fields', async () => {
      const invalidProject = {
        name: '', // Empty name should fail
        project_number: 'P2025/INV/01'
      };

      await request(app)
        .post('/api/projects')
        .send(invalidProject)
        .expect(400);
    });

    it('should validate project number uniqueness', async () => {
      const project = {
        name: 'Test Project',
        project_number: 'P2025/DUP/01',
        status: 'draft',
        client_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      // Create first project
      await request(app)
        .post('/api/projects')
        .send(project)
        .expect(201);

      // Try to create duplicate
      await request(app)
        .post('/api/projects')
        .send(project)
        .expect(409);
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

      const response = await request(app)
        .put(`/api/projects/${project.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.status).toBe('active');
      expect(response.body.updated_at).not.toBe(project.updated_at);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app)
        .put(`/api/projects/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(404);
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

      await request(app)
        .delete(`/api/projects/${project.id}`)
        .expect(204);

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
      
      await request(app)
        .delete(`/api/projects/${fakeId}`)
        .expect(404);
    });
  });
});
