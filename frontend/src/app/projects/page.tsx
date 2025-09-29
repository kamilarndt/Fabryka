import { Box, Container, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
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
            <Button colorPalette="blue">
              Nowy Projekt
            </Button>
          </Link>
        </HStack>

        <Box p={6} borderWidth={1} borderRadius="md" bg="gray.50">
          <Text textAlign="center" color="gray.500">
            Lista projektów będzie tutaj wyświetlana
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
