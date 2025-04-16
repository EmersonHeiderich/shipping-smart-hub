
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  onReset: () => void;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  onReset,
}) => {
  return (
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
              onClick={onReset}
            >
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
