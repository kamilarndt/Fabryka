/**
 * Material domain model
 * Based on docs/10_DATA_MODELS.md
 */

export interface Material {
  id: string;
  name: string;
  sku: string;
  category: string[];
  specification: {
    thickness?: number;
    width?: number;
    height?: number;
    color?: string;
  };
  unit: 'szt' | 'm' | 'm2' | 'kg';
  defaultPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialCreateInput {
  name: string;
  sku: string;
  category: string[];
  specification: {
    thickness?: number;
    width?: number;
    height?: number;
    color?: string;
  };
  unit: Material['unit'];
  defaultPrice: number;
}

export interface MaterialUpdateInput {
  name?: string;
  sku?: string;
  category?: string[];
  specification?: {
    thickness?: number;
    width?: number;
    height?: number;
    color?: string;
  };
  unit?: Material['unit'];
  defaultPrice?: number;
}

export interface MaterialFilters {
  search?: string;
  category?: string;
  unit?: Material['unit'];
  page?: number;
  limit?: number;
}

export interface MaterialListResponse {
  data: Material[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
