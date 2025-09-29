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
import { useCreateProject } from '../../hooks/useProjects';
import { listClients } from '../../lib/api/clients';
import type { Client } from '../../types/client';
import type { CreateProjectRequest } from '../../types/project';

interface ProjectCreatorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProjectCreator: React.FC<ProjectCreatorProps> = ({
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    project_number: '',
    client_id: '',
    status: 'draft',
    modules: [],
    timeline: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const createProjectMutation = useCreateProject();

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa projektu jest wymagana';
    }

    if (!formData.project_number.trim()) {
      newErrors.project_number = 'Numer projektu jest wymagany';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Klient jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateProjectRequest, value: any) => {
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
      await createProjectMutation.mutateAsync(formData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/projects');
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projekty</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Nowy Projekt</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Nowy Projekt
          </Heading>
          <Text color="gray.600">
            Utwórz nowy projekt produkcyjny
          </Text>
        </Box>

        {/* Error Alert */}
        {createProjectMutation.isError && (
          <Alert.Root status="error">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Błąd tworzenia projektu</AlertTitle>
              <AlertDescription>
                {createProjectMutation.error?.message || 'Wystąpił nieoczekiwany błąd'}
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Wprowadź nazwę projektu"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Project Number */}
            <FormControl isInvalid={!!errors.project_number}>
              <FormLabel>Numer projektu</FormLabel>
              <Input
                value={formData.project_number}
                onChange={(e) => handleInputChange('project_number', e.target.value)}
                placeholder="np. P2025/01/15"
              />
              <FormErrorMessage>{errors.project_number}</FormErrorMessage>
            </FormControl>

            {/* Client */}
            <FormControl isInvalid={!!errors.client_id}>
              <FormLabel>Klient</FormLabel>
              <Select
                value={formData.client_id}
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
                value={formData.status}
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
              <FormLabel>Opis (opcjonalny)</FormLabel>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Krótki opis projektu..."
                rows={3}
              />
            </FormControl>

            {/* Actions */}
            <HStack gap={4} justify="flex-end">
              <Button
                type="button"
                variant="outline"
                leftIcon={<FiX />}
                onClick={handleCancel}
                disabled={createProjectMutation.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                colorPalette="blue"
                leftIcon={<FiSave />}
                loading={createProjectMutation.isPending}
                loadingText="Tworzenie..."
              >
                Utwórz projekt
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
