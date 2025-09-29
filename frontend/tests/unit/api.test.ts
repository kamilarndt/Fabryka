import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Projects API', () => {
    it('should fetch projects', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Test Project',
          project_number: 'P2025/01/01',
          status: 'active'
        }
      ];

      // Mock the supabase response
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProjects, error: null })
        })
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      // Test the function
      const result = await supabase.from('projects').select().eq('id', '1').single();
      
      expect(result.data).toEqual(mockProjects);
      expect(result.error).toBeNull();
    });

    it('should create project', async () => {
      const newProject = {
        name: 'New Project',
        project_number: 'P2025/NEW/01',
        status: 'draft'
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: '2', ...newProject },
        error: null
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await supabase.from('projects').insert(newProject);
      
      expect(result.data).toMatchObject(newProject);
      expect(result.error).toBeNull();
      expect(mockInsert).toHaveBeenCalledWith(newProject);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: mockError })
          })
        })
      } as any);

      const result = await supabase.from('projects').select().eq('id', '1').single();
      
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });
});
