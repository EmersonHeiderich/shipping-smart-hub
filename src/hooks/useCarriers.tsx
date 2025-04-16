
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Carrier {
  id: number;
  name: string;
  api_endpoint: string;
  api_key: string;
  is_active: boolean;
}

export function useCarriers() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarriers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      setCarriers(data || []);
    } catch (error: any) {
      console.error('Error fetching carriers:', error);
      setError(error.message);
      toast({
        title: 'Erro ao carregar transportadoras',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  return {
    carriers,
    isLoading,
    error,
    refresh: fetchCarriers
  };
}
