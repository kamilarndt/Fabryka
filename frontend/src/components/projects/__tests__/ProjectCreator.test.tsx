import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectCreator } from '../ProjectCreator';
import { useCreateProject } from '../../../hooks/useProjects';

// Mock the hooks
vi.mock('../../../hooks/useProjects', () => ({
  useCreateProject: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock clients API
vi.mock('../../../lib/api/clients', () => ({
  listClients: vi.fn().mockResolvedValue([
    { id: 'client-1', name: 'Klient ABC' },
    { id: 'client-2', name: 'Klient XYZ' },
  ]),
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

describe('ProjectCreator', () => {
  const mockMutate = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should render project creation form', () => {
    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    expect(screen.getByText('Nowy Projekt')).toBeInTheDocument();
    expect(screen.getByLabelText('Nazwa projektu')).toBeInTheDocument();
    expect(screen.getByLabelText('Numer projektu')).toBeInTheDocument();
    expect(screen.getByLabelText('Klient')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Utwórz projekt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Utwórz projekt' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nazwa projektu jest wymagana')).toBeInTheDocument();
      expect(screen.getByText('Numer projektu jest wymagany')).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    mockMutateAsync.mockResolvedValue({ id: 'project-1' });

    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('Nazwa projektu'), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText('Numer projektu'), {
      target: { value: 'P2025/TEST/01' },
    });
    fireEvent.change(screen.getByLabelText('Klient'), {
      target: { value: 'client-1' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'draft' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Utwórz projekt' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Test Project',
        project_number: 'P2025/TEST/01',
        client_id: 'client-1',
        status: 'draft',
        modules: [],
        timeline: {},
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/projects');
  });

  it('should handle form submission errors', async () => {
    const error = new Error('Project number already exists');
    mockMutateAsync.mockRejectedValue(error);

    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Nazwa projektu'), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText('Numer projektu'), {
      target: { value: 'P2025/TEST/01' },
    });

    const submitButton = screen.getByRole('button', { name: 'Utwórz projekt' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Project number already exists')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', () => {
    (useCreateProject as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Utwórz projekt' });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Tworzenie...')).toBeInTheDocument();
  });

  it('should cancel and navigate back', () => {
    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    const cancelButton = screen.getByRole('button', { name: 'Anuluj' });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/projects');
  });

  it('should load and display clients in dropdown', async () => {
    render(
      <TestWrapper>
        <ProjectCreator />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Klient ABC')).toBeInTheDocument();
      expect(screen.getByText('Klient XYZ')).toBeInTheDocument();
    });
  });
});
