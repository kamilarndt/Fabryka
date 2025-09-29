export interface Project {
  id: string;
  name: string;
  project_number: string;
  status: ProjectStatus;
  client_id: string;
  modules: ProjectModule[];
  timeline: ProjectTimeline;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';

export type ProjectModule = 
  | 'overview' 
  | 'elements' 
  | 'quotation' 
  | 'logistics' 
  | 'crew' 
  | 'materials' 
  | 'concept' 
  | 'schedule' 
  | 'files' 
  | '3d_model';

export interface ProjectTimeline {
  startDate: string;
  endDate: string;
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
}

export interface CreateProjectData {
  name: string;
  project_number: string;
  client_id: string;
  modules?: ProjectModule[];
  timeline?: Partial<ProjectTimeline>;
}

export interface UpdateProjectData {
  name?: string;
  project_number?: string;
  status?: ProjectStatus;
  client_id?: string;
  modules?: ProjectModule[];
  timeline?: Partial<ProjectTimeline>;
}