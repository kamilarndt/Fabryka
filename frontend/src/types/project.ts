import type { Project as BaseProject, ProjectStatus as BaseProjectStatus, ProjectModule, ProjectTimeline, ProjectMilestone } from '../../../shared/types/project';

// Re-export shared types
export type { ProjectModule, ProjectTimeline, ProjectMilestone } from '../../../shared/types/project';

// Rozszerzone typy dla frontendu
export interface Project extends BaseProject {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  location: {
    address: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  description?: string;
  progress: number; // Postęp projektu (0-100)
  budget?: {
    planned: number;
    spent: number;
    remaining: number;
  };
  createdBy: string;
}

export type ProjectStatus = BaseProjectStatus | 'archived';

// Filtry dla wyszukiwania projektów
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus[];
  client?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  modules?: ProjectModule[];
  location?: {
    city?: string;
    radius?: number;
  };
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'endDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Odpowiedź API z paginacją
export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dane do tworzenia nowego projektu
export interface CreateProjectRequest {
  name: string;
  project_number: string;
  client_id: string;
  status?: ProjectStatus;
  description?: string;
  modules?: ProjectModule[];
  timeline?: any;
}

// Dane do aktualizacji projektu
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  clientId?: string;
  location?: Partial<Project['location']>;
  modules?: ProjectModule[];
  timeline?: Partial<ProjectTimeline>;
  progress?: number;
  budget?: Partial<Project['budget']>;
}

// Metryki projektu
export interface ProjectMetrics {
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
}

// Statusy z kolorami dla UI
export const PROJECT_STATUS_CONFIG = {
  draft: { label: 'Szkic', color: 'gray' as const },
  active: { label: 'Aktywny', color: 'green' as const },
  paused: { label: 'Wstrzymany', color: 'yellow' as const },
  completed: { label: 'Zakończony', color: 'blue' as const },
  cancelled: { label: 'Anulowany', color: 'red' as const },
  archived: { label: 'Zarchiwizowany', color: 'gray' as const },
} as const;

// Moduły z opisami
export const PROJECT_MODULE_CONFIG = {
  overview: { label: 'Przegląd', description: 'Dashboard i metryki projektu' },
  concept: { label: 'Koncepcja', description: 'Concept board i inspiracje' },
  elements: { label: 'Elementy', description: 'Zarządzanie kafelkami' },
  quotation: { label: 'Wycena', description: 'Kalkulacja kosztów' },
  schedule: { label: 'Harmonogram', description: 'Planowanie czasowe' },
  files: { label: 'Pliki', description: 'Zarządzanie dokumentami' },
  materials: { label: 'Materiały', description: 'Zarządzanie zapasami' },
  logistics: { label: 'Logistyka', description: 'Transport i montaż' },
  crew: { label: 'Załoga', description: 'Noclegi zespołów' },
  '3d_model': { label: 'Model 3D', description: 'Integracja ze Speckle' },
} as const;
