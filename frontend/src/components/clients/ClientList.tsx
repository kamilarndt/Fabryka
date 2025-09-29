'use client';

import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  Badge,
  SimpleGrid,
  Input,
  Select,
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertIndicator,
  EmptyState,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiMail, FiPhone, FiUser, FiSearch } from 'react-icons/fi';
import { useClients, useDeleteClient } from '../../hooks/useClients';
import type { Client, ClientFilters } from '../../types/client';

interface ClientListProps {
  onClientEdit?: (client: Client) => void;
  onClientAdd?: () => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  onClientEdit,
  onClientAdd,
}) => {
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data: clients, isLoading, isError, error } = useClients(filters);
  const deleteClientMutation = useDeleteClient();

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Czy na pewno chcesz usunąć klienta "${client.name}"?`)) {
      try {
        await deleteClientMutation.mutateAsync(client.id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleEdit = (client: Client) => {
    if (onClientEdit) {
      onClientEdit(client);
    }
  };

  const handleAdd = () => {
    if (onClientAdd) {
      onClientAdd();
    }
  };

  const filteredClients = clients?.filter(client => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.phone?.includes(searchLower)
      );
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <VStack gap={4} align="stretch">
        <Text>Ładowanie klientów...</Text>
      </VStack>
    );
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Błąd ładowania klientów</AlertTitle>
          <AlertDescription>
            {error?.message || 'Nie udało się załadować listy klientów'}
          </AlertDescription>
        </AlertContent>
      </Alert.Root>
    );
  }

  if (filteredClients.length === 0 && !filters.search) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiUser size="48" />
          </EmptyState.Indicator>
          <EmptyState.Title>Brak klientów</EmptyState.Title>
          <EmptyState.Description>
            Dodaj pierwszego klienta, aby rozpocząć
          </EmptyState.Description>
          <EmptyState.Action>
            <Button colorPalette="blue" leftIcon={<FiPlus />} onClick={handleAdd}>
              Dodaj klienta
            </Button>
          </EmptyState.Action>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      {/* Filters */}
      <Card.Root>
        <Card.Body>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Szukaj</Text>
              <Input
                placeholder="Szukaj klientów..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                leftIcon={<FiSearch />}
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Sortuj według</Text>
              <Select
                value={filters.sortBy || 'name'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="name">Nazwa</option>
                <option value="createdAt">Data utworzenia</option>
                <option value="updatedAt">Data aktualizacji</option>
              </Select>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Kolejność</Text>
              <Select
                value={filters.sortOrder || 'asc'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
              >
                <option value="asc">Rosnąco</option>
                <option value="desc">Malejąco</option>
              </Select>
            </Box>
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      {/* Clients Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {filteredClients.map((client) => (
          <Card.Root key={client.id}>
            <Card.Header>
              <HStack justify="space-between" align="flex-start">
                <VStack gap={1} align="flex-start">
                  <Text fontWeight="bold" fontSize="lg">
                    {client.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Klient
                  </Text>
                </VStack>
                <HStack gap={1}>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(client)}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => handleDelete(client)}
                    loading={deleteClientMutation.isPending}
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack gap={3} align="stretch">
                {client.email && (
                  <HStack gap={3}>
                    <FiMail color="gray" />
                    <Text fontSize="sm">{client.email}</Text>
                  </HStack>
                )}
                {client.phone && (
                  <HStack gap={3}>
                    <FiPhone color="gray" />
                    <Text fontSize="sm">{client.phone}</Text>
                  </HStack>
                )}
                <HStack gap={3}>
                  <FiUser color="gray" />
                  <Text fontSize="sm" color="gray.600">
                    Utworzony: {new Date(client.createdAt).toLocaleDateString('pl-PL')}
                  </Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {/* Error Alert */}
      {deleteClientMutation.isError && (
        <Alert.Root status="error">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Błąd usuwania klienta</AlertTitle>
            <AlertDescription>
              {deleteClientMutation.error?.message || 'Wystąpił błąd podczas usuwania'}
            </AlertDescription>
          </AlertContent>
        </Alert.Root>
      )}
    </VStack>
  );
};
