/**
 * Project domain model
 * Based on docs/10_DATA_MODELS.md
 */

export interface Project {
  id: string;
  name: string;
  projectNumber: string;
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
  clientId: string;
  modules: string[];
  timeline: {
    startDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCreateInput {
  name: string;
  clientId: string;
  modules: string[];
  timeline?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface ProjectUpdateInput {
  name?: string;
  status?: Project['status'];
  modules?: string[];
  timeline?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface ProjectFilters {
  status?: Project['status'];
  search?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface ProjectListResponse {
  data: Project[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
