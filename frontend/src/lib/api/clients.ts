import type { Client, CreateClientRequest, UpdateClientRequest } from '../../types/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Mock data for development
const mockClients: Client[] = [
  { id: 'client-1', name: 'Klient ABC', email: 'abc@example.com', phone: '+48 123 456 789' },
  { id: 'client-2', name: 'Klient XYZ', email: 'xyz@example.com', phone: '+48 987 654 321' },
  { id: 'client-3', name: 'Fabryka Mebli', email: 'kontakt@fabryka-mebli.pl', phone: '+48 555 123 456' },
];

// API Functions
export const listClients = async (): Promise<Client[]> => {
  // For now, return mock data. Later we'll replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClients), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Client[]>('/api/clients');
};

export const getClient = async (id: string): Promise<Client> => {
  // Mock implementation
  const client = mockClients.find(c => c.id === id);
  if (!client) {
    throw new Error('Client not found');
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(client), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Client>(`/api/clients/${id}`);
};

export const createClient = async (data: CreateClientRequest): Promise<Client> => {
  // Mock implementation
  const newClient: Client = {
    id: `client-${Date.now()}`,
    ...data,
  };
  
  mockClients.push(newClient);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(newClient), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Client>('/api/clients', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });
};

export const updateClient = async (id: string, data: UpdateClientRequest): Promise<Client> => {
  // Mock implementation
  const clientIndex = mockClients.findIndex(c => c.id === id);
  if (clientIndex === -1) {
    throw new Error('Client not found');
  }
  
  mockClients[clientIndex] = { ...mockClients[clientIndex], ...data };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClients[clientIndex]), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Client>(`/api/clients/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // });
};

export const deleteClient = async (id: string): Promise<void> => {
  // Mock implementation
  const clientIndex = mockClients.findIndex(c => c.id === id);
  if (clientIndex === -1) {
    throw new Error('Client not found');
  }
  
  mockClients.splice(clientIndex, 1);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<void>(`/api/clients/${id}`, {
  //   method: 'DELETE',
  // });
};
