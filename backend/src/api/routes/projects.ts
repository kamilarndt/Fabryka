import { Router } from 'express';
import { supabase } from '../../lib/supabase';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  project_number: z.string().min(1, 'Project number is required'),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'cancelled']).default('draft'),
  client_id: z.string().uuid().optional(),
  modules: z.array(z.string()).optional().default([]),
  timeline: z.any().optional().default({})
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  project_number: z.string().min(1).optional(),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'cancelled']).optional(),
  client_id: z.string().uuid().optional(),
  modules: z.array(z.string()).optional(),
  timeline: z.any().optional()
});

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = supabase.from('projects').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    
    // If no client_id provided, get the first client from the database
    let clientId = validatedData.client_id;
    if (!clientId) {
      const { data: firstClient } = await supabase
        .from('clients')
        .select('id')
        .limit(1)
        .single();
      
      if (!firstClient) {
        return res.status(400).json({ error: 'No clients found. Please create a client first.' });
      }
      clientId = firstClient.id;
    }
    
    // Check if project number already exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('project_number', validatedData.project_number)
      .single();
    
    if (existingProject) {
      return res.status(409).json({ error: 'Project number already exists' });
    }
    
    const projectData = {
      ...validatedData,
      client_id: clientId
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);
    
    // Check if project exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // If updating project number, check for duplicates
    if (validatedData.project_number) {
      const { data: duplicateProject } = await supabase
        .from('projects')
        .select('id')
        .eq('project_number', validatedData.project_number)
        .neq('id', id)
        .single();
      
      if (duplicateProject) {
        return res.status(409).json({ error: 'Project number already exists' });
      }
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
