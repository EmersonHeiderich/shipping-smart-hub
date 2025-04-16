
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User } from "@/hooks/useUsers";

interface UserFormData {
  id: string | null;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserFormData;
  setUserData: (data: UserFormData) => void;
  onSave: () => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  userData,
  setUserData,
  onSave,
}) => {
  const isNewUser = !userData.id;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{userData.id ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
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
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
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
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="col-span-3 field-material"
              disabled={!isNewUser} // Não permitir editar email de usuários existentes
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userRole" className="text-right">
              Perfil
            </Label>
            <Select 
              value={userData.role} 
              onValueChange={(value: 'admin' | 'operator') => setUserData({ ...userData, role: value })}
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
          {/* Password fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userPassword" className="text-right">
              Senha
            </Label>
            <Input
              id="userPassword"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="col-span-3 field-material"
              placeholder={!isNewUser ? "(Deixe em branco para manter)" : ""}
              required={isNewUser}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userConfirmPassword" className="text-right">
              Confirmar Senha
            </Label>
            <Input
              id="userConfirmPassword"
              type="password"
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              className="col-span-3 field-material"
              placeholder={!isNewUser ? "(Deixe em branco para manter)" : ""}
              required={isNewUser}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Status
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                checked={userData.isActive}
                onCheckedChange={(checked) => 
                  setUserData({ ...userData, isActive: checked })
                }
              />
              <span>
                {userData.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={onSave} 
            className="btn-material-primary"
            disabled={
              !userData.name || 
              !userData.email || 
              (isNewUser && !userData.password) ||
              (userData.password && userData.password !== userData.confirmPassword)
            }
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
