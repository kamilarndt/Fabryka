import { Box, Container, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="center">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            NextFab
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={8}>
            System Zarządzania Produkcją dla Fabryki Dekoracji
          </Text>
        </Box>

        <HStack gap={4} wrap="wrap" justify="center">
          <Link href="/projects">
            <Button colorPalette="blue" size="lg">
              Projekty
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
          <Link href="/elements">
            <Button colorPalette="purple" size="lg">
              Elementy
            </Button>
          </Link>
        </HStack>

        <Box textAlign="center" mt={8}>
          <Text fontSize="md" color="gray.500">
            Wersja 1.0.0 - W trakcie rozwoju
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
