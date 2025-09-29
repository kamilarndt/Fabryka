import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listClients, getClient, createClient, updateClient, deleteClient } from '../lib/api/clients';
import type { Client, CreateClientRequest, UpdateClientRequest, ClientFilters } from '../types/client';

// Query Keys
const CLIENTS_QUERY_KEY = 'clients';
const CLIENT_QUERY_KEY = 'client';

// Hooks
export const useClients = (filters?: ClientFilters) => {
  return useQuery({
    queryKey: [CLIENTS_QUERY_KEY, filters],
    queryFn: () => listClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: [CLIENT_QUERY_KEY, id],
    queryFn: () => getClient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRequest) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
    },
  });
};
