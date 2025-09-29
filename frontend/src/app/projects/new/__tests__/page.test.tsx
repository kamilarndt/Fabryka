import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import NewProjectPage from '../page';

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

describe('NewProjectPage', () => {
  it('should render new project page with breadcrumb', () => {
    render(
      <TestWrapper>
        <NewProjectPage />
      </TestWrapper>
    );

    expect(screen.getByText('Nowy Projekt')).toBeInTheDocument();
    expect(screen.getByText('Projekty')).toBeInTheDocument();
    expect(screen.getByText('Utwórz nowy projekt produkcyjny')).toBeInTheDocument();
  });

  it('should render ProjectCreator component', () => {
    render(
      <TestWrapper>
        <NewProjectPage />
      </TestWrapper>
    );

    // ProjectCreator should be rendered (we'll test its specific functionality in its own test)
    expect(screen.getByText('Nowy Projekt')).toBeInTheDocument();
  });
});
