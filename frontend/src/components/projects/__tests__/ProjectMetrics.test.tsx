import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectMetrics } from '../ProjectMetrics';
import type { Project } from '../../../types/project';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

const mockProject: Project = {
  id: 'project-1',
  name: 'Test Project',
  project_number: 'P2025/TEST/01',
  status: 'active',
  client_id: 'client-1',
  client: {
    id: 'client-1',
    name: 'Klient ABC',
    email: 'abc@example.com',
    phone: '+48 123 456 789',
  },
  description: 'Test project description',
  modules: ['overview', 'elements'],
  timeline: {
    startDate: '2025-01-01',
    endDate: '2025-03-31',
  },
  progress: 45,
  budget: {
    planned: 100000,
    spent: 45000,
    remaining: 55000,
  },
  createdBy: 'user-1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

describe('ProjectMetrics', () => {
  it('should render project metrics', () => {
    render(
      <TestWrapper>
        <ProjectMetrics project={mockProject} />
      </TestWrapper>
    );

    expect(screen.getByText('Metryki Projektu')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('100 000 zł')).toBeInTheDocument();
    expect(screen.getByText('45 000 zł')).toBeInTheDocument();
    expect(screen.getByText('55 000 zł')).toBeInTheDocument();
  });

  it('should display progress bar with correct value', () => {
    render(
      <TestWrapper>
        <ProjectMetrics project={mockProject} />
      </TestWrapper>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
  });

  it('should display budget breakdown', () => {
    render(
      <TestWrapper>
        <ProjectMetrics project={mockProject} />
      </TestWrapper>
    );

    expect(screen.getByText('Budżet zaplanowany')).toBeInTheDocument();
    expect(screen.getByText('Wydane')).toBeInTheDocument();
    expect(screen.getByText('Pozostało')).toBeInTheDocument();
  });

  it('should display timeline information', () => {
    render(
      <TestWrapper>
        <ProjectMetrics project={mockProject} />
      </TestWrapper>
    );

    expect(screen.getByText('Data rozpoczęcia')).toBeInTheDocument();
    expect(screen.getByText('Data zakończenia')).toBeInTheDocument();
    expect(screen.getByText('1 stycznia 2025')).toBeInTheDocument();
    expect(screen.getByText('31 marca 2025')).toBeInTheDocument();
  });

  it('should handle project without budget', () => {
    const projectWithoutBudget = { ...mockProject, budget: undefined };

    render(
      <TestWrapper>
        <ProjectMetrics project={projectWithoutBudget} />
      </TestWrapper>
    );

    expect(screen.getByText('Metryki Projektu')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    // Budget section should not be displayed
    expect(screen.queryByText('Budżet zaplanowany')).not.toBeInTheDocument();
  });

  it('should display correct progress color for different progress values', () => {
    const lowProgressProject = { ...mockProject, progress: 20 };
    const highProgressProject = { ...mockProject, progress: 80 };

    const { rerender } = render(
      <TestWrapper>
        <ProjectMetrics project={lowProgressProject} />
      </TestWrapper>
    );

    expect(screen.getByText('20%')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ProjectMetrics project={highProgressProject} />
      </TestWrapper>
    );

    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
