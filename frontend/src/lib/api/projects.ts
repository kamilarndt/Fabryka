import type { 
  Project, 
  ProjectsResponse, 
  ProjectFilters, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '../../types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API Functions

/**
 * Pobiera listę projektów z opcjonalnymi filtrami
 */
export const listProjects = async (filters: ProjectFilters = {}): Promise<ProjectsResponse> => {
  const searchParams = new URLSearchParams();
  
  // Dodaj parametry filtrowania
  if (filters.search) searchParams.append('search', filters.search);
  if (filters.status?.length) searchParams.append('status', filters.status.join(','));
  if (filters.client?.length) searchParams.append('client', filters.client.join(','));
  if (filters.modules?.length) searchParams.append('modules', filters.modules.join(','));
  if (filters.sortBy) searchParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) searchParams.append('sortOrder', filters.sortOrder);
  if (filters.page) searchParams.append('page', filters.page.toString());
  if (filters.limit) searchParams.append('limit', filters.limit.toString());
  
  // Dodaj zakres dat
  if (filters.dateRange) {
    if (filters.dateRange.start) searchParams.append('startDate', filters.dateRange.start);
    if (filters.dateRange.end) searchParams.append('endDate', filters.dateRange.end);
  }
  
  // Dodaj lokalizację
  if (filters.location) {
    if (filters.location.city) searchParams.append('city', filters.location.city);
    if (filters.location.radius) searchParams.append('radius', filters.location.radius.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/projects${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ProjectsResponse>(endpoint);
};

/**
 * Pobiera szczegóły konkretnego projektu
 */
export const getProject = async (id: string): Promise<Project> => {
  return apiRequest<Project>(`/api/projects/${id}`);
};

/**
 * Tworzy nowy projekt
 */
export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  return apiRequest<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Aktualizuje istniejący projekt
 */
export const updateProject = async (id: string, data: UpdateProjectRequest): Promise<Project> => {
  return apiRequest<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Usuwa projekt
 */
export const deleteProject = async (id: string): Promise<{ success: boolean }> => {
  return apiRequest<{ success: boolean }>(`/api/projects/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Archiwizuje projekt
 */
export const archiveProject = async (id: string): Promise<Project> => {
  return updateProject(id, { status: 'archived' });
};

/**
 * Przywraca projekt z archiwum
 */
export const unarchiveProject = async (id: string): Promise<Project> => {
  return updateProject(id, { status: 'active' });
};

/**
 * Synchronizuje strukturę folderów projektu
 */
export const syncProjectFolders = async (
  id: string, 
  modules: string[], 
  action: 'add' | 'remove' | 'sync' = 'sync'
): Promise<{
  success: boolean;
  created: string[];
  removed: string[];
  errors: string[];
}> => {
  return apiRequest(`/api/projects/${id}/fs-sync`, {
    method: 'POST',
    body: JSON.stringify({ modules, action }),
  });
};

/**
 * Pobiera metryki projektu
 */
export const getProjectMetrics = async (id: string): Promise<{
  progress: number;
  budget: {
    planned: number;
    spent: number;
    remaining: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    currentPhase: string;
    daysRemaining: number;
  };
  elements: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  team: {
    assigned: number;
    active: number;
  };
}> => {
  return apiRequest(`/api/projects/${id}/metrics`);
};

/**
 * Pobiera statystyki globalne projektów
 */
export const getProjectsStats = async (): Promise<{
  projects: {
    active: number;
    completed: number;
    total: number;
  };
  revenue: {
    current: number;
    projected: number;
    growth: number;
  };
  clients: {
    total: number;
    active: number;
    new: number;
  };
  team: {
    utilization: number;
    capacity: number;
  };
}> => {
  return apiRequest('/api/projects/stats');
};

// Mock data for development/testing
export const mockProjects: Project[] = [
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
      milestones: [
        {
          id: 'milestone-1',
          name: 'Koncepcja',
          date: '2025-02-15',
          completed: true,
        },
        {
          id: 'milestone-2',
          name: 'Projektowanie',
          date: '2025-02-28',
          completed: false,
        },
        {
          id: 'milestone-3',
          name: 'Produkcja',
          date: '2025-03-10',
          completed: false,
        },
      ],
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
      milestones: [
        {
          id: 'milestone-4',
          name: 'Projekt',
          date: '2024-11-15',
          completed: true,
        },
        {
          id: 'milestone-5',
          name: 'Produkcja',
          date: '2024-12-15',
          completed: true,
        },
        {
          id: 'milestone-6',
          name: 'Montaż',
          date: '2024-12-31',
          completed: true,
        },
      ],
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
  },
  {
    id: 'proj-3',
    name: 'Event Corporate',
    project_number: 'P2025/01/03',
    status: 'paused',
    client_id: 'client-3',
    client: {
      id: 'client-3',
      name: 'TechCorp Solutions',
      email: 'events@techcorp.com',
      phone: '+48 555 123 456',
    },
    location: {
      address: 'ul. Biznesowa 456',
      city: 'Warszawa',
      postalCode: '00-001',
      country: 'Polska',
    },
    description: 'Event korporacyjny z elementami dekoracyjnymi',
    modules: ['overview', 'elements', 'quotation', 'logistics', 'crew'],
    timeline: {
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      milestones: [
        {
          id: 'milestone-7',
          name: 'Planowanie',
          date: '2025-03-15',
          completed: false,
        },
        {
          id: 'milestone-8',
          name: 'Realizacja',
          date: '2025-04-15',
          completed: false,
        },
      ],
    },
    progress: 15,
    budget: {
      planned: 100000,
      spent: 15000,
      remaining: 85000,
    },
    created_at: '2025-01-10T14:00:00Z',
    updated_at: '2025-01-25T11:20:00Z',
    createdBy: 'user-1',
  },
];

// Mock function for development
export const getMockProjects = async (filters: ProjectFilters = {}): Promise<ProjectsResponse> => {
  // Symulacja opóźnienia API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProjects = [...mockProjects];
  
  // Filtrowanie po wyszukiwaniu
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProjects = filteredProjects.filter(project => 
      project.name.toLowerCase().includes(searchLower) ||
      project.client.name.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower)
    );
  }
  
  // Filtrowanie po statusie
  if (filters.status?.length) {
    filteredProjects = filteredProjects.filter(project => 
      filters.status!.includes(project.status)
    );
  }
  
  // Filtrowanie po kliencie
  if (filters.client?.length) {
    filteredProjects = filteredProjects.filter(project => 
      filters.client!.includes(project.client_id)
    );
  }
  
  // Filtrowanie po modułach
  if (filters.modules?.length) {
    filteredProjects = filteredProjects.filter(project => 
      filters.modules!.some(module => project.modules.includes(module))
    );
  }
  
  // Sortowanie
  if (filters.sortBy) {
    filteredProjects.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'createdAt':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updatedAt':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'endDate':
          aValue = new Date(a.timeline.endDate);
          bValue = new Date(b.timeline.endDate);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }
  
  // Paginacja
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
  
  return {
    projects: paginatedProjects,
    pagination: {
      page,
      limit,
      total: filteredProjects.length,
      pages: Math.ceil(filteredProjects.length / limit),
    },
  };
};
