'use client';

import React from 'react';
import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatValue,
  StatHelpText,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Project } from '../../types/project';

interface ProjectMetricsProps {
  project: Project;
}

export const ProjectMetrics: React.FC<ProjectMetricsProps> = ({ project }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: pl });
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'red';
    if (progress < 70) return 'yellow';
    return 'green';
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">Metryki Projektu</Heading>
      </Card.Header>
      <Card.Body>
        <VStack gap={6} align="stretch">
          {/* Progress */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="medium">Postęp</Text>
              <Badge colorPalette={getProgressColor(project.progress)}>
                {project.progress}%
              </Badge>
            </HStack>
            <Progress.Root value={project.progress} colorPalette={getProgressColor(project.progress)}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>

          {/* Budget */}
          {project.budget && (
            <Box>
              <Heading size="sm" mb={4}>Budżet</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Stat>
                  <StatLabel>Budżet zaplanowany</StatLabel>
                  <StatValue>{formatCurrency(project.budget.planned)}</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Wydane</StatLabel>
                  <StatValue color="red.500">{formatCurrency(project.budget.spent)}</StatValue>
                  <StatHelpText>
                    {((project.budget.spent / project.budget.planned) * 100).toFixed(1)}% budżetu
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Pozostało</StatLabel>
                  <StatValue color="green.500">{formatCurrency(project.budget.remaining)}</StatValue>
                </Stat>
              </SimpleGrid>
            </Box>
          )}

          {/* Timeline */}
          <Box>
            <Heading size="sm" mb={4}>Harmonogram</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Stat>
                <StatLabel>Data rozpoczęcia</StatLabel>
                <StatValue>{formatDate(project.timeline.startDate)}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Data zakończenia</StatLabel>
                <StatValue>{formatDate(project.timeline.endDate)}</StatValue>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Modules */}
          <Box>
            <Heading size="sm" mb={4}>Aktywne Moduły</Heading>
            <HStack gap={2} wrap="wrap">
              {project.modules.map((module) => (
                <Badge key={module} variant="subtle" colorPalette="blue">
                  {module}
                </Badge>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
