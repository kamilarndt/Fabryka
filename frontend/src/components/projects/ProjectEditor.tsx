'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertIndicator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useProject, useUpdateProject } from '../../hooks/useProjects';
import { listClients } from '../../lib/api/clients';
import type { Client } from '../../types/client';
import type { UpdateProjectRequest } from '../../types/project';

interface ProjectEditorProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projectId,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateProjectRequest>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const { data: project, isLoading, isError, error } = useProject(projectId);
  const updateProjectMutation = useUpdateProject();

  // Load clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await listClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
  }, []);

  // Initialize form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        project_number: project.project_number,
        client_id: project.client_id,
        status: project.status,
        description: project.description,
        modules: project.modules,
        timeline: project.timeline,
      });
    }
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nazwa projektu jest wymagana';
    }

    if (!formData.project_number?.trim()) {
      newErrors.project_number = 'Numer projektu jest wymagany';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Klient jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateProjectRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        ...formData,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/projekt/${projectId}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/projekt/${projectId}`);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Ładowanie projektu...</Text>
      </Container>
    );
  }

  if (isError || !project) {
    return (
      <Container maxW="container.md" py={8}>
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

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projekty</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projekt/${projectId}`}>{project.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Edycja</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Edycja Projektu
          </Heading>
          <Text color="gray.600">
            Edytuj szczegóły projektu: {project.name}
          </Text>
        </Box>

        {/* Error Alert */}
        {updateProjectMutation.isError && (
          <Alert.Root status="error">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Błąd aktualizacji projektu</AlertTitle>
              <AlertDescription>
                {updateProjectMutation.error?.message || 'Wystąpił nieoczekiwany błąd'}
              </AlertDescription>
            </AlertContent>
          </Alert.Root>
        )}

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={6} align="stretch">
            {/* Project Name */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Nazwa projektu</FormLabel>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Wprowadź nazwę projektu"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Project Number */}
            <FormControl isInvalid={!!errors.project_number}>
              <FormLabel>Numer projektu</FormLabel>
              <Input
                value={formData.project_number || ''}
                onChange={(e) => handleInputChange('project_number', e.target.value)}
                placeholder="np. P2025/01/15"
              />
              <FormErrorMessage>{errors.project_number}</FormErrorMessage>
            </FormControl>

            {/* Client */}
            <FormControl isInvalid={!!errors.client_id}>
              <FormLabel>Klient</FormLabel>
              <Select
                value={formData.client_id || ''}
                onChange={(e) => handleInputChange('client_id', e.target.value)}
                placeholder={loadingClients ? "Ładowanie klientów..." : "Wybierz klienta"}
                disabled={loadingClients}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.client_id}</FormErrorMessage>
            </FormControl>

            {/* Status */}
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status || 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="draft">Szkic</option>
                <option value="active">Aktywny</option>
                <option value="paused">Wstrzymany</option>
                <option value="completed">Zakończony</option>
                <option value="cancelled">Anulowany</option>
              </Select>
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel>Opis</FormLabel>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Opis projektu..."
                rows={4}
              />
            </FormControl>

            {/* Actions */}
            <HStack gap={4} justify="flex-end">
              <Button
                type="button"
                variant="outline"
                leftIcon={<FiX />}
                onClick={handleCancel}
                disabled={updateProjectMutation.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                colorPalette="blue"
                leftIcon={<FiSave />}
                loading={updateProjectMutation.isPending}
                loadingText="Zapisywanie..."
              >
                Zapisz zmiany
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
