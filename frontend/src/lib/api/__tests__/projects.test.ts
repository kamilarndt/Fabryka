import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  archiveProject,
  unarchiveProject
} from '../projects';
import type { Project, ProjectFilters, CreateProjectData, UpdateProjectData } from '../../../types/project';

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = vi.mocked(fetch);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

describe('Projects API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-jwt-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('listProjects', () => {
    it('should fetch projects successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      const result = await listProjects();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should fetch projects with filters', async () => {
      const filters: ProjectFilters = {
        status: ['active'],
        search: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
        page: 1,
        limit: 20
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      const result = await listProjects(filters);

      const expectedUrl = 'http://localhost:5001/api/projects?status=active&search=test&sortBy=name&sortOrder=asc&page=1&limit=20';
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockProjectsResponse);
    });

    it('should handle array filters correctly', async () => {
      const filters: ProjectFilters = {
        status: ['active', 'completed'],
        modules: ['overview', 'elements']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      await listProjects(filters);

      const expectedUrl = 'http://localhost:5001/api/projects?status=active%2Ccompleted&modules=overview%2Celements';
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.any(Object)
      );
    });

    it('should handle date range filters', async () => {
      const filters: ProjectFilters = {
        dateRange: {
          start: '2025-01-01',
          end: '2025-12-31'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      await listProjects(filters);

      const expectedUrl = 'http://localhost:5001/api/projects?startDate=2025-01-01&endDate=2025-12-31';
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.any(Object)
      );
    });

    it('should handle location filters', async () => {
      const filters: ProjectFilters = {
        location: {
          city: 'Warsaw',
          radius: 50
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      await listProjects(filters);

      const expectedUrl = 'http://localhost:5001/api/projects?city=Warsaw&radius=50';
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.any(Object)
      );
    });

    it('should handle API error', async () => {
      const errorResponse = {
        message: 'Failed to fetch projects'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => errorResponse,
      } as Response);

      await expect(listProjects()).rejects.toThrow('Failed to fetch projects');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(listProjects()).rejects.toThrow('Network error');
    });

    it('should work without authentication token', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      const result = await listProjects();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockProjectsResponse);
    });
  });

  describe('getProject', () => {
    it('should fetch single project successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      } as Response);

      const result = await getProject('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects/1',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(mockProject);
    });

    it('should handle project not found', async () => {
      const errorResponse = {
        message: 'Project not found'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: async () => errorResponse,
      } as Response);

      await expect(getProject('999')).rejects.toThrow('Project not found');
    });
  });

  describe('createProject', () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      } as Response);

      const result = await createProject(newProjectData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify(newProjectData),
        }
      );
      expect(result).toEqual(mockProject);
    });

    it('should handle creation error', async () => {
      const newProjectData: CreateProjectData = {
        name: 'New Project',
        clientId: 'client-1',
        location: {
          address: 'New Street 123',
          city: 'Warsaw',
          postalCode: '00-001'
        }
      };

      const errorResponse = {
        message: 'Failed to create project'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => errorResponse,
      } as Response);

      await expect(createProject(newProjectData)).rejects.toThrow('Failed to create project');
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const updateData: UpdateProjectData = {
        name: 'Updated Project',
        status: 'completed'
      };
      const updatedProject = { ...mockProject, ...updateData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProject,
      } as Response);

      const result = await updateProject('1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(updatedProject);
    });

    it('should handle update error', async () => {
      const updateData: UpdateProjectData = { name: 'Updated Project' };
      const errorResponse = {
        message: 'Failed to update project'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => errorResponse,
      } as Response);

      await expect(updateProject('1', updateData)).rejects.toThrow('Failed to update project');
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const deleteResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => deleteResponse,
      } as Response);

      const result = await deleteProject('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
        }
      );
      expect(result).toEqual(deleteResponse);
    });

    it('should handle delete error', async () => {
      const errorResponse = {
        message: 'Failed to delete project'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => errorResponse,
      } as Response);

      await expect(deleteProject('1')).rejects.toThrow('Failed to delete project');
    });
  });

  describe('archiveProject', () => {
    it('should archive project successfully', async () => {
      const archivedProject = { ...mockProject, status: 'archived' as const };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => archivedProject,
      } as Response);

      const result = await archiveProject('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify({ status: 'archived' }),
        }
      );
      expect(result).toEqual(archivedProject);
    });

    it('should handle archive error', async () => {
      const errorResponse = {
        message: 'Failed to archive project'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => errorResponse,
      } as Response);

      await expect(archiveProject('1')).rejects.toThrow('Failed to archive project');
    });
  });

  describe('unarchiveProject', () => {
    it('should unarchive project successfully', async () => {
      const unarchivedProject = { ...mockProject, status: 'active' as const };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => unarchivedProject,
      } as Response);

      const result = await unarchiveProject('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          },
          body: JSON.stringify({ status: 'active' }),
        }
      );
      expect(result).toEqual(unarchivedProject);
    });

    it('should handle unarchive error', async () => {
      const errorResponse = {
        message: 'Failed to unarchive project'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => errorResponse,
      } as Response);

      await expect(unarchiveProject('1')).rejects.toThrow('Failed to unarchive project');
    });
  });

  describe('Environment configuration', () => {
    it('should use custom backend URL from environment', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      await listProjects();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/projects',
        expect.any(Object)
      );

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it('should fallback to default URL when environment variable is not set', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectsResponse,
      } as Response);

      await listProjects();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/projects',
        expect.any(Object)
      );

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe('Request headers', () => {
    it('should include custom headers when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      } as Response);

      await getProject('1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
          }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(listProjects()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle response without error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      } as Response);

      await expect(listProjects()).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
