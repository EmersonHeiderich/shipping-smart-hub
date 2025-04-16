
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Client {
  id: number;
  code: string;
  cnpj: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message);
      toast({
        title: 'Erro ao carregar clientes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getClientByCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('code', code)
        .maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching client by code:', error);
      throw error;
    }
  };

  const getClientByCNPJ = async (cnpj: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('cnpj', cnpj)
        .maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching client by CNPJ:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refresh: fetchClients,
    getClientByCode,
    getClientByCNPJ
  };
}
