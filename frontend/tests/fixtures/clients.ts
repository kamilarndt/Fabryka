import type { Client, ContactPerson } from '../../shared/types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Klient ABC Sp. z o.o.',
    tax_id: '1234567890',
    address: {
      street: 'ul. Przykładowa 123',
      city: 'Kraków',
      zipCode: '30-001',
      country: 'Polska'
    },
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Firma XYZ',
    tax_id: '0987654321',
    address: {
      street: 'ul. Testowa 456',
      city: 'Warszawa',
      zipCode: '00-001',
      country: 'Polska'
    },
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export const mockContactPersons: ContactPerson[] = [
  {
    id: 'contact-1',
    client_id: 'client-1',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@klientabc.pl',
    phone: '+48 123 456 789',
    position: 'Dyrektor',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'contact-2',
    client_id: 'client-2',
    name: 'Anna Nowak',
    email: 'anna.nowak@firmaxyz.pl',
    phone: '+48 987 654 321',
    position: 'Manager',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export const createMockClient = (overrides: Partial<Client> = {}): Client => ({
  id: 'new-client',
  name: 'New Test Client',
  tax_id: '1111111111',
  address: {
    street: 'ul. Testowa 999',
    city: 'Test City',
    zipCode: '99-999',
    country: 'Polska'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});
