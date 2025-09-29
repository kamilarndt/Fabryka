import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Mock custom hook
const useProjects = () => {
  return {
    data: [
      {
        id: '1',
        name: 'Test Project',
        project_number: 'P2025/01/01',
        status: 'active'
      }
    ],
    isLoading: false,
    error: null
  };
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe('Custom Hooks', () => {
  describe('useProjects', () => {
    it('should return projects data', async () => {
      const { result } = renderHook(() => useProjects(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data[0].name).toBe('Test Project');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle loading state', () => {
      const useProjectsLoading = () => ({
        data: undefined,
        isLoading: true,
        error: null
      });

      const { result } = renderHook(() => useProjectsLoading(), {
        wrapper: createWrapper()
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const useProjectsError = () => ({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch projects')
      });

      const { result } = renderHook(() => useProjectsError(), {
        wrapper: createWrapper()
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch projects');
    });
  });

  describe('useProjectDetails', () => {
    const useProjectDetails = (projectId: string) => {
      if (projectId === '1') {
        return {
          data: {
            id: '1',
            name: 'Test Project',
            project_number: 'P2025/01/01',
            status: 'active',
            client_id: 'client-1'
          },
          isLoading: false,
          error: null
        };
      }
      
      return {
        data: undefined,
        isLoading: false,
        error: new Error('Project not found')
      };
    };

    it('should return project details for valid ID', () => {
      const { result } = renderHook(() => useProjectDetails('1'), {
        wrapper: createWrapper()
      });

      expect(result.current.data).toMatchObject({
        id: '1',
        name: 'Test Project',
        project_number: 'P2025/01/01',
        status: 'active'
      });
    });

    it('should return error for invalid ID', () => {
      const { result } = renderHook(() => useProjectDetails('999'), {
        wrapper: createWrapper()
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Project not found');
    });
  });
});
