'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  HStack,
  Tabs,
  Badge,
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertIndicator,
} from '@chakra-ui/react';
import { FiPlus, FiGrid, FiList, FiArchive } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectList } from '../../components/projects/ProjectList';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { useProjects } from '../../hooks/useProjects';
// import { useDeleteProject, useArchiveProject, useUnarchiveProject } from '../../hooks/useProjects';
import type { Project, ProjectFilters as ProjectFiltersType } from '../../types/project';

export default function ProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'archived'>('current');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProjectFiltersType>({
    status: activeTab === 'current' ? ['active', 'paused', 'completed', 'draft'] : ['archived'],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  // Hooks for mutations - tymczasowo wyłączone
  // const deleteProjectMutation = useDeleteProject();
  // const archiveProjectMutation = useArchiveProject();
  // const unarchiveProjectMutation = useUnarchiveProject();

  // Get projects stats for tabs
  const { data: currentProjects } = useProjects({
    status: ['active', 'paused', 'completed', 'draft'],
  });
  const { data: archivedProjects } = useProjects({
    status: ['archived'],
  });

  const currentCount = currentProjects?.pagination.total || 0;
  const archivedCount = archivedProjects?.pagination.total || 0;

  const handleFiltersChange = (newFilters: ProjectFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: activeTab === 'current' ? ['active', 'paused', 'completed', 'draft'] : ['archived'],
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  const handleTabChange = (tab: 'current' | 'archived') => {
    setActiveTab(tab);
    setFilters({
      ...filters,
      status: tab === 'current' ? ['active', 'paused', 'completed', 'draft'] : ['archived'],
    });
  };

  const handleProjectView = (project: Project) => {
    router.push(`/projekt/${project.id}`);
  };

  const handleProjectEdit = (project: Project) => {
    router.push(`/projekt/${project.id}/edit`);
  };

  const handleProjectArchive = async (project: Project) => {
    // Tymczasowo wyłączone
    console.log('Archive project:', project.id);
  };

  const handleProjectDelete = async (project: Project) => {
    // Tymczasowo wyłączone
    console.log('Delete project:', project.id);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="xl">
              Projekty
            </Heading>
            <Text color="gray.600" mt={2}>
              Zarządzaj projektami produkcyjnymi
            </Text>
          </Box>
          <Link href="/projects/new">
            <Button colorPalette="blue" leftIcon={<FiPlus />}>
              Nowy Projekt
            </Button>
          </Link>
        </HStack>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={(e) => handleTabChange(e.value as 'current' | 'archived')}>
          <Tabs.List>
            <Tabs.Trigger value="current">
              <HStack gap={2}>
                <Text>Aktualne</Text>
                <Badge variant="subtle" colorPalette="blue">
                  {currentCount}
                </Badge>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="archived">
              <HStack gap={2}>
                <FiArchive />
                <Text>Archiwalne</Text>
                <Badge variant="subtle" colorPalette="gray">
                  {archivedCount}
                </Badge>
              </HStack>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="current">
            <VStack align="stretch" spacing={6}>
              {/* Filtry */}
              <ProjectFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                showAdvanced={true}
              />

              {/* Lista projektów */}
              <ProjectList
                filters={filters}
                onProjectView={handleProjectView}
                onProjectEdit={handleProjectEdit}
                onProjectArchive={handleProjectArchive}
                onProjectDelete={handleProjectDelete}
                showActions={true}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </VStack>
          </Tabs.Content>

          <Tabs.Content value="archived">
            <VStack align="stretch" spacing={6}>
              {/* Filtry dla archiwum */}
              <ProjectFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                showAdvanced={true}
              />

              {/* Lista projektów archiwalnych */}
              <ProjectList
                filters={filters}
                onProjectView={handleProjectView}
                onProjectEdit={handleProjectEdit}
                onProjectArchive={handleProjectArchive}
                onProjectDelete={handleProjectDelete}
                showActions={true}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </VStack>
          </Tabs.Content>
        </Tabs.Root>

        {/* Error handling */}
        {(deleteProjectMutation.isError || archiveProjectMutation.isError || unarchiveProjectMutation.isError) && (
          <Alert.Root status="error">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Błąd operacji</AlertTitle>
              <AlertDescription>
                Wystąpił błąd podczas wykonywania operacji. Spróbuj ponownie.
              </AlertDescription>
            </AlertContent>
          </Alert.Root>
        )}
      </VStack>
    </Container>
  );
}
