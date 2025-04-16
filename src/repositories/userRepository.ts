
import { supabase } from '@/integrations/supabase/client';
import { User, UserCreateInput, UserUpdateInput } from '@/types/user';

export const userRepository = {
  async fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  },

  async createUser(userData: UserCreateInput): Promise<void> {
    // 1. Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: { name: userData.name }
    });
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }
    
    // 2. Update the user's role in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: userData.role })
      .eq('id', authData.user.id);
    
    if (updateError) throw updateError;
  },

  async updateUser(id: string, data: UserUpdateInput): Promise<void> {
    // Update user profile data
    if (data.name || data.role) {
      const updateData: { name?: string; role?: 'admin' | 'operator' } = {};
      if (data.name) updateData.name = data.name;
      if (data.role) updateData.role = data.role;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    }
    
    // If we need to update the password
    if (data.password) {
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        id,
        { password: data.password }
      );
      
      if (resetError) throw resetError;
    }
  },

  async toggleUserActive(id: string, isActive: boolean): Promise<void> {
    if (isActive) {
      // Activate user
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        { ban_duration: '0 seconds' }
      );
      
      if (error) throw error;
    } else {
      // Deactivate user (permanent ban)
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        { ban_duration: 'none' }
      );
      
      if (error) throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) throw error;
  }
};
