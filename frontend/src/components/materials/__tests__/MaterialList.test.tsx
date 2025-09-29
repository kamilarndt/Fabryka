import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { MaterialList } from '../MaterialList';
import { useMaterials, useDeleteMaterial } from '../../../hooks/useMaterials';

// Mock the hooks
vi.mock('../../../hooks/useMaterials', () => ({
  useMaterials: vi.fn(),
  useDeleteMaterial: vi.fn(),
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

const mockMaterials = [
  {
    id: 'material-1',
    name: 'Płyta MDF 18mm',
    category: 'Płyty',
    unit: 'm²',
    price: 45.50,
    stock: 120,
    minStock: 20,
    supplier: 'Dostawca ABC',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'material-2',
    name: 'Lakier bezbarwny',
    category: 'Lakiery',
    unit: 'l',
    price: 89.99,
    stock: 15,
    minStock: 5,
    supplier: 'Dostawca XYZ',
    createdAt: '2025-01-02T00:00:00Z',
  },
];

describe('MaterialList', () => {
  const mockMutate = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMaterials as any).mockReturnValue({
      data: mockMaterials,
      isLoading: false,
      isError: false,
      error: null,
    });
    (useDeleteMaterial as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should render materials list', () => {
    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('Płyta MDF 18mm')).toBeInTheDocument();
    expect(screen.getByText('Lakier bezbarwny')).toBeInTheDocument();
    expect(screen.getByText('Płyty')).toBeInTheDocument();
    expect(screen.getByText('Lakiery')).toBeInTheDocument();
  });

  it('should display stock information', () => {
    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('120 m²')).toBeInTheDocument();
    expect(screen.getByText('15 l')).toBeInTheDocument();
  });

  it('should show low stock warning', () => {
    const lowStockMaterial = {
      ...mockMaterials[1],
      stock: 3, // Below minStock of 5
    };

    (useMaterials as any).mockReturnValue({
      data: [mockMaterials[0], lowStockMaterial],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('Niski stan magazynowy')).toBeInTheDocument();
  });

  it('should display prices', () => {
    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('45,50 zł')).toBeInTheDocument();
    expect(screen.getByText('89,99 zł')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useMaterials as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('Ładowanie materiałów...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useMaterials as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load materials'),
    });

    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('Błąd ładowania materiałów')).toBeInTheDocument();
    expect(screen.getByText('Failed to load materials')).toBeInTheDocument();
  });

  it('should handle material deletion with confirmation', () => {
    window.confirm = vi.fn().mockReturnValue(true);

    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    const deleteButton = screen.getAllByRole('button', { name: 'Usuń' })[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Czy na pewno chcesz usunąć materiał "Płyta MDF 18mm"?');
    expect(mockMutateAsync).toHaveBeenCalledWith('material-1');
  });

  it('should filter materials by category', () => {
    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    const categoryFilter = screen.getByRole('combobox', { name: /kategoria/i });
    fireEvent.change(categoryFilter, { target: { value: 'Płyty' } });

    expect(screen.getByText('Płyta MDF 18mm')).toBeInTheDocument();
    expect(screen.queryByText('Lakier bezbarwny')).not.toBeInTheDocument();
  });

  it('should search materials by name', () => {
    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/szukaj materiałów/i);
    fireEvent.change(searchInput, { target: { value: 'MDF' } });

    expect(screen.getByText('Płyta MDF 18mm')).toBeInTheDocument();
    expect(screen.queryByText('Lakier bezbarwny')).not.toBeInTheDocument();
  });

  it('should show empty state when no materials', () => {
    (useMaterials as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <MaterialList />
      </TestWrapper>
    );

    expect(screen.getByText('Brak materiałów')).toBeInTheDocument();
    expect(screen.getByText('Dodaj pierwszy materiał, aby rozpocząć')).toBeInTheDocument();
  });
});
