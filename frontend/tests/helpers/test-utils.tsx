import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
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

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const generateMockId = () => Math.random().toString(36).substr(2, 9);

export const generateMockDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const generateMockProjectNumber = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `P${year}/${month}/${random}`;
};

// Test assertions helpers
export const expectProjectToBeValid = (project: any) => {
  expect(project).toHaveProperty('id');
  expect(project).toHaveProperty('name');
  expect(project).toHaveProperty('project_number');
  expect(project).toHaveProperty('status');
  expect(project).toHaveProperty('client_id');
  expect(project).toHaveProperty('created_at');
  expect(project).toHaveProperty('updated_at');
};

export const expectClientToBeValid = (client: any) => {
  expect(client).toHaveProperty('id');
  expect(client).toHaveProperty('name');
  expect(client).toHaveProperty('created_at');
  expect(client).toHaveProperty('updated_at');
};
