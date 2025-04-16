
import { useState } from 'react';
import { userRepository } from '@/repositories/userRepository';
import { toast } from '@/hooks/use-toast';
import { User, UserCreateInput, UserUpdateInput } from '@/types/user';

export type { User, UserCreateInput, UserUpdateInput } from '@/types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await userRepository.fetchUsers();
      setUsers(data);
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
      
      await userRepository.createUser({ email, password, name, role });
      
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
      
      await userRepository.updateUser(id, data);
      
      toast({
        title: 'Usuário atualizado com sucesso',
        description: `Os dados de ${data.name || 'usuário'} foram atualizados.`,
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
      
      await userRepository.toggleUserActive(id, isActive);
      
      toast({
        title: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      });
      
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
      
      await userRepository.deleteUser(id);
      
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
