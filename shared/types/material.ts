export interface Material {
  id: string;
  name: string;
  sku: string;
  category: string[];
  specification: MaterialSpecification;
  unit: MaterialUnit;
  default_price: number;
  created_at: string;
  updated_at: string;
}

export type MaterialUnit = 'szt' | 'm' | 'm2' | 'kg' | 'l' | 'm3';

export interface MaterialSpecification {
  thickness?: number;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  color?: string;
  finish?: string;
  grade?: string;
  [key: string]: any;
}

export interface CreateMaterialData {
  name: string;
  sku: string;
  category: string[];
  specification?: MaterialSpecification;
  unit: MaterialUnit;
  default_price: number;
}

export interface UpdateMaterialData {
  name?: string;
  sku?: string;
  category?: string[];
  specification?: MaterialSpecification;
  unit?: MaterialUnit;
  default_price?: number;
}

export interface MaterialSearchFilters {
  category?: string[];
  unit?: MaterialUnit[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}