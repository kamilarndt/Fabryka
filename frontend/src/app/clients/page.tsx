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
import { ClientList } from '../../components/clients/ClientList';
import type { Client } from '../../types/client';

export default function ClientsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleClientEdit = (client: Client) => {
    setEditingClient(client);
    // Open edit modal or navigate to edit page
  };

  const handleClientAdd = () => {
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
              Klienci
            </Heading>
            <Text color="gray.600" mt={2}>
              Zarządzaj bazą klientów
            </Text>
          </Box>
          <Button
            colorPalette="blue"
            leftIcon={<FiPlus />}
            onClick={handleClientAdd}
          >
            Dodaj klienta
          </Button>
        </HStack>

        {/* Client List */}
        <ClientList
          onClientEdit={handleClientEdit}
          onClientAdd={handleClientAdd}
        />

        {/* TODO: Add Client Modal */}
        {isAddModalOpen && (
          <Box>
            <Text>Modal dodawania klienta - do implementacji</Text>
            <Button onClick={() => setIsAddModalOpen(false)}>Zamknij</Button>
          </Box>
        )}

        {/* TODO: Edit Client Modal */}
        {editingClient && (
          <Box>
            <Text>Modal edycji klienta - do implementacji</Text>
            <Button onClick={() => setEditingClient(null)}>Zamknij</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
