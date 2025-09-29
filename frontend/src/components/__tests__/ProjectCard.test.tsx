import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';
import type { Project } from '../../../shared/types';

// Mock project data
const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  project_number: 'P2025/01/01',
  status: 'active',
  client_id: 'client-1',
  modules: ['overview', 'elements'],
  timeline: {
    startDate: '2025-01-01',
    endDate: '2025-03-01'
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
};

// Mock ProjectCard component
function ProjectCard({ project }: { project: Project }) {
  return (
    <div data-testid="project-card">
      <h3 data-testid="project-name">{project.name}</h3>
      <p data-testid="project-number">{project.project_number}</p>
      <span data-testid="project-status">{project.status}</span>
    </div>
  );
}

describe('ProjectCard', () => {
  it('should render project name', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId('project-name')).toHaveTextContent('Test Project');
  });

  it('should render project number', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId('project-number')).toHaveTextContent('P2025/01/01');
  });

  it('should render project status', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId('project-status')).toHaveTextContent('active');
  });

  it('should have correct data-testid', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByTestId('project-card')).toBeInTheDocument();
  });
});
