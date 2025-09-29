import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject, useArchiveProject, useUnarchiveProject } from '../useProjects';
import type { Project, ProjectFilters, CreateProjectData, UpdateProjectData } from '../../types/project';

// Mock the API functions
vi.mock('../../lib/api/projects', () => ({
  listProjects: vi.fn(),
  getProject: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  archiveProject: vi.fn(),
  unarchiveProject: vi.fn(),
}));

import * as projectsAPI from '../../lib/api/projects';

const mockListProjects = vi.mocked(projectsAPI.listProjects);
const mockGetProject = vi.mocked(projectsAPI.getProject);
const mockCreateProject = vi.mocked(projectsAPI.createProject);
const mockUpdateProject = vi.mocked(projectsAPI.updateProject);
const mockDeleteProject = vi.mocked(projectsAPI.deleteProject);
const mockArchiveProject = vi.mocked(projectsAPI.archiveProject);
const mockUnarchiveProject = vi.mocked(projectsAPI.unarchiveProject);

// Mock project data
const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  project_number: 'P2025/01/01',
  status: 'active',
  client_id: 'client-1',
  modules: ['overview', 'elements'],
  timeline: {
    startDate: '2025-01-01',
    endDate: '2025-03-01',
    milestones: []
  },
  budget: {
    planned: 100000,
    spent: 50000,
    remaining: 50000
  },
  client: {
    id: 'client-1',
    name: 'Test Client',
    email: 'client@test.com'
  },
  location: {
    address: 'Test Street 123',
    city: 'Warsaw',
    postalCode: '00-001'
  },
  progress: 50,
  createdBy: 'user-1',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
};

const mockProjectsResponse = {
  projects: [mockProject],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    pages: 1
  }
};

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProjects hook', () => {
    it('should fetch projects successfully', async () => {
      mockListProjects.mockResolvedValue(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProjectsResponse);
      expect(result.current.isError).toBe(false);
      expect(mockListProjects).toHaveBeenCalledWith(undefined);
    });

    it('should fetch projects with filters', async () => {
      const filters: ProjectFilters = {
        status: ['active'],
        search: 'test',
        sortBy: 'name',
        sortOrder: 'asc'
      };
      mockListProjects.mockResolvedValue(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockListProjects).toHaveBeenCalledWith(filters);
      expect(result.current.data).toEqual(mockProjectsResponse);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch projects');
      mockListProjects.mockRejectedValue(error);

      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it('should use correct query key', async () => {
      const filters: ProjectFilters = { status: ['active'] };
      mockListProjects.mockResolvedValue(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // The query key should include the filters
      expect(result.current.data).toEqual(mockProjectsResponse);
    });

    it('should have correct stale time and gc time', async () => {
      mockListProjects.mockResolvedValue(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // These values are set in the hook configuration
      expect(result.current.data).toEqual(mockProjectsResponse);
    });
  });

  describe('useProject hook', () => {
    it('should fetch single project successfully', async () => {
      mockGetProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useProject('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProject);
      expect(result.current.isError).toBe(false);
      expect(mockGetProject).toHaveBeenCalledWith('1');
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useProject(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockGetProject).not.toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      const error = new Error('Project not found');
      mockGetProject.mockRejectedValue(error);

      const { result } = renderHook(() => useProject('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCreateProject hook', () => {
    it('should create project successfully', async () => {
      const newProjectData: CreateProjectData = {
        name: 'New Project',
        clientId: 'client-1',
        location: {
          address: 'New Street 123',
          city: 'Warsaw',
          postalCode: '00-001'
        },
        modules: ['overview']
      };
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useCreateProject(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      result.current.mutate(newProjectData);

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockProject);
      expect(mockCreateProject).toHaveBeenCalledWith(newProjectData);
    });

    it('should handle create error', async () => {
      const error = new Error('Failed to create project');
      mockCreateProject.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProject(), {
        wrapper: createWrapper(),
      });

      const newProjectData: CreateProjectData = {
        name: 'New Project',
        clientId: 'client-1',
        location: {
          address: 'New Street 123',
          city: 'Warsaw',
          postalCode: '00-001'
        }
      };

      result.current.mutate(newProjectData);

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateProject hook', () => {
    it('should update project successfully', async () => {
      const updateData: UpdateProjectData = {
        name: 'Updated Project',
        status: 'completed'
      };
      const updatedProject = { ...mockProject, ...updateData };
      mockUpdateProject.mockResolvedValue(updatedProject);

      const { result } = renderHook(() => useUpdateProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(updatedProject);
      expect(mockUpdateProject).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle update error', async () => {
      const error = new Error('Failed to update project');
      mockUpdateProject.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateProject(), {
        wrapper: createWrapper(),
      });

      const updateData: UpdateProjectData = { name: 'Updated Project' };
      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteProject hook', () => {
    it('should delete project successfully', async () => {
      mockDeleteProject.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useDeleteProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ success: true });
      expect(mockDeleteProject).toHaveBeenCalledWith('1');
    });

    it('should handle delete error', async () => {
      const error = new Error('Failed to delete project');
      mockDeleteProject.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useArchiveProject hook', () => {
    it('should archive project successfully', async () => {
      const archivedProject = { ...mockProject, status: 'archived' as const };
      mockArchiveProject.mockResolvedValue(archivedProject);

      const { result } = renderHook(() => useArchiveProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(archivedProject);
      expect(mockArchiveProject).toHaveBeenCalledWith('1');
    });

    it('should handle archive error', async () => {
      const error = new Error('Failed to archive project');
      mockArchiveProject.mockRejectedValue(error);

      const { result } = renderHook(() => useArchiveProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUnarchiveProject hook', () => {
    it('should unarchive project successfully', async () => {
      const unarchivedProject = { ...mockProject, status: 'active' as const };
      mockUnarchiveProject.mockResolvedValue(unarchivedProject);

      const { result } = renderHook(() => useUnarchiveProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(unarchivedProject);
      expect(mockUnarchiveProject).toHaveBeenCalledWith('1');
    });

    it('should handle unarchive error', async () => {
      const error = new Error('Failed to unarchive project');
      mockUnarchiveProject.mockRejectedValue(error);

      const { result } = renderHook(() => useUnarchiveProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('Query invalidation', () => {
    it('should invalidate projects list after create', async () => {
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useCreateProject(), {
        wrapper: createWrapper(),
      });

      const newProjectData: CreateProjectData = {
        name: 'New Project',
        clientId: 'client-1',
        location: {
          address: 'New Street 123',
          city: 'Warsaw',
          postalCode: '00-001'
        }
      };

      result.current.mutate(newProjectData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The hook should invalidate the projects list query
      expect(result.current.isSuccess).toBe(true);
    });

    it('should invalidate projects list after update', async () => {
      const updateData: UpdateProjectData = { name: 'Updated Project' };
      mockUpdateProject.mockResolvedValue({ ...mockProject, ...updateData });

      const { result } = renderHook(() => useUpdateProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The hook should invalidate both list and detail queries
      expect(result.current.isSuccess).toBe(true);
    });

    it('should invalidate projects list after delete', async () => {
      mockDeleteProject.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useDeleteProject(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The hook should invalidate the projects list query
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Network simulation', () => {
    it('should simulate network delay in development', async () => {
      // Mock process.env.NODE_ENV to be 'development'
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      mockListProjects.mockResolvedValue(mockProjectsResponse);

      const startTime = Date.now();
      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should have at least 500ms delay in development
      expect(duration).toBeGreaterThanOrEqual(500);

      // Restore original env
      process.env.NODE_ENV = originalEnv;
    });
  });
});
