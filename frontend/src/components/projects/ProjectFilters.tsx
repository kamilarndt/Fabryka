'use client';

import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Tabs,
  Box,
  Badge,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  IconButton,
  Text,
  HStack as ChakraHStack,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiPackage
} from 'react-icons/fi';
import type { ProjectFilters as ProjectFiltersType, ProjectStatus, ProjectModule } from '../../types/project';
import { PROJECT_STATUS_CONFIG, PROJECT_MODULE_CONFIG } from '../../types/project';

interface ProjectFiltersProps {
  filters: ProjectFiltersType;
  onFiltersChange: (filters: ProjectFiltersType) => void;
  onClearFilters: () => void;
  showAdvanced?: boolean;
  compact?: boolean;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  showAdvanced = true,
  compact = false,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFiltersChange({ ...filters, search: searchTerm || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters, onFiltersChange]);

  // Status options
  const statusOptions = Object.entries(PROJECT_STATUS_CONFIG).map(([value, config]) => ({
    value: value as ProjectStatus,
    label: config.label,
  }));

  // Module options
  const moduleOptions = Object.entries(PROJECT_MODULE_CONFIG).map(([value, config]) => ({
    value: value as ProjectModule,
    label: config.label,
  }));

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Nazwa' },
    { value: 'createdAt', label: 'Data utworzenia' },
    { value: 'updatedAt', label: 'Data modyfikacji' },
    { value: 'endDate', label: 'Termin zakończenia' },
  ];

  // Sort order options
  const sortOrderOptions = [
    { value: 'asc', label: 'Rosnąco' },
    { value: 'desc', label: 'Malejąco' },
  ];

  const handleStatusChange = (statuses: string[]) => {
    onFiltersChange({
      ...filters,
      status: statuses.length > 0 ? statuses as ProjectStatus[] : undefined,
    });
  };

  const handleModuleChange = (modules: string[]) => {
    onFiltersChange({
      ...filters,
      modules: modules.length > 0 ? modules as ProjectModule[] : undefined,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as ProjectFiltersType['sortBy'],
    });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value || undefined,
      },
    });
  };

  const handleLocationChange = (field: 'city' | 'radius', value: string) => {
    onFiltersChange({
      ...filters,
      location: {
        ...filters.location,
        [field]: field === 'radius' ? (value ? parseInt(value) : undefined) : value,
      },
    });
  };

  const clearFilter = (filterKey: keyof ProjectFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      filters.search ||
      filters.status?.length ||
      filters.modules?.length ||
      filters.dateRange?.start ||
      filters.dateRange?.end ||
      filters.location?.city ||
      filters.location?.radius
    );
  };

  if (compact) {
    return (
      <HStack gap={2} wrap="wrap">
        {/* Wyszukiwanie */}
        <Input
          placeholder="Szukaj projektów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<FiSearch />}
          size="sm"
          width="200px"
        />

        {/* Status */}
        <Select.Root
          value={filters.status || []}
          onValueChange={(e) => handleStatusChange(e.value)}
          multiple
        >
          <Select.Trigger size="sm" variant="outline" width="150px">
            <Select.ValueTextText placeholder="Status" />
          </Select.Trigger>
          <Select.Content>
            {statusOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Sortowanie */}
        <Select.Root
          value={filters.sortBy || 'updatedAt'}
          onValueChange={(e) => handleSortChange(e.value)}
        >
          <Select.Trigger size="sm" variant="outline" width="150px">
            <Select.ValueText placeholder="Sortuj" />
          </Select.Trigger>
          <Select.Content>
            {sortOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Przycisk czyszczenia */}
        {hasActiveFilters() && (
          <Button
            size="sm"
            variant="outline"
            onClick={onClearFilters}
            leftIcon={<FiX />}
          >
            Wyczyść
          </Button>
        )}
      </HStack>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      {/* Główne filtry */}
      <HStack gap={4} wrap="wrap">
        {/* Wyszukiwanie */}
        <Input
          placeholder="Szukaj projektów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<FiSearch />}
          flex={1}
          minWidth="250px"
        />

        {/* Status */}
        <Select.Root
          value={filters.status || []}
          onValueChange={(e) => handleStatusChange(e.value)}
          multiple
        >
          <Select.Trigger variant="outline" width="200px">
            <Select.ValueText placeholder="Status projektu" />
          </Select.Trigger>
          <Select.Content>
            {statusOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Sortowanie */}
        <HStack gap={2}>
          <Select.Root
            value={filters.sortBy || 'updatedAt'}
            onValueChange={(e) => handleSortChange(e.value)}
          >
            <Select.Trigger variant="outline" width="150px">
              <Select.ValueText placeholder="Sortuj" />
            </Select.Trigger>
            <Select.Content>
              {sortOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={filters.sortOrder || 'desc'}
            onValueChange={(e) => handleSortOrderChange(e.value)}
          >
            <Select.Trigger variant="outline" width="120px">
              <Select.ValueText placeholder="Kolejność" />
            </Select.Trigger>
            <Select.Content>
              {sortOrderOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </HStack>

        {/* Przycisk zaawansowanych filtrów */}
        {showAdvanced && (
          <Button
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            leftIcon={<FiFilter />}
            rightIcon={isAdvancedOpen ? <FiChevronUp /> : <FiChevronDown />}
          >
            Filtry
          </Button>
        )}

        {/* Przycisk czyszczenia */}
        {hasActiveFilters() && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            leftIcon={<FiX />}
            colorPalette="red"
          >
            Wyczyść
          </Button>
        )}
      </HStack>

      {/* Aktywne filtry */}
      {hasActiveFilters() && (
        <HStack gap={2} wrap="wrap">
          <Text fontSize="sm" color="gray.600">
            Aktywne filtry:
          </Text>
          
          {filters.search && (
            <Badge variant="subtle" colorPalette="blue">
              <HStack gap={1}>
                <FiSearch size={12} />
                <Text>{filters.search}</Text>
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    clearFilter('search');
                  }}
                >
                  <FiX size={10} />
                </IconButton>
              </HStack>
            </Badge>
          )}

          {filters.status?.map((status) => (
            <Badge key={status} variant="subtle" colorPalette="green">
              <HStack gap={1}>
                <Text>{PROJECT_STATUS_CONFIG[status].label}</Text>
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    const newStatuses = filters.status?.filter(s => s !== status);
                    handleStatusChange(newStatuses || []);
                  }}
                >
                  <FiX size={10} />
                </IconButton>
              </HStack>
            </Badge>
          ))}

          {filters.modules?.map((module) => (
            <Badge key={module} variant="subtle" colorPalette="purple">
              <HStack gap={1}>
                <FiPackage size={12} />
                <Text>{PROJECT_MODULE_CONFIG[module].label}</Text>
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    const newModules = filters.modules?.filter(m => m !== module);
                    handleModuleChange(newModules || []);
                  }}
                >
                  <FiX size={10} />
                </IconButton>
              </HStack>
            </Badge>
          ))}
        </HStack>
      )}

      {/* Zaawansowane filtry */}
      {showAdvanced && (
        <Collapsible.Root open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent>
            <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="medium" fontSize="sm">
                  Zaawansowane filtry
                </Text>

                <HStack gap={4} wrap="wrap">
                  {/* Moduły */}
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium">
                      Moduły
                    </Text>
                    <Select.Root
                      value={filters.modules || []}
                      onValueChange={(e) => handleModuleChange(e.value)}
                      multiple
                    >
                      <Select.Trigger variant="outline" width="200px">
                        <Select.ValueText placeholder="Wybierz moduły" />
                      </Select.Trigger>
                      <Select.Content>
                        {moduleOptions.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </VStack>

                  {/* Zakres dat */}
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium">
                      Zakres dat
                    </Text>
                    <HStack gap={2}>
                      <Input
                        type="date"
                        placeholder="Data rozpoczęcia"
                        value={filters.dateRange?.start || ''}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        leftIcon={<FiCalendar />}
                        size="sm"
                      />
                      <Input
                        type="date"
                        placeholder="Data zakończenia"
                        value={filters.dateRange?.end || ''}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        leftIcon={<FiCalendar />}
                        size="sm"
                      />
                    </HStack>
                  </VStack>

                  {/* Lokalizacja */}
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium">
                      Lokalizacja
                    </Text>
                    <HStack gap={2}>
                      <Input
                        placeholder="Miasto"
                        value={filters.location?.city || ''}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        leftIcon={<FiMapPin />}
                        size="sm"
                      />
                      <Input
                        type="number"
                        placeholder="Promień (km)"
                        value={filters.location?.radius || ''}
                        onChange={(e) => handleLocationChange('radius', e.target.value)}
                        size="sm"
                        width="120px"
                      />
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </CollapsibleContent>
        </Collapsible.Root>
      )}
    </VStack>
  );
};

export default ProjectFilters;
