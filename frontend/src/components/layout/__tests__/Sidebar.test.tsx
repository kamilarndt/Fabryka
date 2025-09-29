import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Sidebar } from '../Sidebar';

// Mock Next.js router
const mockPush = vi.fn();
const mockPathname = '/projects';
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navigation menu', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    expect(screen.getByText('NextFab')).toBeInTheDocument();
    expect(screen.getByText('Projekty')).toBeInTheDocument();
    expect(screen.getByText('Klienci')).toBeInTheDocument();
    expect(screen.getByText('Materiały')).toBeInTheDocument();
    expect(screen.getByText('Elementy')).toBeInTheDocument();
  });

  it('should highlight active menu item', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const projectsLink = screen.getByText('Projekty').closest('a');
    expect(projectsLink).toHaveClass('active');
  });

  it('should navigate to different pages', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const clientsLink = screen.getByText('Klienci');
    fireEvent.click(clientsLink);

    expect(mockPush).toHaveBeenCalledWith('/clients');
  });

  it('should show user profile section', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    expect(screen.getByText('Użytkownik')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('should handle logout', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Wyloguj');
    fireEvent.click(logoutButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should be collapsible on mobile', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle/i });
    expect(toggleButton).toBeInTheDocument();
  });
});
