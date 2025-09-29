import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectFilters } from '../ProjectFilters';
import type { ProjectFilters as ProjectFiltersType } from '../../../types/project';

const mockFilters: ProjectFiltersType = {
  search: '',
  status: [],
  client: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

const mockHandlers = {
  onFiltersChange: vi.fn(),
  onClearFilters: vi.fn(),
};

describe('ProjectFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render search input', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByPlaceholderText('Szukaj projektów...')).toBeInTheDocument();
    });

    it('should render status filter', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render sort controls', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Sortuj')).toBeInTheDocument();
    });

    it('should render clear filters button when filters are active', () => {
      const filtersWithSearch = { ...mockFilters, search: 'test' };
      render(
        <ProjectFilters 
          filters={filtersWithSearch} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Wyczyść wszystko')).toBeInTheDocument();
    });

    it('should not render clear filters button when no filters are active', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.queryByText('Wyczyść wszystko')).not.toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should call onFiltersChange when search input changes', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const searchInput = screen.getByPlaceholderText('Szukaj projektów...');
      fireEvent.change(searchInput, { target: { value: 'test project' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        search: 'test project'
      });
    });

    it('should clear search when input is emptied', () => {
      const filtersWithSearch = { ...mockFilters, search: 'test' };
      render(
        <ProjectFilters 
          filters={filtersWithSearch} 
          {...mockHandlers} 
        />
      );
      
      const searchInput = screen.getByDisplayValue('test');
      fireEvent.change(searchInput, { target: { value: '' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        search: undefined
      });
    });
  });

  describe('Status filtering', () => {
    it('should show all status options', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const statusSelect = screen.getByText('Status');
      fireEvent.click(statusSelect);
      
      expect(screen.getByText('Szkic')).toBeInTheDocument();
      expect(screen.getByText('Aktywny')).toBeInTheDocument();
      expect(screen.getByText('Wstrzymany')).toBeInTheDocument();
      expect(screen.getByText('Zakończony')).toBeInTheDocument();
      expect(screen.getByText('Anulowany')).toBeInTheDocument();
      expect(screen.getByText('Zarchiwizowany')).toBeInTheDocument();
    });

    it('should call onFiltersChange when status is selected', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const statusSelect = screen.getByText('Status');
      fireEvent.click(statusSelect);
      
      const activeOption = screen.getByText('Aktywny');
      fireEvent.click(activeOption);
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        status: ['active']
      });
    });

    it('should show selected status', () => {
      const filtersWithStatus = { ...mockFilters, status: ['active'] };
      render(
        <ProjectFilters 
          filters={filtersWithStatus} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Aktywny')).toBeInTheDocument();
    });
  });

  describe('Sorting functionality', () => {
    it('should show all sort options', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const sortSelect = screen.getByText('Sortuj');
      fireEvent.click(sortSelect);
      
      expect(screen.getByText('Ostatnia aktualizacja')).toBeInTheDocument();
      expect(screen.getByText('Nazwa projektu')).toBeInTheDocument();
      expect(screen.getByText('Data utworzenia')).toBeInTheDocument();
      expect(screen.getByText('Data rozpoczęcia')).toBeInTheDocument();
      expect(screen.getByText('Data zakończenia')).toBeInTheDocument();
    });

    it('should call onFiltersChange when sort option is selected', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const sortSelect = screen.getByText('Sortuj');
      fireEvent.click(sortSelect);
      
      const nameOption = screen.getByText('Nazwa projektu');
      fireEvent.click(nameOption);
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        sortBy: 'name'
      });
    });

    it('should show sort order options', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const sortOrderSelect = screen.getByText('Kolejność');
      fireEvent.click(sortOrderSelect);
      
      expect(screen.getByText('Rosnąco')).toBeInTheDocument();
      expect(screen.getByText('Malejąco')).toBeInTheDocument();
    });

    it('should call onFiltersChange when sort order is selected', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
        />
      );
      
      const sortOrderSelect = screen.getByText('Kolejność');
      fireEvent.click(sortOrderSelect);
      
      const ascendingOption = screen.getByText('Rosnąco');
      fireEvent.click(ascendingOption);
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        sortOrder: 'asc'
      });
    });
  });

  describe('Advanced filters', () => {
    it('should show advanced filters toggle when showAdvanced is true', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      expect(screen.getByText('Więcej filtrów')).toBeInTheDocument();
    });

    it('should not show advanced filters toggle when showAdvanced is false', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={false}
        />
      );
      
      expect(screen.queryByText('Więcej filtrów')).not.toBeInTheDocument();
    });

    it('should toggle advanced filters when button is clicked', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Mniej filtrów')).toBeInTheDocument();
      expect(screen.getByText('Zaawansowane filtry:')).toBeInTheDocument();
    });

    it('should show client filter in advanced section', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Klient:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nazwa klienta')).toBeInTheDocument();
    });

    it('should show module filter in advanced section', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Moduły:')).toBeInTheDocument();
    });

    it('should show location filter in advanced section', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Miasto:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Miasto')).toBeInTheDocument();
    });

    it('should show date range filter in advanced section', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Zakres dat:')).toBeInTheDocument();
    });

    it('should show radius filter in advanced section', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Promień wyszukiwania (km):')).toBeInTheDocument();
    });
  });

  describe('Client filtering', () => {
    it('should call onFiltersChange when client input changes', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const clientInput = screen.getByPlaceholderText('Nazwa klienta');
      fireEvent.change(clientInput, { target: { value: 'Test Client' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        client: ['Test Client']
      });
    });
  });

  describe('Module filtering', () => {
    it('should show all module options', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const moduleSelect = screen.getByText('Wybierz moduły');
      fireEvent.click(moduleSelect);
      
      expect(screen.getByText('Przegląd')).toBeInTheDocument();
      expect(screen.getByText('Koncepcja')).toBeInTheDocument();
      expect(screen.getByText('Elementy')).toBeInTheDocument();
      expect(screen.getByText('Wycena')).toBeInTheDocument();
      expect(screen.getByText('Harmonogram')).toBeInTheDocument();
      expect(screen.getByText('Pliki')).toBeInTheDocument();
      expect(screen.getByText('Materiały')).toBeInTheDocument();
      expect(screen.getByText('Logistyka')).toBeInTheDocument();
      expect(screen.getByText('Załoga')).toBeInTheDocument();
      expect(screen.getByText('Model 3D')).toBeInTheDocument();
    });

    it('should call onFiltersChange when module is selected', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const moduleSelect = screen.getByText('Wybierz moduły');
      fireEvent.click(moduleSelect);
      
      const overviewOption = screen.getByText('Przegląd');
      fireEvent.click(overviewOption);
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        modules: ['overview']
      });
    });
  });

  describe('Location filtering', () => {
    it('should call onFiltersChange when city input changes', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const cityInput = screen.getByPlaceholderText('Miasto');
      fireEvent.change(cityInput, { target: { value: 'Warsaw' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        location: { city: 'Warsaw' }
      });
    });
  });

  describe('Date range filtering', () => {
    it('should call onFiltersChange when start date changes', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const startDateInput = screen.getByDisplayValue('');
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        dateRange: { start: '2025-01-01' }
      });
    });

    it('should call onFiltersChange when end date changes', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      const dateInputs = screen.getAllByDisplayValue('');
      const endDateInput = dateInputs[1]; // Second date input
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        dateRange: { end: '2025-12-31' }
      });
    });
  });

  describe('Clear filters functionality', () => {
    it('should call onClearFilters when clear button is clicked', () => {
      const filtersWithSearch = { ...mockFilters, search: 'test' };
      render(
        <ProjectFilters 
          filters={filtersWithSearch} 
          {...mockHandlers} 
        />
      );
      
      const clearButton = screen.getByText('Wyczyść wszystko');
      fireEvent.click(clearButton);
      
      expect(mockHandlers.onClearFilters).toHaveBeenCalled();
    });

    it('should show active filter tags', () => {
      const filtersWithMultiple = {
        ...mockFilters,
        search: 'test',
        status: ['active'],
        client: ['Test Client']
      };
      render(
        <ProjectFilters 
          filters={filtersWithMultiple} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Szukaj: test')).toBeInTheDocument();
      expect(screen.getByText('Status: Aktywny')).toBeInTheDocument();
      expect(screen.getByText('Klient: Test Client')).toBeInTheDocument();
    });

    it('should allow removing individual filter tags', () => {
      const filtersWithSearch = { ...mockFilters, search: 'test' };
      render(
        <ProjectFilters 
          filters={filtersWithSearch} 
          {...mockHandlers} 
        />
      );
      
      const searchTag = screen.getByText('Szukaj: test');
      const closeButton = searchTag.parentElement?.querySelector('button');
      if (closeButton) {
        fireEvent.click(closeButton);
      }
      
      expect(mockHandlers.onFiltersChange).toHaveBeenCalledWith({
        ...mockFilters,
        search: undefined
      });
    });
  });

  describe('Compact mode', () => {
    it('should render in compact mode when compact prop is true', () => {
      render(
        <ProjectFilters 
          filters={mockFilters} 
          {...mockHandlers} 
          compact={true}
        />
      );
      
      // In compact mode, the component should still render but with different styling
      expect(screen.getByPlaceholderText('Szukaj projektów...')).toBeInTheDocument();
    });
  });

  describe('Filter state management', () => {
    it('should handle multiple status selection', () => {
      const filtersWithMultipleStatus = { ...mockFilters, status: ['active', 'completed'] };
      render(
        <ProjectFilters 
          filters={filtersWithMultipleStatus} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Status: Aktywny, Zakończony')).toBeInTheDocument();
    });

    it('should handle multiple module selection', () => {
      const filtersWithMultipleModules = { 
        ...mockFilters, 
        modules: ['overview', 'elements'] 
      };
      render(
        <ProjectFilters 
          filters={filtersWithMultipleModules} 
          {...mockHandlers} 
          showAdvanced={true}
        />
      );
      
      const toggleButton = screen.getByText('Więcej filtrów');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Moduły: Przegląd, Elementy')).toBeInTheDocument();
    });

    it('should handle date range with both dates', () => {
      const filtersWithDateRange = {
        ...mockFilters,
        dateRange: { start: '2025-01-01', end: '2025-12-31' }
      };
      render(
        <ProjectFilters 
          filters={filtersWithDateRange} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Daty: 2025-01-01 - 2025-12-31')).toBeInTheDocument();
    });

    it('should handle location with radius', () => {
      const filtersWithLocation = {
        ...mockFilters,
        location: { city: 'Warsaw', radius: 50 }
      };
      render(
        <ProjectFilters 
          filters={filtersWithLocation} 
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Miasto: Warsaw')).toBeInTheDocument();
      expect(screen.getByText('Promień: 50km')).toBeInTheDocument();
    });
  });
});
