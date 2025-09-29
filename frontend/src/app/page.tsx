import { Container, Heading, Text, VStack, HStack, Button, Box, SimpleGrid, Card, CardHeader, CardBody, Badge, Progress } from '@chakra-ui/react';
import Link from 'next/link';
import { listProjectsServer } from '../lib/api/projects';
import type { ProjectFilters, Project } from '../types/project';

export default function HomePage() {
  // Na razie używamy statycznych danych
  const mockProjects = [
    {
      id: 'proj-1',
      name: 'Stoisko Targowe 2025',
      project_number: 'P2025/01/01',
      status: 'active',
      client_id: 'client-1',
      client: {
        id: 'client-1',
        name: 'Klient ABC Sp. z o.o.',
        email: 'kontakt@klientabc.pl',
        phone: '+48 123 456 789',
      },
      location: {
        address: 'ul. Przykładowa 123',
        city: 'Kraków',
        postalCode: '30-001',
        country: 'Polska',
      },
      description: 'Stoisko targowe dla klienta ABC z elementami interaktywnymi',
      modules: ['overview', 'elements', 'quotation', 'schedule', 'files'],
      timeline: {
        startDate: '2025-02-01',
        endDate: '2025-03-15',
      },
      progress: 35,
      budget: {
        planned: 50000,
        spent: 17500,
        remaining: 32500,
      },
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-20T15:30:00Z',
      createdBy: 'user-1',
    },
    {
      id: 'proj-2',
      name: 'Wystawa Muzealna',
      project_number: 'P2025/01/02',
      status: 'completed',
      client_id: 'client-2',
      client: {
        id: 'client-2',
        name: 'Muzeum Narodowe',
        email: 'wystawy@muzeum.pl',
        phone: '+48 987 654 321',
      },
      location: {
        address: 'al. 3 Maja 1',
        city: 'Kraków',
        postalCode: '30-062',
        country: 'Polska',
      },
      description: 'Wystawa czasowa z elementami multimedialnymi',
      modules: ['overview', 'elements', 'quotation', 'files', 'materials'],
      timeline: {
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      progress: 100,
      budget: {
        planned: 75000,
        spent: 72000,
        remaining: 3000,
      },
      created_at: '2024-10-15T09:00:00Z',
      updated_at: '2024-12-31T18:00:00Z',
      createdBy: 'user-2',
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Nagłówek */}
        <Box textAlign="center" mb={6}>
          <Heading as="h1" size="2xl" mb={4}>
            NextFab
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            System Zarządzania Produkcją dla Fabryki Dekoracji
          </Text>
          
          {/* Szybkie linki */}
          <HStack gap={4} wrap="wrap" justify="center">
            <Link href="/projects/new">
              <Button colorPalette="blue" size="lg">
                Nowy Projekt
              </Button>
            </Link>
            <Link href="/clients">
              <Button colorPalette="green" size="lg">
                Klienci
              </Button>
            </Link>
            <Link href="/materials">
              <Button colorPalette="orange" size="lg">
                Materiały
              </Button>
            </Link>
          </HStack>
        </Box>

        {/* Lista projektów */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Ostatnie Projekty
          </Heading>
          
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={6}
          >
            {mockProjects.map((project: Project) => (
                <Card.Root key={project.id} variant="outline" _hover={{ shadow: 'lg' }}>
                  <CardHeader>
                    <VStack align="start" spacing={2}>
                      <HStack gap={2} wrap="wrap">
                        <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                          {project.name}
                        </Text>
                        <Badge colorPalette={project.status === 'active' ? 'green' : project.status === 'completed' ? 'blue' : 'gray'} size="sm">
                          {project.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {project.client.name}
                      </Text>
                      {project.description && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {project.description}
                        </Text>
                      )}
                    </VStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Postęp projektu
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {project.progress}%
                          </Text>
                        </HStack>
                        <Progress.Root value={project.progress} size="md">
                          <Progress.Track>
                            <Progress.Range />
                          </Progress.Track>
                        </Progress.Root>
                      </Box>
                      <HStack justify="space-between" fontSize="sm" color="gray.600">
                        <Text>{project.location.city}</Text>
                        <Text>
                          {new Date(project.timeline.endDate).toLocaleDateString('pl-PL')}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card.Root>
            ))}
          </SimpleGrid>
        </Box>

        {/* Stopka */}
        <Box textAlign="center" mt={8} pt={6} borderTop="1px" borderColor="gray.200">
          <Text fontSize="md" color="gray.500">
            Wersja 1.0.0 - W trakcie rozwoju
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
