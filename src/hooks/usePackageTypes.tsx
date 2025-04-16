
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PackageType {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  is_default: boolean;
}

export function usePackageTypes() {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackageTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('package_types')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');
      
      if (error) throw error;
      
      setPackageTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching package types:', error);
      setError(error.message);
      toast({
        title: 'Erro ao carregar embalagens',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePackageType = async (id: number, updates: Partial<PackageType>) => {
    try {
      const { data, error } = await supabase
        .from('package_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPackageTypes(prev => 
        prev.map(pkg => pkg.id === id ? { ...pkg, ...data } : pkg)
      );
      
      return data;
    } catch (error: any) {
      console.error('Error updating package type:', error);
      toast({
        title: 'Erro ao atualizar embalagem',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPackageTypes();
  }, []);

  return {
    packageTypes,
    isLoading,
    error,
    refresh: fetchPackageTypes,
    updatePackageType
  };
}
