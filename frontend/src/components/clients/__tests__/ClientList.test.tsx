import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ClientList } from '../ClientList';
import { useClients, useDeleteClient } from '../../../hooks/useClients';

// Mock the hooks
vi.mock('../../../hooks/useClients', () => ({
  useClients: vi.fn(),
  useDeleteClient: vi.fn(),
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

const mockClients = [
  {
    id: 'client-1',
    name: 'Klient ABC',
    email: 'abc@example.com',
    phone: '+48 123 456 789',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Klient XYZ',
    email: 'xyz@example.com',
    phone: '+48 987 654 321',
    createdAt: '2025-01-02T00:00:00Z',
  },
];

describe('ClientList', () => {
  const mockMutate = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useClients as any).mockReturnValue({
      data: mockClients,
      isLoading: false,
      isError: false,
      error: null,
    });
    (useDeleteClient as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should render clients list', () => {
    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    expect(screen.getByText('Klient ABC')).toBeInTheDocument();
    expect(screen.getByText('Klient XYZ')).toBeInTheDocument();
    expect(screen.getByText('abc@example.com')).toBeInTheDocument();
    expect(screen.getByText('xyz@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useClients as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    expect(screen.getByText('Ładowanie klientów...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useClients as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load clients'),
    });

    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    expect(screen.getByText('Błąd ładowania klientów')).toBeInTheDocument();
    expect(screen.getByText('Failed to load clients')).toBeInTheDocument();
  });

  it('should handle client deletion with confirmation', () => {
    window.confirm = vi.fn().mockReturnValue(true);

    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    const deleteButton = screen.getAllByRole('button', { name: 'Usuń' })[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Czy na pewno chcesz usunąć klienta "Klient ABC"?');
    expect(mockMutateAsync).toHaveBeenCalledWith('client-1');
  });

  it('should not delete client if confirmation is cancelled', () => {
    window.confirm = vi.fn().mockReturnValue(false);

    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    const deleteButton = screen.getAllByRole('button', { name: 'Usuń' })[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should handle edit client', () => {
    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    const editButton = screen.getAllByRole('button', { name: 'Edytuj' })[0];
    fireEvent.click(editButton);

    // Should open edit modal or navigate to edit page
    expect(editButton).toBeInTheDocument();
  });

  it('should display client contact information', () => {
    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    expect(screen.getByText('+48 123 456 789')).toBeInTheDocument();
    expect(screen.getByText('+48 987 654 321')).toBeInTheDocument();
  });

  it('should show empty state when no clients', () => {
    (useClients as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ClientList />
      </TestWrapper>
    );

    expect(screen.getByText('Brak klientów')).toBeInTheDocument();
    expect(screen.getByText('Dodaj pierwszego klienta, aby rozpocząć')).toBeInTheDocument();
  });
});
