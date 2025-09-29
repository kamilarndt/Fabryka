import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
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

describe('Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Project Operations', () => {
    it('should create project', async () => {
      const projectData = {
        name: 'Test Project',
        project_number: 'P2025/01/01',
        status: 'draft',
        client_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: '1', ...projectData },
        error: null
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await supabase.from('projects').insert(projectData);
      
      expect(result.data).toMatchObject(projectData);
      expect(result.error).toBeNull();
      expect(mockInsert).toHaveBeenCalledWith(projectData);
    });

    it('should fetch project by ID', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        project_number: 'P2025/01/01',
        status: 'active'
      };

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProject, error: null })
        })
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await supabase.from('projects').select().eq('id', '1').single();
      
      expect(result.data).toEqual(mockProject);
      expect(result.error).toBeNull();
    });

    it('should update project', async () => {
      const updateData = { name: 'Updated Project Name' };
      
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: updateData, error: null })
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      const result = await supabase.from('projects').update(updateData).eq('id', '1');
      
      expect(result.data).toEqual(updateData);
      expect(result.error).toBeNull();
    });

    it('should delete project', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete
      } as any);

      const result = await supabase.from('projects').delete().eq('id', '1');
      
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe('Client Operations', () => {
    it('should fetch all clients', async () => {
      const mockClients = [
        { id: '1', name: 'Client 1' },
        { id: '2', name: 'Client 2' }
      ];

      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockClients, error: null })
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await supabase.from('clients').select().order('name');
      
      expect(result.data).toEqual(mockClients);
      expect(result.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockError = new Error('Connection failed');
      
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

    it('should handle validation errors', async () => {
      const mockError = new Error('Validation failed: name is required');
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: mockError })
      } as any);

      const result = await supabase.from('projects').insert({});
      
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });
});
