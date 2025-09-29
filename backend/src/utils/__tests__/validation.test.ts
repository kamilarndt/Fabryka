import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Mock validation schemas
const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  project_number: z.string().min(1, 'Project number is required'),
  client_id: z.string().uuid('Invalid client ID format'),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'cancelled'])
});

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tax_id: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string()
  }).optional()
});

describe('Validation Schemas', () => {
  describe('Project Schema', () => {
    it('should validate correct project data', () => {
      const validProject = {
        name: 'Test Project',
        project_number: 'P2025/01/01',
        client_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'active' as const
      };

      expect(() => projectSchema.parse(validProject)).not.toThrow();
    });

    it('should reject invalid client_id format', () => {
      const invalidProject = {
        name: 'Test Project',
        project_number: 'P2025/01/01',
        client_id: 'invalid-uuid',
        status: 'active' as const
      };

      expect(() => projectSchema.parse(invalidProject)).toThrow();
    });

    it('should reject missing required fields', () => {
      const incompleteProject = {
        name: 'Test Project'
        // missing required fields
      };

      expect(() => projectSchema.parse(incompleteProject)).toThrow();
    });

    it('should reject invalid status', () => {
      const invalidStatusProject = {
        name: 'Test Project',
        project_number: 'P2025/01/01',
        client_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'invalid_status' as any
      };

      expect(() => projectSchema.parse(invalidStatusProject)).toThrow();
    });
  });

  describe('Client Schema', () => {
    it('should validate correct client data', () => {
      const validClient = {
        name: 'Test Client',
        tax_id: '1234567890',
        address: {
          street: 'Test Street 123',
          city: 'Test City',
          zipCode: '00-000',
          country: 'Poland'
        }
      };

      expect(() => clientSchema.parse(validClient)).not.toThrow();
    });

    it('should validate client with minimal data', () => {
      const minimalClient = {
        name: 'Test Client'
      };

      expect(() => clientSchema.parse(minimalClient)).not.toThrow();
    });

    it('should reject empty name', () => {
      const invalidClient = {
        name: ''
      };

      expect(() => clientSchema.parse(invalidClient)).toThrow();
    });
  });
});
