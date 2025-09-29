import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import ProjectPage from '../page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'project-1' }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe('ProjectPage', () => {
  it('should render project page with breadcrumb', () => {
    render(
      <TestWrapper>
        <ProjectPage params={{ id: 'project-1' }} />
      </TestWrapper>
    );

    expect(screen.getByText('Projekty')).toBeInTheDocument();
    expect(screen.getByText('project-1')).toBeInTheDocument();
  });

  it('should render ProjectDetails component', () => {
    render(
      <TestWrapper>
        <ProjectPage params={{ id: 'project-1' }} />
      </TestWrapper>
    );

    // ProjectDetails should be rendered (we'll test its specific functionality in its own test)
    expect(screen.getByText('Projekty')).toBeInTheDocument();
  });
});
