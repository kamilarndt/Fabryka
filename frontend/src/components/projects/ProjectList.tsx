'use client';

import React from 'react';
import {
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertIndicator,
  Button,
  Box,
  Badge,
  Select,
} from '@chakra-ui/react';
import { FiRefreshCw, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '../../hooks/useProjects';
import type { Project, ProjectFilters } from '../../types/project';

interface ProjectListProps {
  filters: ProjectFilters;
  onProjectEdit?: (project: Project) => void;
  onProjectView?: (project: Project) => void;
  onProjectArchive?: (project: Project) => void;
  onProjectDelete?: (project: Project) => void;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  compact?: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  filters,
  onProjectEdit,
  onProjectView,
  onProjectArchive,
  onProjectDelete,
  showActions = true,
  viewMode = 'grid',
  onViewModeChange,
  compact = false,
}) => {
  const {
    data: projectsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProjects(filters);

  const projects = projectsResponse?.projects || [];
  const pagination = projectsResponse?.pagination;

  // Obsługa błędów
  if (isError) {
    return (
      <Alert.Root status="error" variant="subtle">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Błąd ładowania projektów</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'}
          </AlertDescription>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            leftIcon={<FiRefreshCw />}
            mt={2}
          >
            Spróbuj ponownie
          </Button>
        </AlertContent>
      </Alert.Root>
    );
  }

  // Stan ładowania
  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text color="gray.600">Ładowanie projektów...</Text>
      </VStack>
    );
  }

  // Brak projektów
  if (projects.length === 0) {
    return (
      <VStack spacing={4} py={12}>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={2}>
            Brak projektów
          </Text>
          <Text color="gray.500" mb={4}>
            {filters.search || filters.status?.length || filters.client?.length
              ? 'Nie znaleziono projektów spełniających kryteria wyszukiwania.'
              : 'Nie masz jeszcze żadnych projektów. Utwórz pierwszy projekt, aby rozpocząć pracę.'}
          </Text>
          <Button
            colorPalette="blue"
            onClick={() => refetch()}
            leftIcon={<FiRefreshCw />}
          >
            Odśwież
          </Button>
        </Box>
      </VStack>
    );
  }

  // Nagłówek z informacjami i kontrolkami
  const renderHeader = () => (
    <HStack justify="space-between" align="center" mb={6}>
      <VStack align="start" spacing={1}>
        <HStack gap={2}>
          <Text fontSize="lg" fontWeight="semibold">
            Projekty
          </Text>
          {isFetching && <Spinner size="sm" />}
        </HStack>
        <HStack gap={2} fontSize="sm" color="gray.600">
          <Text>
            {pagination?.total || projects.length} projektów
          </Text>
          {pagination && pagination.pages > 1 && (
            <>
              <Text>•</Text>
              <Text>
                Strona {pagination.page} z {pagination.pages}
              </Text>
            </>
          )}
        </HStack>
      </VStack>

      <HStack gap={2}>
        {/* Kontrolki widoku */}
        {onViewModeChange && (
          <HStack gap={1} p={1} bg="gray.100" borderRadius="md">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'solid' : 'ghost'}
              colorPalette={viewMode === 'grid' ? 'blue' : 'gray'}
              onClick={() => onViewModeChange('grid')}
              leftIcon={<FiGrid />}
            >
              Siatka
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'solid' : 'ghost'}
              colorPalette={viewMode === 'list' ? 'blue' : 'gray'}
              onClick={() => onViewModeChange('list')}
              leftIcon={<FiList />}
            >
              Lista
            </Button>
          </HStack>
        )}

        {/* Sortowanie */}
        <Select.Root
          value={filters.sortBy || 'updatedAt'}
          onValueChange={(e) => {
            // To będzie obsłużone przez komponent nadrzędny
            console.log('Sort by:', e.value);
          }}
        >
          <Select.Trigger size="sm" variant="outline">
            <Select.ValueText placeholder="Sortuj" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="name">Nazwa</Select.Item>
            <Select.Item value="createdAt">Data utworzenia</Select.Item>
            <Select.Item value="updatedAt">Data modyfikacji</Select.Item>
            <Select.Item value="endDate">Termin zakończenia</Select.Item>
          </Select.Content>
        </Select.Root>

        {/* Przycisk odświeżania */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          leftIcon={<FiRefreshCw />}
          isLoading={isFetching}
        >
          Odśwież
        </Button>
      </HStack>
    </HStack>
  );

  // Renderowanie projektów w siatce
  const renderGrid = () => (
    <SimpleGrid
      columns={{
        base: 1,
        sm: 2,
        lg: compact ? 2 : 3,
        xl: compact ? 3 : 4,
      }}
      spacing={6}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onProjectEdit}
          onView={onProjectView}
          onArchive={onProjectArchive}
          onDelete={onProjectDelete}
          showActions={showActions}
          compact={compact}
        />
      ))}
    </SimpleGrid>
  );

  // Renderowanie projektów w liście
  const renderList = () => (
    <VStack spacing={3} align="stretch">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onProjectEdit}
          onView={onProjectView}
          onArchive={onProjectArchive}
          onDelete={onProjectDelete}
          showActions={showActions}
          compact={true}
        />
      ))}
    </VStack>
  );

  // Paginacja
  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    return (
      <HStack justify="center" mt={8} gap={2}>
        <Button
          size="sm"
          variant="outline"
          disabled={pagination.page <= 1}
          onClick={() => {
            // To będzie obsłużone przez komponent nadrzędny
            console.log('Previous page');
          }}
        >
          Poprzednia
        </Button>
        
        <HStack gap={1}>
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                size="sm"
                variant={page === pagination.page ? 'solid' : 'outline'}
                colorPalette={page === pagination.page ? 'blue' : 'gray'}
                onClick={() => {
                  // To będzie obsłużone przez komponent nadrzędny
                  console.log('Page:', page);
                }}
              >
                {page}
              </Button>
            );
          })}
        </HStack>

        <Button
          size="sm"
          variant="outline"
          disabled={pagination.page >= pagination.pages}
          onClick={() => {
            // To będzie obsłużone przez komponent nadrzędny
            console.log('Next page');
          }}
        >
          Następna
        </Button>
      </HStack>
    );
  };

  return (
    <VStack align="stretch" spacing={6}>
      {renderHeader()}
      
      {viewMode === 'grid' ? renderGrid() : renderList()}
      
      {renderPagination()}
    </VStack>
  );
};

export default ProjectList;
