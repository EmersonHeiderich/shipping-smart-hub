
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, Edit2, Trash2, 
  ChevronLeft, ChevronRight, ShieldCheck, User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUsers, User as UserType } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function UsersPage() {
  const { users, isLoading, fetchUsers, createUser, updateUser, deleteUser, toggleUserActive } = useUsers();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const handleEditUser = (user: UserType) => {
    setEditingUser({
      ...user,
      isActive: true, // Por padrão, supondo que o usuário está ativo
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      toast({
        title: "Erro ao salvar usuário",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingUser.id) {
      // Update existing user
      const userData: Partial<UserType> = {
        name: editingUser.name,
        role: editingUser.role
      };

      if (editingUser.password && editingUser.password === editingUser.confirmPassword) {
        userData.password = editingUser.password;
      } else if (editingUser.password && editingUser.password !== editingUser.confirmPassword) {
        toast({
          title: "Erro ao atualizar usuário",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return;
      }

      const success = await updateUser(editingUser.id, userData);
      if (success) {
        setOpenDialog(false);
      }
    } else {
      // Add new user
      if (!editingUser.password) {
        toast({
          title: "Erro ao criar usuário",
          description: "A senha é obrigatória para novos usuários",
          variant: "destructive",
        });
        return;
      }

      if (editingUser.password !== editingUser.confirmPassword) {
        toast({
          title: "Erro ao criar usuário",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
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

  const handleDeleteUser = async () => {
    if (editingUser?.id) {
      const success = await deleteUser(editingUser.id);
      if (success) {
        setOpenDeleteDialog(false);
      }
    }
  };

  const confirmDeleteUser = (user: UserType) => {
    setEditingUser(user);
    setOpenDeleteDialog(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await toggleUserActive(id, !currentStatus);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

        <Card className="card-material">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Buscar por nome ou email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="field-material"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="field-material">
                  <SelectValue placeholder="Perfil de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os perfis</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-material overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Último acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-full ${getRoleBadgeClass(user.role)}`}>
                            {user.role === 'admin' ? 'Administrador' : 'Operador'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={true} // Placeholder, precisamos da informação real de status
                              onCheckedChange={() => handleToggleActive(user.id, true)} // Placeholder
                              className="mr-2"
                            />
                            <span className="text-green-600">
                              Ativo
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                              onClick={() => handleEditUser(user)}
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => confirmDeleteUser(user)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{indexOfFirstUser + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{" "}
                de <span className="font-medium">{filteredUsers.length}</span> usuários
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = currentPage === 1 
                    ? i + 1 
                    : currentPage === totalPages 
                    ? totalPages - 2 + i 
                    : currentPage - 1 + i;
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={i}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Nome
              </Label>
              <Input
                id="userName"
                value={editingUser?.name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="col-span-3 field-material"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userEmail" className="text-right">
                Email
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="col-span-3 field-material"
                disabled={editingUser?.id} // Não permitir editar email de usuários existentes
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userRole" className="text-right">
                Perfil
              </Label>
              <Select 
                value={editingUser?.role || 'operator'} 
                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
              >
                <SelectTrigger className="col-span-3 field-material">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Password fields - not required for edit */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userPassword" className="text-right">
                Senha
              </Label>
              <Input
                id="userPassword"
                type="password"
                value={editingUser?.password || ''}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                className="col-span-3 field-material"
                placeholder={editingUser?.id ? "(Deixe em branco para manter)" : ""}
                required={!editingUser?.id}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userConfirmPassword" className="text-right">
                Confirmar Senha
              </Label>
              <Input
                id="userConfirmPassword"
                type="password"
                value={editingUser?.confirmPassword || ''}
                onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
                className="col-span-3 field-material"
                placeholder={editingUser?.id ? "(Deixe em branco para manter)" : ""}
                required={!editingUser?.id}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  checked={editingUser?.isActive}
                  onCheckedChange={(checked) => 
                    setEditingUser({ ...editingUser, isActive: checked })
                  }
                />
                <span>
                  {editingUser?.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveUser} 
              className="btn-material-primary"
              disabled={
                !editingUser?.name || 
                !editingUser?.email || 
                (!editingUser?.id && !editingUser?.password) ||
                (editingUser?.password && editingUser?.password !== editingUser?.confirmPassword)
              }
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário {editingUser?.name} será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
