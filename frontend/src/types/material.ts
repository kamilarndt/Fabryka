export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  description?: string;
}

export interface UpdateMaterialRequest {
  name?: string;
  category?: string;
  unit?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  supplier?: string;
  description?: string;
}

export interface MaterialsResponse {
  data: Material[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface MaterialFilters {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'category' | 'stock' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Material categories
export const MATERIAL_CATEGORIES = [
  'Płyty',
  'Lakiery',
  'Łączniki',
  'Narzędzia',
  'Akcesoria',
  'Inne',
] as const;

export type MaterialCategory = typeof MATERIAL_CATEGORIES[number];

// Units
export const MATERIAL_UNITS = [
  'szt',
  'm',
  'm²',
  'm³',
  'kg',
  'l',
  'opak',
] as const;

export type MaterialUnit = typeof MATERIAL_UNITS[number];
