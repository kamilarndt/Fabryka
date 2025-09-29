import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './supabase-mock';

const supabaseUrl = process.env.SUPABASE_URL || 'https://iwzsvxmttyanzsijlywm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3enN2eG10dHlhbnpzaWpseXdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1Mzc1MywiZXhwIjoyMDc0NzI5NzUzfQ.CjjNoYl7HxY9FBulvXF1fdXCyyDuJ-P_de4ALzkoSYk';

// Use mock client in test mode, real client otherwise
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
export const supabase = process.env.NODE_ENV === 'test' 
  ? (() => {
      console.log('Using mock Supabase client');
      return mockSupabase as any;
    })()
  : (() => {
      console.log('Using real Supabase client');
      return createClient(supabaseUrl, supabaseServiceKey);
    })();

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          project_number: string;
          status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
          client_id: string;
          modules: string[];
          timeline: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_number: string;
          status?: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
          client_id: string;
          modules?: string[];
          timeline?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          project_number?: string;
          status?: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
          client_id?: string;
          modules?: string[];
          timeline?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          tax_id: string | null;
          address: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tax_id?: string | null;
          address?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tax_id?: string | null;
          address?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category: string[];
          specification: any;
          unit: 'szt' | 'm' | 'm2' | 'kg';
          default_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          category?: string[];
          specification?: any;
          unit: 'szt' | 'm' | 'm2' | 'kg';
          default_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          category?: string[];
          specification?: any;
          unit?: 'szt' | 'm' | 'm2' | 'kg';
          default_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
