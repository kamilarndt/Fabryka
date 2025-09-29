import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listClients, getClient, createClient, updateClient, deleteClient } from '../clients';

// Mock fetch
global.fetch = vi.fn();

describe('Clients API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listClients', () => {
    it('should fetch clients list', async () => {
      const mockClients = [
        { id: 'client-1', name: 'Klient ABC' },
        { id: 'client-2', name: 'Klient XYZ' },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      });

      const result = await listClients();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/clients',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual(mockClients);
    });

    it('should handle API errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(listClients()).rejects.toThrow('Internal server error');
    });
  });

  describe('getClient', () => {
    it('should fetch single client', async () => {
      const mockClient = { id: 'client-1', name: 'Klient ABC' };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      });

      const result = await getClient('client-1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/clients/client-1',
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result).toEqual(mockClient);
    });
  });

  describe('createClient', () => {
    it('should create new client', async () => {
      const newClient = { name: 'Nowy Klient' };
      const createdClient = { id: 'client-3', name: 'Nowy Klient' };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => createdClient,
      });

      const result = await createClient(newClient);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/clients',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newClient),
        })
      );

      expect(result).toEqual(createdClient);
    });
  });

  describe('updateClient', () => {
    it('should update existing client', async () => {
      const updateData = { name: 'Zaktualizowany Klient' };
      const updatedClient = { id: 'client-1', name: 'Zaktualizowany Klient' };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedClient,
      });

      const result = await updateClient('client-1', updateData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/clients/client-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );

      expect(result).toEqual(updatedClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete client', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await deleteClient('client-1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/clients/client-1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
