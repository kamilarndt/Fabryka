import type { Material, CreateMaterialRequest, UpdateMaterialRequest } from '../../types/material';

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
const mockMaterials: Material[] = [
  {
    id: 'material-1',
    name: 'Płyta MDF 18mm',
    category: 'Płyty',
    unit: 'm²',
    price: 45.50,
    stock: 120,
    minStock: 20,
    supplier: 'Dostawca ABC',
    description: 'Płyta MDF o grubości 18mm, idealna do mebli',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'material-2',
    name: 'Lakier bezbarwny',
    category: 'Lakiery',
    unit: 'l',
    price: 89.99,
    stock: 15,
    minStock: 5,
    supplier: 'Dostawca XYZ',
    description: 'Lakier bezbarwny do drewna, wysoka jakość',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 'material-3',
    name: 'Wkręty do drewna 4x50',
    category: 'Łączniki',
    unit: 'szt',
    price: 0.25,
    stock: 3,
    minStock: 10,
    supplier: 'Dostawca ABC',
    description: 'Wkręty do drewna, długość 50mm',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
  },
  {
    id: 'material-4',
    name: 'Płyta OSB 12mm',
    category: 'Płyty',
    unit: 'm²',
    price: 32.00,
    stock: 80,
    minStock: 15,
    supplier: 'Dostawca XYZ',
    description: 'Płyta OSB o grubości 12mm',
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
  },
];

// API Functions
export const listMaterials = async (): Promise<Material[]> => {
  // For now, return mock data. Later we'll replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMaterials), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Material[]>('/api/materials');
};

export const getMaterial = async (id: string): Promise<Material> => {
  // Mock implementation
  const material = mockMaterials.find(m => m.id === id);
  if (!material) {
    throw new Error('Material not found');
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(material), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Material>(`/api/materials/${id}`);
};

export const createMaterial = async (data: CreateMaterialRequest): Promise<Material> => {
  // Mock implementation
  const newMaterial: Material = {
    id: `material-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockMaterials.push(newMaterial);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(newMaterial), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Material>('/api/materials', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });
};

export const updateMaterial = async (id: string, data: UpdateMaterialRequest): Promise<Material> => {
  // Mock implementation
  const materialIndex = mockMaterials.findIndex(m => m.id === id);
  if (materialIndex === -1) {
    throw new Error('Material not found');
  }
  
  mockMaterials[materialIndex] = { 
    ...mockMaterials[materialIndex], 
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMaterials[materialIndex]), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<Material>(`/api/materials/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // });
};

export const deleteMaterial = async (id: string): Promise<void> => {
  // Mock implementation
  const materialIndex = mockMaterials.findIndex(m => m.id === id);
  if (materialIndex === -1) {
    throw new Error('Material not found');
  }
  
  mockMaterials.splice(materialIndex, 1);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
  
  // Real API call (uncomment when backend is ready):
  // return apiRequest<void>(`/api/materials/${id}`, {
  //   method: 'DELETE',
  // });
};
