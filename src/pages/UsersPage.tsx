
import React, { useState } from "react";
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

// Mock data for users
const mockUsers = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Usuário ${i + 1}`,
  email: `usuario${i + 1}@exemplo.com`,
  role: i % 3 === 0 ? 'Administrador' : i % 3 === 1 ? 'Operador' : 'Visualizador',
  department: i % 4 === 0 ? 'TI' : i % 4 === 1 ? 'Logística' : i % 4 === 2 ? 'Vendas' : 'Financeiro',
  lastLogin: i % 2 === 0 ? new Date().toLocaleDateString('pt-BR') : new Date(Date.now() - 86400000 * (i % 7 + 1)).toLocaleDateString('pt-BR'),
  isActive: i % 5 !== 0,
}));

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === "" || user.role === roleFilter;
      
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
      role: 'Visualizador',
      department: '',
      isActive: true,
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser({
      ...user,
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleSaveUser = () => {
    if (editingUser.id) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id ? {
          ...editingUser,
          lastLogin: u.lastLogin
        } : u
      ));
    } else {
      // Add new user
      setUsers([
        ...users,
        {
          ...editingUser,
          id: Math.max(...users.map(u => u.id), 0) + 1,
          lastLogin: 'Nunca'
        }
      ]);
    }
    setOpenDialog(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
      case 'Operador':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
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
                  <SelectItem value="">Todos os perfis</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Operador">Operador</SelectItem>
                  <SelectItem value="Visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-material overflow-hidden">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleToggleActive(user.id)}
                            className="mr-2"
                          />
                          <span className={user.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
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
                            onClick={() => handleDeleteUser(user.id)}
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userRole" className="text-right">
                Perfil
              </Label>
              <Select 
                value={editingUser?.role || 'Visualizador'} 
                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
              >
                <SelectTrigger className="col-span-3 field-material">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Operador">Operador</SelectItem>
                  <SelectItem value="Visualizador">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userDepartment" className="text-right">
                Departamento
              </Label>
              <Select 
                value={editingUser?.department || ''} 
                onValueChange={(value) => setEditingUser({ ...editingUser, department: value })}
              >
                <SelectTrigger className="col-span-3 field-material">
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
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
                (!editingUser?.id && (!editingUser?.password || !editingUser?.confirmPassword)) ||
                (!editingUser?.id && editingUser?.password !== editingUser?.confirmPassword)
              }
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
