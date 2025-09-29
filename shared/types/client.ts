export interface Client {
  id: string;
  name: string;
  tax_id?: string;
  address?: ClientAddress;
  created_at: string;
  updated_at: string;
}

export interface ClientAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface ContactPerson {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientWithContacts extends Client {
  contact_people: ContactPerson[];
}

export interface CreateClientData {
  name: string;
  tax_id?: string;
  address?: ClientAddress;
}

export interface UpdateClientData {
  name?: string;
  tax_id?: string;
  address?: ClientAddress;
}

export interface CreateContactPersonData {
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
}

export interface UpdateContactPersonData {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
}