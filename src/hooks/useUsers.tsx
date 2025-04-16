
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string | null;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
}

export interface UserUpdateInput {
  name?: string;
  role?: 'admin' | 'operator';
  password?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (email: string, password: string, name: string, role: 'admin' | 'operator') => {
    try {
      setIsLoading(true);
      
      // 1. Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Erro ao criar usuário');
      }
      
      // 2. Update the user's role in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', authData.user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Usuário criado com sucesso',
        description: `${name} foi adicionado como ${role === 'admin' ? 'Administrador' : 'Operador'}.`,
      });
      
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, data: UserUpdateInput) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          role: data.role
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // If we need to update the password
      if (data.password) {
        const { error: resetError } = await supabase.auth.admin.updateUserById(
          id,
          { password: data.password }
        );
        
        if (resetError) throw resetError;
      }
      
      toast({
        title: 'Usuário atualizado com sucesso',
        description: `Os dados de ${data.name} foram atualizados.`,
      });
      
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserActive = async (id: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      if (isActive) {
        // Activate user
        const { error } = await supabase.auth.admin.updateUserById(
          id,
          { ban_duration: '0 seconds' }
        );
        
        if (error) throw error;
        
        toast({
          title: 'Usuário ativado com sucesso',
        });
      } else {
        // Deactivate user (permanent ban)
        const { error } = await supabase.auth.admin.updateUserById(
          id,
          { ban_duration: 'none' }
        );
        
        if (error) throw error;
        
        toast({
          title: 'Usuário desativado com sucesso',
        });
      }
      
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      toast({
        title: `Erro ao ${isActive ? 'ativar' : 'desativar'} usuário`,
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;
      
      toast({
        title: 'Usuário excluído com sucesso',
      });
      
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserActive,
    deleteUser
  };
}
