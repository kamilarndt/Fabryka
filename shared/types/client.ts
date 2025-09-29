/**
 * Client domain model
 * Based on docs/10_DATA_MODELS.md
 */

export interface Client {
  id: string;
  name: string;
  contactPeople: ContactPerson[];
  taxId?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
}

export interface ClientCreateInput {
  name: string;
  contactPeople: Omit<ContactPerson, 'id'>[];
  taxId?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export interface ClientUpdateInput {
  name?: string;
  contactPeople?: ContactPerson[];
  taxId?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export interface ClientFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ClientListResponse {
  data: Client[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
