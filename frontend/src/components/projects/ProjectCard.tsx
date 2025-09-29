'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Button,
  HStack,
  VStack,
  Text,
  Progress,
  Box,
  IconButton,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiEye, 
  FiEdit, 
  FiMoreVertical, 
  FiArchive, 
  FiTrash2, 
  FiCalendar,
  FiMapPin,
  FiUser,
  FiTrendingUp,
  FiDollarSign
} from 'react-icons/fi';
import Link from 'next/link';
import type { Project } from '../../types/project';
import { PROJECT_STATUS_CONFIG } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onView?: (project: Project) => void;
  onArchive?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onView,
  onArchive,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG];
  
  // Formatowanie daty
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Formatowanie kwoty
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Obliczanie dni do końca
  const getDaysRemaining = () => {
    const endDate = new Date(project.timeline.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining < 0;
  const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;

  const handleView = () => {
    if (onView) {
      onView(project);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(project);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(project);
    }
  };

  if (compact) {
    return (
      <Card.Root size="sm" variant="outline" _hover={{ shadow: 'md' }}>
        <CardBody>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack gap={2}>
                <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                  {project.name}
                </Text>
                <Badge colorPalette={statusConfig.color} size="sm">
                  {statusConfig.label}
                </Badge>
              </HStack>
              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                {project.client.name}
              </Text>
              <HStack gap={3} fontSize="xs" color="gray.500">
                <HStack gap={1}>
                  <FiMapPin size={12} />
                  <Text>{project.location.city}</Text>
                </HStack>
                <HStack gap={1}>
                  <FiCalendar size={12} />
                  <Text>{formatDate(project.timeline.endDate)}</Text>
                </HStack>
              </HStack>
            </VStack>
            <VStack align="end" spacing={1}>
              <Text fontSize="sm" fontWeight="medium">
                {project.progress}%
              </Text>
              <Progress.Root value={project.progress} size="sm" width="60px">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </VStack>
          </HStack>
        </CardBody>
      </Card.Root>
    );
  }

  return (
    <Card.Root 
      size="md" 
      variant="outline" 
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <CardHeader>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2} flex={1}>
            <HStack gap={2} wrap="wrap">
              <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                {project.name}
              </Text>
              <Badge colorPalette={statusConfig.color} size="sm">
                {statusConfig.label}
              </Badge>
            </HStack>
            <HStack gap={1} color="gray.600">
              <FiUser size={14} />
              <Text fontSize="sm">{project.client.name}</Text>
            </HStack>
            {project.description && (
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {project.description}
              </Text>
            )}
          </VStack>
          
          {showActions && (
            <Menu.Root>
              <MenuTrigger asChild>
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Więcej opcji"
                >
                  <FiMoreVertical />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onClick={handleView}>
                  <FiEye />
                  Zobacz szczegóły
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                  <FiEdit />
                  Edytuj
                </MenuItem>
                <MenuSeparator />
                {project.status !== 'archived' ? (
                  <MenuItem onClick={handleArchive} color="orange.600">
                    <FiArchive />
                    Archiwizuj
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleEdit} color="green.600">
                    <FiEdit />
                    Przywróć
                  </MenuItem>
                )}
                <MenuItem onClick={handleDelete} color="red.600">
                  <FiTrash2 />
                  Usuń
                </MenuItem>
              </MenuContent>
            </Menu.Root>
          )}
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Informacje o lokalizacji i terminie */}
          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <HStack gap={1}>
              <FiMapPin size={14} />
              <Text>{project.location.city}</Text>
            </HStack>
            <HStack gap={1}>
              <FiCalendar size={14} />
              <Text 
                color={
                  isOverdue ? 'red.600' : 
                  isDueSoon ? 'orange.600' : 
                  'gray.600'
                }
              >
                {formatDate(project.timeline.endDate)}
                {isOverdue && ' (przeterminowany)'}
                {isDueSoon && !isOverdue && ' (wkrótce)'}
              </Text>
            </HStack>
          </HStack>

          {/* Pasek postępu */}
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

          {/* Informacje o budżecie */}
          {project.budget && (
            <HStack justify="space-between" fontSize="sm">
              <HStack gap={1} color="gray.600">
                <FiDollarSign size={14} />
                <Text>Budżet</Text>
              </HStack>
              <VStack align="end" spacing={0}>
                <Text fontWeight="medium">
                  {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.planned)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Pozostało: {formatCurrency(project.budget.remaining)}
                </Text>
              </VStack>
            </HStack>
          )}

          {/* Moduły projektu */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Aktywne moduły
            </Text>
            <HStack gap={1} wrap="wrap">
              {project.modules.slice(0, 4).map((module: string) => (
                <Badge key={module} variant="subtle" size="sm" colorPalette="blue">
                  {module}
                </Badge>
              ))}
              {project.modules.length > 4 && (
                <Badge variant="subtle" size="sm" colorPalette="gray">
                  +{project.modules.length - 4}
                </Badge>
              )}
            </HStack>
          </Box>
        </VStack>
      </CardBody>

      <CardFooter>
        <HStack gap={2} width="full">
          <Button
            variant="outline"
            size="sm"
            flex={1}
            onClick={handleView}
            leftIcon={<FiEye />}
          >
            Zobacz
          </Button>
          <Button
            variant="outline"
            size="sm"
            flex={1}
            onClick={handleEdit}
            leftIcon={<FiEdit />}
          >
            Edytuj
          </Button>
        </HStack>
      </CardFooter>
    </Card.Root>
  );
};

export default ProjectCard;