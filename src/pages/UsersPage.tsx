
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUsers, User } from "@/hooks/useUsers";
import { UserFilterBar } from "@/components/users/UserFilterBar";
import { UserTable } from "@/components/users/UserTable";
import { UserPagination } from "@/components/users/UserPagination";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UserDeleteDialog } from "@/components/users/UserDeleteDialog";

interface UserFormData {
  id: string | null;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

export default function UsersPage() {
  const { users, isLoading, fetchUsers, createUser, updateUser, deleteUser, toggleUserActive } = useUsers();
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // State for user dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData>({
    id: null,
    name: '',
    email: '',
    role: 'operator',
    isActive: true,
    password: '',
    confirmPassword: ''
  });
  
  // State for delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === "all" || user.role === roleFilter;
      
    return matchesSearch && matchesRole;
  });

  // Paginate users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handler functions
  const handleAddUser = () => {
    setEditingUser({
      id: null,
      name: '',
      email: '',
      role: 'operator',
      isActive: true,
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: true, // Placeholder, using default value
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      return;
    }

    if (editingUser.id) {
      // Update existing user
      const success = await updateUser(editingUser.id, {
        name: editingUser.name,
        role: editingUser.role,
        password: editingUser.password || undefined
      });
      
      if (success) {
        setOpenDialog(false);
      }
    } else {
      // Add new user
      if (!editingUser.password) {
        return;
      }

      const success = await createUser(
        editingUser.email, 
        editingUser.password, 
        editingUser.name, 
        editingUser.role
      );
      
      if (success) {
        setOpenDialog(false);
      }
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setOpenDeleteDialog(false);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await toggleUserActive(id, !currentStatus);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="btn-material-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <UserFilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onReset={resetFilters}
        />

        <Card className="card-material overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <UserTable 
              users={currentUsers}
              onEdit={handleEditUser}
              onDelete={confirmDeleteUser}
              onToggleActive={handleToggleActive}
            />
          )}
          
          <UserPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstUser={indexOfFirstUser}
            indexOfLastUser={indexOfLastUser}
            totalUsers={filteredUsers.length}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>

      {/* User Form Dialog */}
      <UserFormDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
        userData={editingUser}
        setUserData={setEditingUser}
        onSave={handleSaveUser}
      />

      {/* Delete User Confirmation Dialog */}
      <UserDeleteDialog 
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        user={userToDelete}
        onConfirm={handleDeleteUser}
      />
    </MainLayout>
  );
}
