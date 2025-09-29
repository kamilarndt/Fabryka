import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  archiveProject,
  unarchiveProject,
  getProjectMetrics,
  getProjectsStats,
  getMockProjects
} from '../lib/api/projects';
import type { 
  Project, 
  ProjectFilters, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ProjectsResponse 
} from '../types/project';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  metrics: (id: string) => [...projectKeys.detail(id), 'metrics'] as const,
  stats: () => [...projectKeys.all, 'stats'] as const,
};

// Hook do pobierania listy projektów
export const useProjects = (filters: ProjectFilters = {}, initialData?: ProjectsResponse) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => {
      // Używamy prawdziwego API
      return listProjects(filters);
    },
    initialData: initialData,
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 10 * 60 * 1000, // 10 minut (dawniej cacheTime)
    placeholderData: (previousData) => previousData, // Zachowaj poprzednie dane podczas ładowania nowych
  });
};

// Hook do pobierania szczegółów projektu
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id, // Tylko jeśli ID jest dostępne
    staleTime: 5 * 60 * 1000,
  });
};

// Hook do pobierania metryk projektu
export const useProjectMetrics = (id: string) => {
  return useQuery({
    queryKey: projectKeys.metrics(id),
    queryFn: () => getProjectMetrics(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minuty - metryki mogą się częściej zmieniać
  });
};

// Hook do pobierania statystyk globalnych
export const useProjectsStats = () => {
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn: getProjectsStats,
    staleTime: 10 * 60 * 1000, // 10 minut - statystyki rzadko się zmieniają
  });
};

// Hook do tworzenia projektu
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: (newProject) => {
      // Inwaliduj listę projektów
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      // Inwaliduj statystyki
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
      
      // Dodaj nowy projekt do cache
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
    },
    onError: (error) => {
      console.error('Błąd podczas tworzenia projektu:', error);
    },
  });
};

// Hook do aktualizacji projektu
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) => 
      updateProject(id, data),
    onSuccess: (updatedProject) => {
      // Aktualizuj szczegóły projektu w cache
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      
      // Inwaliduj listę projektów
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      // Inwaliduj metryki projektu
      queryClient.invalidateQueries({ queryKey: projectKeys.metrics(updatedProject.id) });
      
      // Inwaliduj statystyki
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
    onError: (error) => {
      console.error('Błąd podczas aktualizacji projektu:', error);
    },
  });
};

// Hook do usuwania projektu
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: (_, deletedId) => {
      // Usuń projekt z cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
      
      // Inwaliduj listę projektów
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      // Inwaliduj statystyki
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
    onError: (error) => {
      console.error('Błąd podczas usuwania projektu:', error);
    },
  });
};

// Hook do archiwizacji projektu
export const useArchiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveProject(id),
    onSuccess: (archivedProject) => {
      // Aktualizuj projekt w cache
      queryClient.setQueryData(projectKeys.detail(archivedProject.id), archivedProject);
      
      // Inwaliduj listę projektów
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      // Inwaliduj statystyki
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
    onError: (error) => {
      console.error('Błąd podczas archiwizacji projektu:', error);
    },
  });
};

// Hook do przywracania projektu z archiwum
export const useUnarchiveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unarchiveProject(id),
    onSuccess: (unarchivedProject) => {
      // Aktualizuj projekt w cache
      queryClient.setQueryData(projectKeys.detail(unarchivedProject.id), unarchivedProject);
      
      // Inwaliduj listę projektów
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      // Inwaliduj statystyki
      queryClient.invalidateQueries({ queryKey: projectKeys.stats() });
    },
    onError: (error) => {
      console.error('Błąd podczas przywracania projektu:', error);
    },
  });
};

// Hook do prefetchowania projektu
export const usePrefetchProject = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(id),
      queryFn: () => getProject(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Hook do optymistycznej aktualizacji projektu
export const useOptimisticUpdateProject = () => {
  const queryClient = useQueryClient();

  return (id: string, updates: Partial<Project>) => {
    // Optymistyczna aktualizacja
    queryClient.setQueryData(projectKeys.detail(id), (oldData: Project | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });

    // Inwaliduj listę projektów
    queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
  };
};

// Hook do wyszukiwania projektów z debounce
export const useProjectSearch = (searchTerm: string, delay: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return useProjects({ search: debouncedSearchTerm });
};

// Hook do filtrowania projektów po statusie
export const useProjectsByStatus = (status: string[]) => {
  return useProjects({ status: status as any });
};

// Hook do pobierania projektów klienta
export const useClientProjects = (clientId: string) => {
  return useProjects({ client: [clientId] });
};

// Hook do pobierania projektów w zakresie dat
export const useProjectsInDateRange = (startDate: string, endDate: string) => {
  return useProjects({ 
    dateRange: { start: startDate, end: endDate } 
  });
};

// Hook do pobierania aktywnych projektów
export const useActiveProjects = () => {
  return useProjectsByStatus(['active', 'paused']);
};

// Hook do pobierania zakończonych projektów
export const useCompletedProjects = () => {
  return useProjectsByStatus(['completed', 'archived']);
};

// Hook do pobierania projektów z określonymi modułami
export const useProjectsWithModules = (modules: string[]) => {
  return useProjects({ modules: modules as any });
};

// Hook do sortowania projektów
export const useSortedProjects = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  return useProjects({ sortBy: sortBy as any, sortOrder });
};

// Import useState i useEffect dla hooków z debounce
import { useState, useEffect } from 'react';
