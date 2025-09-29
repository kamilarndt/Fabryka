import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../lib/api/materials';
import type { Material, CreateMaterialRequest, UpdateMaterialRequest, MaterialFilters } from '../types/material';

// Query Keys
const MATERIALS_QUERY_KEY = 'materials';
const MATERIAL_QUERY_KEY = 'material';

// Hooks
export const useMaterials = (filters?: MaterialFilters) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, filters],
    queryFn: () => listMaterials(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: [MATERIAL_QUERY_KEY, id],
    queryFn: () => getMaterial(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialRequest }) =>
      updateMaterial(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATERIAL_QUERY_KEY, id] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
    },
  });
};
