import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectList } from '../ProjectList';
import type { Project, ProjectFilters } from '../../../types/project';

// Mock the useProjects hook
vi.mock('../../../hooks/useProjects', () => ({
  useProjects: vi.fn(),
}));

import { useProjects } from '../../../hooks/useProjects';

const mockUseProjects = vi.mocked(useProjects);

// Mock project data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
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
      name: 'Client 1',
      email: 'client1@test.com'
    },
    location: {
      address: 'Street 1',
      city: 'Warsaw',
      postalCode: '00-001'
    },
    progress: 50,
    createdBy: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Project 2',
    project_number: 'P2025/01/02',
    status: 'completed',
    client_id: 'client-2',
    modules: ['overview'],
    timeline: {
      startDate: '2025-01-01',
      endDate: '2025-02-01',
      milestones: []
    },
    budget: {
      planned: 50000,
      spent: 50000,
      remaining: 0
    },
    client: {
      id: 'client-2',
      name: 'Client 2',
      email: 'client2@test.com'
    },
    location: {
      address: 'Street 2',
      city: 'Krakow',
      postalCode: '30-001'
    },
    progress: 100,
    createdBy: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

const mockProjectsResponse = {
  projects: mockProjects,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    pages: 1
  }
};

const mockFilters: ProjectFilters = {
  status: ['active', 'completed'],
  sortBy: 'updatedAt',
  sortOrder: 'desc'
};

const mockHandlers = {
  onProjectEdit: vi.fn(),
  onProjectView: vi.fn(),
  onProjectArchive: vi.fn(),
  onProjectDelete: vi.fn(),
};

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('ProjectList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading spinner when loading', () => {
      mockUseProjects.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Ładowanie projektów...')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should show error message when there is an error', () => {
      const error = new Error('Failed to fetch projects');
      mockUseProjects.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Błąd ładowania projektów')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      const mockRefetch = vi.fn();
      mockUseProjects.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch projects'),
        refetch: mockRefetch,
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const retryButton = screen.getByText('Spróbuj ponownie');
      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Empty state', () => {
    it('should show empty message when no projects', () => {
      mockUseProjects.mockReturnValue({
        data: { projects: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Brak projektów')).toBeInTheDocument();
      expect(screen.getByText('Nie masz jeszcze żadnych projektów. Utwórz pierwszy projekt, aby rozpocząć pracę.')).toBeInTheDocument();
    });

    it('should show filtered empty message when filters are applied', () => {
      const filteredFilters = { ...mockFilters, search: 'nonexistent' };
      mockUseProjects.mockReturnValue({
        data: { projects: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={filteredFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Nie znaleziono projektów spełniających kryteria wyszukiwania.')).toBeInTheDocument();
    });
  });

  describe('Projects display', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should render project cards', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });

    it('should show project count in header', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('2 projektów')).toBeInTheDocument();
    });

    it('should show pagination info when multiple pages', () => {
      const multiPageResponse = {
        ...mockProjectsResponse,
        pagination: { page: 1, limit: 10, total: 25, pages: 3 }
      };
      mockUseProjects.mockReturnValue({
        data: multiPageResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('25 projektów')).toBeInTheDocument();
      expect(screen.getByText('Strona 1 z 3')).toBeInTheDocument();
    });
  });

  describe('View mode controls', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should show view mode controls when onViewModeChange is provided', () => {
      const mockOnViewModeChange = vi.fn();
      render(
        <TestWrapper>
          <ProjectList 
            filters={mockFilters} 
            {...mockHandlers} 
            onViewModeChange={mockOnViewModeChange}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Siatka')).toBeInTheDocument();
      expect(screen.getByText('Lista')).toBeInTheDocument();
    });

    it('should call onViewModeChange when view mode button is clicked', () => {
      const mockOnViewModeChange = vi.fn();
      render(
        <TestWrapper>
          <ProjectList 
            filters={mockFilters} 
            {...mockHandlers} 
            onViewModeChange={mockOnViewModeChange}
          />
        </TestWrapper>
      );

      const listButton = screen.getByText('Lista');
      fireEvent.click(listButton);
      expect(mockOnViewModeChange).toHaveBeenCalledWith('list');
    });

    it('should not show view mode controls when onViewModeChange is not provided', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.queryByText('Siatka')).not.toBeInTheDocument();
      expect(screen.queryByText('Lista')).not.toBeInTheDocument();
    });
  });

  describe('Sorting controls', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should show sort dropdown', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Sortuj')).toBeInTheDocument();
    });

    it('should show sort options', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const sortButton = screen.getByText('Sortuj');
      fireEvent.click(sortButton);
      
      expect(screen.getByText('Nazwa')).toBeInTheDocument();
      expect(screen.getByText('Data utworzenia')).toBeInTheDocument();
      expect(screen.getByText('Data modyfikacji')).toBeInTheDocument();
      expect(screen.getByText('Termin zakończenia')).toBeInTheDocument();
    });
  });

  describe('Refresh functionality', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should show refresh button', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Odśwież')).toBeInTheDocument();
    });

    it('should call refetch when refresh button is clicked', () => {
      const mockRefetch = vi.fn();
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const refreshButton = screen.getByText('Odśwież');
      fireEvent.click(refreshButton);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show loading state on refresh button when fetching', () => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: true,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const refreshButton = screen.getByText('Odśwież');
      expect(refreshButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      const multiPageResponse = {
        ...mockProjectsResponse,
        pagination: { page: 2, limit: 10, total: 25, pages: 3 }
      };
      mockUseProjects.mockReturnValue({
        data: multiPageResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should show pagination controls for multiple pages', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('Poprzednia')).toBeInTheDocument();
      expect(screen.getByText('Następna')).toBeInTheDocument();
    });

    it('should show current page number', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
      const firstPageResponse = {
        ...mockProjectsResponse,
        pagination: { page: 1, limit: 10, total: 25, pages: 3 }
      };
      mockUseProjects.mockReturnValue({
        data: firstPageResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const prevButton = screen.getByText('Poprzednia');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      const lastPageResponse = {
        ...mockProjectsResponse,
        pagination: { page: 3, limit: 10, total: 25, pages: 3 }
      };
      mockUseProjects.mockReturnValue({
        data: lastPageResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);

      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      const nextButton = screen.getByText('Następna');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Compact mode', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should pass compact prop to ProjectCard components', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} compact />
        </TestWrapper>
      );

      // This would need to be tested by checking if ProjectCard receives compact prop
      // For now, we just ensure the component renders without errors
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
  });

  describe('Action handlers', () => {
    beforeEach(() => {
      mockUseProjects.mockReturnValue({
        data: mockProjectsResponse,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        isFetching: false,
      } as any);
    });

    it('should pass action handlers to ProjectCard components', () => {
      render(
        <TestWrapper>
          <ProjectList filters={mockFilters} {...mockHandlers} />
        </TestWrapper>
      );

      // The handlers are passed through to ProjectCard components
      // This is tested indirectly by ensuring the component renders without errors
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    it('should work without action handlers', () => {
      expect(() => {
        render(
          <TestWrapper>
            <ProjectList filters={mockFilters} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
