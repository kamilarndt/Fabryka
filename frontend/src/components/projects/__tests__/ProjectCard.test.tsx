import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';
import type { Project } from '../../../types/project';

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
    endDate: '2025-03-01',
    milestones: []
  },
  budget: {
    planned: 100000,
    spent: 50000,
    remaining: 50000
  },
  client: {
    id: 'client-1',
    name: 'Test Client',
    email: 'client@test.com',
    phone: '+48123456789'
  },
  location: {
    address: 'Test Street 123',
    city: 'Warsaw',
    postalCode: '00-001',
    country: 'Poland'
  },
  description: 'Test project description',
  progress: 50,
  createdBy: 'user-1',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
};

const mockHandlers = {
  onEdit: vi.fn(),
  onView: vi.fn(),
  onArchive: vi.fn(),
  onDelete: vi.fn(),
};

describe('ProjectCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render project name', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('should render client name', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('Test Client')).toBeInTheDocument();
    });

    it('should render project status badge', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('Aktywny')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('Test project description')).toBeInTheDocument();
    });

    it('should render location city', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('Warsaw')).toBeInTheDocument();
    });

    it('should render progress percentage', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should render budget information when available', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('50 000,00 zł / 100 000,00 zł')).toBeInTheDocument();
      expect(screen.getByText('Pozostało: 50 000,00 zł')).toBeInTheDocument();
    });

    it('should render active modules', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('overview')).toBeInTheDocument();
      expect(screen.getByText('elements')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onView when view button is clicked', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const viewButton = screen.getByText('Zobacz');
      fireEvent.click(viewButton);
      expect(mockHandlers.onView).toHaveBeenCalledWith(mockProject);
    });

    it('should call onEdit when edit button is clicked', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const editButton = screen.getByText('Edytuj');
      fireEvent.click(editButton);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockProject);
    });

    it('should show archive option for non-archived projects', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const moreButton = screen.getByLabelText('Więcej opcji');
      fireEvent.click(moreButton);
      expect(screen.getByText('Archiwizuj')).toBeInTheDocument();
    });

    it('should show unarchive option for archived projects', () => {
      const archivedProject = { ...mockProject, status: 'archived' as const };
      render(<ProjectCard project={archivedProject} {...mockHandlers} />);
      const moreButton = screen.getByLabelText('Więcej opcji');
      fireEvent.click(moreButton);
      expect(screen.getByText('Przywróć')).toBeInTheDocument();
    });

    it('should call onArchive when archive is clicked', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const moreButton = screen.getByLabelText('Więcej opcji');
      fireEvent.click(moreButton);
      const archiveButton = screen.getByText('Archiwizuj');
      fireEvent.click(archiveButton);
      expect(mockHandlers.onArchive).toHaveBeenCalledWith(mockProject);
    });

    it('should call onDelete when delete is clicked', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const moreButton = screen.getByLabelText('Więcej opcji');
      fireEvent.click(moreButton);
      const deleteButton = screen.getByText('Usuń');
      fireEvent.click(deleteButton);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('Compact mode', () => {
    it('should render in compact mode when compact prop is true', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} compact />);
      // In compact mode, description should not be visible
      expect(screen.queryByText('Test project description')).not.toBeInTheDocument();
    });
  });

  describe('Status colors', () => {
    it('should render correct color for active status', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const statusBadge = screen.getByText('Aktywny');
      expect(statusBadge).toHaveClass('chakra-badge');
    });

    it('should render correct color for paused status', () => {
      const pausedProject = { ...mockProject, status: 'paused' as const };
      render(<ProjectCard project={pausedProject} {...mockHandlers} />);
      expect(screen.getByText('Wstrzymany')).toBeInTheDocument();
    });

    it('should render correct color for completed status', () => {
      const completedProject = { ...mockProject, status: 'completed' as const };
      render(<ProjectCard project={completedProject} {...mockHandlers} />);
      expect(screen.getByText('Zakończony')).toBeInTheDocument();
    });
  });

  describe('Date formatting', () => {
    it('should format end date correctly', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      expect(screen.getByText('01.03.2025')).toBeInTheDocument();
    });

    it('should show overdue warning for past dates', () => {
      const overdueProject = {
        ...mockProject,
        timeline: {
          ...mockProject.timeline,
          endDate: '2024-01-01'
        }
      };
      render(<ProjectCard project={overdueProject} {...mockHandlers} />);
      expect(screen.getByText('(przeterminowany)')).toBeInTheDocument();
    });

    it('should show due soon warning for dates within 7 days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueSoonProject = {
        ...mockProject,
        timeline: {
          ...mockProject.timeline,
          endDate: tomorrow.toISOString().split('T')[0]
        }
      };
      render(<ProjectCard project={dueSoonProject} {...mockHandlers} />);
      expect(screen.getByText('(wkrótce)')).toBeInTheDocument();
    });
  });

  describe('Progress bar', () => {
    it('should render progress bar with correct value', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('should handle zero progress', () => {
      const zeroProgressProject = { ...mockProject, progress: 0 };
      render(<ProjectCard project={zeroProgressProject} {...mockHandlers} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle 100% progress', () => {
      const fullProgressProject = { ...mockProject, progress: 100 };
      render(<ProjectCard project={fullProgressProject} {...mockHandlers} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Module display', () => {
    it('should show module count when more than 4 modules', () => {
      const manyModulesProject = {
        ...mockProject,
        modules: ['overview', 'elements', 'quotation', 'logistics', 'crew', 'materials']
      };
      render(<ProjectCard project={manyModulesProject} {...mockHandlers} />);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('Optional props', () => {
    it('should work without action handlers', () => {
      expect(() => {
        render(<ProjectCard project={mockProject} />);
      }).not.toThrow();
    });

    it('should hide actions when showActions is false', () => {
      render(<ProjectCard project={mockProject} {...mockHandlers} showActions={false} />);
      expect(screen.queryByLabelText('Więcej opcji')).not.toBeInTheDocument();
    });
  });
});
