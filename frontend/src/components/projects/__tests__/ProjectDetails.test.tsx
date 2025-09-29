import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectDetails } from '../ProjectDetails';
import { useProject, useUpdateProject, useDeleteProject } from '../../../hooks/useProjects';

// Mock the hooks
vi.mock('../../../hooks/useProjects', () => ({
  useProject: vi.fn(),
  useUpdateProject: vi.fn(),
  useDeleteProject: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: () => ({ id: 'project-1' }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

const mockProject = {
  id: 'project-1',
  name: 'Test Project',
  project_number: 'P2025/TEST/01',
  status: 'active',
  client_id: 'client-1',
  client: {
    id: 'client-1',
    name: 'Klient ABC',
    email: 'abc@example.com',
    phone: '+48 123 456 789',
  },
  description: 'Test project description',
  modules: ['overview', 'elements'],
  timeline: {
    startDate: '2025-01-01',
    endDate: '2025-03-31',
  },
  progress: 45,
  budget: {
    planned: 100000,
    spent: 45000,
    remaining: 55000,
  },
  createdBy: 'user-1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

describe('ProjectDetails', () => {
  const mockMutate = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useProject as any).mockReturnValue({
      data: mockProject,
      isLoading: false,
      isError: false,
      error: null,
    });
    (useUpdateProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
    (useDeleteProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should render project details', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('P2025/TEST/01')).toBeInTheDocument();
    expect(screen.getByText('Klient ABC')).toBeInTheDocument();
    expect(screen.getByText('Test project description')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useProject as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Ładowanie projektu...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useProject as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Project not found'),
    });

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Błąd ładowania projektu')).toBeInTheDocument();
    expect(screen.getByText('Project not found')).toBeInTheDocument();
  });

  it('should display project status with correct color', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const statusBadge = screen.getByText('Aktywny');
    expect(statusBadge).toBeInTheDocument();
  });

  it('should display budget information', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('100 000 zł')).toBeInTheDocument();
    expect(screen.getByText('45 000 zł')).toBeInTheDocument();
    expect(screen.getByText('55 000 zł')).toBeInTheDocument();
  });

  it('should display timeline information', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('1 stycznia 2025')).toBeInTheDocument();
    expect(screen.getByText('31 marca 2025')).toBeInTheDocument();
  });

  it('should display project modules', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Przegląd')).toBeInTheDocument();
    expect(screen.getByText('Elementy')).toBeInTheDocument();
  });

  it('should handle edit button click', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const editButton = screen.getByRole('button', { name: 'Edytuj projekt' });
    fireEvent.click(editButton);

    expect(mockPush).toHaveBeenCalledWith('/projekt/project-1/edit');
  });

  it('should handle delete button click with confirmation', () => {
    window.confirm = vi.fn().mockReturnValue(true);

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: 'Usuń projekt' });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Czy na pewno chcesz usunąć projekt "Test Project"?');
    expect(mockMutateAsync).toHaveBeenCalledWith('project-1');
  });

  it('should not delete project if confirmation is cancelled', () => {
    window.confirm = vi.fn().mockReturnValue(false);

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const deleteButton = screen.getByRole('button', { name: 'Usuń projekt' });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should handle back button click', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const backButton = screen.getByRole('button', { name: 'Powrót' });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('should show client contact information', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('abc@example.com')).toBeInTheDocument();
    expect(screen.getByText('+48 123 456 789')).toBeInTheDocument();
  });

  it('should display progress bar', () => {
    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
  });

  it('should handle status update', async () => {
    mockMutateAsync.mockResolvedValue({ ...mockProject, status: 'completed' });

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    const statusSelect = screen.getByDisplayValue('Aktywny');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'project-1',
        status: 'completed',
      });
    });
  });

  it('should show error when update fails', () => {
    (useUpdateProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: true,
      error: new Error('Update failed'),
    });

    render(
      <TestWrapper>
        <ProjectDetails projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Błąd aktualizacji projektu')).toBeInTheDocument();
    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });
});
