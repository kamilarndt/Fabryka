import type { Project } from '../../shared/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Projekt Stoisko 2025',
    project_number: 'P2025/01/15',
    status: 'active',
    client_id: 'client-1',
    modules: ['overview', 'elements', 'quotation'],
    timeline: {
      startDate: '2025-01-15',
      endDate: '2025-03-15'
    },
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Projekt Wystawa Targowa',
    project_number: 'P2025/02/01',
    status: 'draft',
    client_id: 'client-2',
    modules: ['overview', 'elements'],
    timeline: {
      startDate: '2025-02-01',
      endDate: '2025-04-01'
    },
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Projekt Biuro Modernizacja',
    project_number: 'P2025/03/01',
    status: 'completed',
    client_id: 'client-1',
    modules: ['overview', 'elements', 'quotation', 'logistics'],
    timeline: {
      startDate: '2025-03-01',
      endDate: '2025-05-01'
    },
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-05-01T00:00:00Z'
  }
];

export const createMockProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'new-project',
  name: 'New Test Project',
  project_number: 'P2025/TEST/01',
  status: 'draft',
  client_id: 'client-1',
  modules: ['overview'],
  timeline: {
    startDate: '2025-01-01',
    endDate: '2025-03-01'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});
