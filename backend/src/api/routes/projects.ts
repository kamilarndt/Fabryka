import { Router, Request, Response } from 'express';
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
router.get('/', async (req: Request, res: Response) => {
  try {
    // Sprawdź czy baza danych jest dostępna
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (testError && testError.code === 'PGRST205') {
      // Baza danych nie ma tabel - zwróć mock dane
      console.log('Baza danych nie ma tabel - zwracam mock dane');
      return res.json({
        projects: [
          {
            id: 'proj-1',
            name: 'Stoisko Targowe 2025',
            project_number: 'P2025/01/01',
            status: 'active',
            client_id: 'client-1',
            client: {
              id: 'client-1',
              name: 'Klient ABC Sp. z o.o.',
              email: 'kontakt@klientabc.pl',
              phone: '+48 123 456 789',
            },
            location: {
              address: 'ul. Przykładowa 123',
              city: 'Kraków',
              postalCode: '30-001',
              country: 'Polska',
            },
            description: 'Stoisko targowe dla klienta ABC z elementami interaktywnymi',
            modules: ['overview', 'elements', 'quotation', 'schedule', 'files'],
            timeline: {
              startDate: '2025-02-01',
              endDate: '2025-03-15',
            },
            progress: 35,
            budget: {
              planned: 50000,
              spent: 17500,
              remaining: 32500,
            },
            created_at: '2025-01-15T10:00:00Z',
            updated_at: '2025-01-20T15:30:00Z',
            createdBy: 'user-1',
          },
          {
            id: 'proj-2',
            name: 'Wystawa Muzealna',
            project_number: 'P2025/01/02',
            status: 'completed',
            client_id: 'client-2',
            client: {
              id: 'client-2',
              name: 'Muzeum Narodowe',
              email: 'wystawy@muzeum.pl',
              phone: '+48 987 654 321',
            },
            location: {
              address: 'al. 3 Maja 1',
              city: 'Kraków',
              postalCode: '30-062',
              country: 'Polska',
            },
            description: 'Wystawa czasowa z elementami multimedialnymi',
            modules: ['overview', 'elements', 'quotation', 'files', 'materials'],
            timeline: {
              startDate: '2024-11-01',
              endDate: '2024-12-31',
            },
            progress: 100,
            budget: {
              planned: 75000,
              spent: 72000,
              remaining: 3000,
            },
            created_at: '2024-10-15T09:00:00Z',
            updated_at: '2024-12-31T18:00:00Z',
            createdBy: 'user-2',
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      });
    }

    const { 
      status, 
      search, 
      client, 
      modules, 
      sortBy = 'updated_at', 
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      startDate,
      endDate,
      city,
      radius
    } = req.query;
    
    // Parse query parameters
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    // Build query with joins for client data
    let query = supabase
      .from('projects')
      .select(`
        *,
        clients!inner(
          id,
          name,
          tax_id,
          address
        )
      `);
    
    // Apply filters
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query = query.in('status', statusArray);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,project_number.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (client) {
      const clientArray = Array.isArray(client) ? client : [client];
      query = query.in('client_id', clientArray);
    }
    
    if (modules) {
      const modulesArray = Array.isArray(modules) ? modules : [modules];
      query = query.overlaps('modules', modulesArray);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Apply sorting
    const ascending = sortOrder === 'asc';
    switch (sortBy) {
      case 'name':
        query = query.order('name', { ascending });
        break;
      case 'createdAt':
        query = query.order('created_at', { ascending });
        break;
      case 'updatedAt':
        query = query.order('updated_at', { ascending });
        break;
      case 'endDate':
        query = query.order('timeline->>endDate', { ascending });
        break;
      default:
        query = query.order('updated_at', { ascending: false });
    }
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      return res.status(500).json({ error: countError.message });
    }
    
    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Get contact persons for each client
    const clientIds = [...new Set((data || []).map((p: any) => p.client_id))];
    const { data: contacts } = await supabase
      .from('contact_persons')
      .select('*')
      .in('client_id', clientIds);
    
    // Create a map of client_id to contact person
    const contactsMap = new Map<string, any>();
    (contacts || []).forEach((contact: any) => {
      if (!contactsMap.has(contact.client_id)) {
        contactsMap.set(contact.client_id, contact);
      }
    });
    
    // Transform data to match frontend expectations
    const transformedData = (data || []).map((project: any) => {
      const contact = contactsMap.get(project.client_id);
      const clientAddress = project.clients?.address || {};
      
      return {
        ...project,
        client: {
          id: project.clients.id,
          name: project.clients.name,
          email: contact?.email || '',
          phone: contact?.phone || ''
        },
        location: {
          address: clientAddress.street || '',
          city: clientAddress.city || '',
          postalCode: clientAddress.zipCode || '',
          country: clientAddress.country || 'Polska'
        },
        progress: project.progress || 0,
        budget: project.budget || {
          planned: 0,
          spent: 0,
          remaining: 0
        }
      };
    });
    
    const total = count || 0;
    const pages = Math.ceil(total / limitNum);
    
    res.json({
      projects: transformedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects
router.post('/', async (req: Request, res: Response) => {
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
router.put('/:id', async (req: Request, res: Response) => {
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
router.delete('/:id', async (req: Request, res: Response) => {
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
