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
  Progress,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { useMaterials, useDeleteMaterial } from '../../hooks/useMaterials';
import type { Material, MaterialFilters } from '../../types/material';

interface MaterialListProps {
  onMaterialEdit?: (material: Material) => void;
  onMaterialAdd?: () => void;
}

export const MaterialList: React.FC<MaterialListProps> = ({
  onMaterialEdit,
  onMaterialAdd,
}) => {
  const [filters, setFilters] = useState<MaterialFilters>({
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data: materials, isLoading, isError, error } = useMaterials(filters);
  const deleteMaterialMutation = useDeleteMaterial();

  const handleDelete = async (material: Material) => {
    if (window.confirm(`Czy na pewno chcesz usunąć materiał "${material.name}"?`)) {
      try {
        await deleteMaterialMutation.mutateAsync(material.id);
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleEdit = (material: Material) => {
    if (onMaterialEdit) {
      onMaterialEdit(material);
    }
  };

  const handleAdd = () => {
    if (onMaterialAdd) {
      onMaterialAdd();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isLowStock = (material: Material) => {
    return material.stock <= material.minStock;
  };

  const getStockColor = (material: Material) => {
    if (isLowStock(material)) return 'red';
    if (material.stock <= material.minStock * 2) return 'yellow';
    return 'green';
  };

  const filteredMaterials = materials?.filter(material => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        material.name.toLowerCase().includes(searchLower) ||
        material.category.toLowerCase().includes(searchLower) ||
        material.supplier.toLowerCase().includes(searchLower)
      );
    }
    if (filters.category) {
      return material.category === filters.category;
    }
    return true;
  }) || [];

  const categories = [...new Set(materials?.map(m => m.category) || [])];

  if (isLoading) {
    return (
      <VStack gap={4} align="stretch">
        <Text>Ładowanie materiałów...</Text>
      </VStack>
    );
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Błąd ładowania materiałów</AlertTitle>
          <AlertDescription>
            {error?.message || 'Nie udało się załadować listy materiałów'}
          </AlertDescription>
        </AlertContent>
      </Alert.Root>
    );
  }

  if (filteredMaterials.length === 0 && !filters.search && !filters.category) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiPackage size="48" />
          </EmptyState.Indicator>
          <EmptyState.Title>Brak materiałów</EmptyState.Title>
          <EmptyState.Description>
            Dodaj pierwszy materiał, aby rozpocząć
          </EmptyState.Description>
          <EmptyState.Action>
            <Button colorPalette="blue" leftIcon={<FiPlus />} onClick={handleAdd}>
              Dodaj materiał
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
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Szukaj</Text>
              <Input
                placeholder="Szukaj materiałów..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                leftIcon={<FiSearch />}
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Kategoria</Text>
              <Select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Wszystkie kategorie"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Sortuj według</Text>
              <Select
                value={filters.sortBy || 'name'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="name">Nazwa</option>
                <option value="category">Kategoria</option>
                <option value="stock">Stan magazynowy</option>
                <option value="price">Cena</option>
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

      {/* Low Stock Alert */}
      {materials?.some(isLowStock) && (
        <Alert.Root status="warning">
          <AlertIndicator>
            <FiAlertTriangle />
          </AlertIndicator>
          <AlertContent>
            <AlertTitle>Niski stan magazynowy</AlertTitle>
            <AlertDescription>
              Niektóre materiały wymagają uzupełnienia zapasów
            </AlertDescription>
          </AlertContent>
        </Alert.Root>
      )}

      {/* Materials Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        {filteredMaterials.map((material) => (
          <Card.Root key={material.id}>
            <Card.Header>
              <HStack justify="space-between" align="flex-start">
                <VStack gap={1} align="flex-start">
                  <Text fontWeight="bold" fontSize="lg">
                    {material.name}
                  </Text>
                  <Badge variant="subtle" colorPalette="blue">
                    {material.category}
                  </Badge>
                </VStack>
                <HStack gap={1}>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(material)}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => handleDelete(material)}
                    loading={deleteMaterialMutation.isPending}
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                {/* Stock Information */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium">Stan magazynowy</Text>
                    <Text fontSize="sm" color={getStockColor(material)}>
                      {material.stock} {material.unit}
                    </Text>
                  </HStack>
                  <Progress.Root 
                    value={(material.stock / (material.minStock * 3)) * 100} 
                    colorPalette={getStockColor(material)}
                    size="sm"
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    Min: {material.minStock} {material.unit}
                  </Text>
                </Box>

                {/* Price */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Cena:</Text>
                  <Text fontWeight="medium">{formatCurrency(material.price)}</Text>
                </HStack>

                {/* Supplier */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Dostawca:</Text>
                  <Text fontSize="sm">{material.supplier}</Text>
                </HStack>

                {/* Low Stock Warning */}
                {isLowStock(material) && (
                  <Alert.Root status="warning" size="sm">
                    <AlertIndicator>
                      <FiAlertTriangle />
                    </AlertIndicator>
                    <AlertContent>
                      <AlertDescription fontSize="xs">
                        Niski stan magazynowy
                      </AlertDescription>
                    </AlertContent>
                  </Alert.Root>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {/* Error Alert */}
      {deleteMaterialMutation.isError && (
        <Alert.Root status="error">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Błąd usuwania materiału</AlertTitle>
            <AlertDescription>
              {deleteMaterialMutation.error?.message || 'Wystąpił błąd podczas usuwania'}
            </AlertDescription>
          </AlertContent>
        </Alert.Root>
      )}
    </VStack>
  );
};
