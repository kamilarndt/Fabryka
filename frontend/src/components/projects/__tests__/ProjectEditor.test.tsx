import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectEditor } from '../ProjectEditor';
import { useProject, useUpdateProject } from '../../../hooks/useProjects';
import { listClients } from '../../../lib/api/clients';

// Mock the hooks
vi.mock('../../../hooks/useProjects', () => ({
  useProject: vi.fn(),
  useUpdateProject: vi.fn(),
}));

// Mock clients API
vi.mock('../../../lib/api/clients', () => ({
  listClients: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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

const mockClients = [
  { id: 'client-1', name: 'Klient ABC' },
  { id: 'client-2', name: 'Klient XYZ' },
];

describe('ProjectEditor', () => {
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
    (listClients as any).mockResolvedValue(mockClients);
  });

  it('should render project edit form with pre-filled data', async () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
      expect(screen.getByDisplayValue('P2025/TEST/01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test project description')).toBeInTheDocument();
    });
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
        <ProjectEditor projectId="project-1" />
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
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    expect(screen.getByText('Błąd ładowania projektu')).toBeInTheDocument();
    expect(screen.getByText('Project not found')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    // Clear required fields
    const nameInput = screen.getByDisplayValue('Test Project');
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nazwa projektu jest wymagana')).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should submit form with updated data', async () => {
    mockMutateAsync.mockResolvedValue({ ...mockProject, name: 'Updated Project' });

    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    // Update project name
    const nameInput = screen.getByDisplayValue('Test Project');
    fireEvent.change(nameInput, { target: { value: 'Updated Project' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'project-1',
        name: 'Updated Project',
        project_number: 'P2025/TEST/01',
        client_id: 'client-1',
        status: 'active',
        description: 'Test project description',
        modules: ['overview', 'elements'],
        timeline: {
          startDate: '2025-01-01',
          endDate: '2025-03-31',
        },
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/projekt/project-1');
  });

  it('should handle form submission errors', async () => {
    const error = new Error('Update failed');
    mockMutateAsync.mockRejectedValue(error);

    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', () => {
    (useUpdateProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Zapisywanie...')).toBeInTheDocument();
  });

  it('should cancel and navigate back', () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    const cancelButton = screen.getByRole('button', { name: 'Anuluj' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/projekt/project-1');
  });

  it('should load and display clients in dropdown', async () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Klient ABC')).toBeInTheDocument();
      expect(screen.getByText('Klient XYZ')).toBeInTheDocument();
    });
  });

  it('should allow changing project status', async () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    const statusSelect = screen.getByDisplayValue('Aktywny');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
        })
      );
    });
  });

  it('should allow changing client', async () => {
    render(
      <TestWrapper>
        <ProjectEditor projectId="project-1" />
      </TestWrapper>
    );

    const clientSelect = screen.getByDisplayValue('Klient ABC');
    fireEvent.change(clientSelect, { target: { value: 'client-2' } });

    const submitButton = screen.getByRole('button', { name: 'Zapisz zmiany' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'client-2',
        })
      );
    });
  });
});
