'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertIndicator,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { ProjectMetrics } from './ProjectMetrics';
import { PROJECT_STATUS_CONFIG } from '../../types/project';

interface ProjectDetailsProps {
  projectId: string;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const router = useRouter();
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const { data: project, isLoading, isError, error } = useProject(projectId);
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        status: newStatus as any,
      });
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleDelete = async () => {
    if (project && window.confirm(`Czy na pewno chcesz usunąć projekt "${project.name}"?`)) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
        router.push('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/projekt/${projectId}/edit`);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Ładowanie projektu...</Text>
      </Container>
    );
  }

  if (isError || !project) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert.Root status="error">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Błąd ładowania projektu</AlertTitle>
            <AlertDescription>
              {error?.message || 'Nie udało się załadować projektu'}
            </AlertDescription>
          </AlertContent>
        </Alert.Root>
      </Container>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projekty</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{project.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <HStack justify="space-between" align="flex-start">
          <Box>
            <HStack gap={4} align="center" mb={2}>
              <Heading as="h1" size="xl">
                {project.name}
              </Heading>
              <Badge colorPalette={statusConfig.color} variant="subtle">
                {statusConfig.label}
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              {project.project_number}
            </Text>
            {project.description && (
              <Text color="gray.700" mt={2}>
                {project.description}
              </Text>
            )}
          </Box>

          <HStack gap={2}>
            <Button
              variant="outline"
              leftIcon={<FiArrowLeft />}
              onClick={handleBack}
            >
              Powrót
            </Button>
            <Button
              colorPalette="blue"
              leftIcon={<FiEdit />}
              onClick={handleEdit}
            >
              Edytuj projekt
            </Button>
            <Button
              colorPalette="red"
              variant="outline"
              leftIcon={<FiTrash2 />}
              onClick={handleDelete}
              loading={deleteProjectMutation.isPending}
            >
              Usuń projekt
            </Button>
          </HStack>
        </HStack>

        {/* Error Alerts */}
        {updateProjectMutation.isError && (
          <Alert.Root status="error">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Błąd aktualizacji projektu</AlertTitle>
              <AlertDescription>
                {updateProjectMutation.error?.message || 'Wystąpił błąd podczas aktualizacji'}
              </AlertDescription>
            </AlertContent>
          </Alert.Root>
        )}

        {deleteProjectMutation.isError && (
          <Alert.Root status="error">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Błąd usuwania projektu</AlertTitle>
              <AlertDescription>
                {deleteProjectMutation.error?.message || 'Wystąpił błąd podczas usuwania'}
              </AlertDescription>
            </AlertContent>
          </Alert.Root>
        )}

        {/* Content Grid */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          {/* Main Content */}
          <Box gridColumn={{ base: '1', lg: '1 / 3' }}>
            <VStack gap={6} align="stretch">
              {/* Client Information */}
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Informacje o Kliencie</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    <HStack gap={4}>
                      <FiUser />
                      <Box>
                        <Text fontWeight="medium">{project.client.name}</Text>
                        <Text fontSize="sm" color="gray.600">Klient</Text>
                      </Box>
                    </HStack>
                    {project.client.email && (
                      <HStack gap={4}>
                        <FiMail />
                        <Box>
                          <Text>{project.client.email}</Text>
                          <Text fontSize="sm" color="gray.600">Email</Text>
                        </Box>
                      </HStack>
                    )}
                    {project.client.phone && (
                      <HStack gap={4}>
                        <FiPhone />
                        <Box>
                          <Text>{project.client.phone}</Text>
                          <Text fontSize="sm" color="gray.600">Telefon</Text>
                        </Box>
                      </HStack>
                    )}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Project Details */}
              <Card.Root>
                <Card.Header>
                  <HStack justify="space-between" align="center">
                    <Heading size="md">Szczegóły Projektu</Heading>
                    <HStack gap={2}>
                      {isEditingStatus ? (
                        <>
                          <Select
                            value={project.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            size="sm"
                          >
                            {Object.entries(PROJECT_STATUS_CONFIG).map(([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            ))}
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingStatus(false)}
                          >
                            Anuluj
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingStatus(true)}
                        >
                          Zmień status
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Data utworzenia</Text>
                      <Text>{new Date(project.createdAt).toLocaleDateString('pl-PL')}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Ostatnia aktualizacja</Text>
                      <Text>{new Date(project.updatedAt).toLocaleDateString('pl-PL')}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Utworzony przez</Text>
                      <Text>{project.createdBy}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Status</Text>
                      <Badge colorPalette={statusConfig.color} variant="subtle">
                        {statusConfig.label}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                </Card.Body>
              </Card.Root>
            </VStack>
          </Box>

          {/* Sidebar */}
          <Box>
            <ProjectMetrics project={project} />
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};
