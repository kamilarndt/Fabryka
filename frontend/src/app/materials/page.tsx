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
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { MaterialList } from '../../components/materials/MaterialList';
import type { Material } from '../../types/material';

export default function MaterialsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleMaterialEdit = (material: Material) => {
    setEditingMaterial(material);
    // Open edit modal or navigate to edit page
  };

  const handleMaterialAdd = () => {
    setIsAddModalOpen(true);
    // Open add modal or navigate to add page
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="xl">
              Materiały
            </Heading>
            <Text color="gray.600" mt={2}>
              Zarządzaj materiałami i zapasami
            </Text>
          </Box>
          <Button
            colorPalette="blue"
            leftIcon={<FiPlus />}
            onClick={handleMaterialAdd}
          >
            Dodaj materiał
          </Button>
        </HStack>

        {/* Material List */}
        <MaterialList
          onMaterialEdit={handleMaterialEdit}
          onMaterialAdd={handleMaterialAdd}
        />

        {/* TODO: Add Material Modal */}
        {isAddModalOpen && (
          <Box>
            <Text>Modal dodawania materiału - do implementacji</Text>
            <Button onClick={() => setIsAddModalOpen(false)}>Zamknij</Button>
          </Box>
        )}

        {/* TODO: Edit Material Modal */}
        {editingMaterial && (
          <Box>
            <Text>Modal edycji materiału - do implementacji</Text>
            <Button onClick={() => setEditingMaterial(null)}>Zamknij</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
