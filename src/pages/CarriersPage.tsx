
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
  CheckCircle, AlertTriangle, ChevronLeft, 
  ChevronRight, Settings 
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

// Mock data for carriers
const mockCarriers = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Transportadora ${String.fromCharCode(65 + (i % 10))}`,
  code: `TR${1000 + i}`,
  modals: i % 3 === 0 
    ? ['Rodoviário'] 
    : i % 3 === 1 
    ? ['Rodoviário', 'Aéreo'] 
    : ['Rodoviário', 'Aéreo', 'Marítimo'],
  apiUrl: `https://api.transportadora${String.fromCharCode(97 + (i % 10))}.com.br`,
  isActive: i % 4 !== 0,
  integration: i % 5 === 0 ? 'Em configuração' : 'Ativo',
}));

export default function CarriersPage() {
  const [carriers, setCarriers] = useState(mockCarriers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter carriers based on search term
  const filteredCarriers = carriers.filter(carrier => 
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate carriers
  const indexOfLastCarrier = currentPage * itemsPerPage;
  const indexOfFirstCarrier = indexOfLastCarrier - itemsPerPage;
  const currentCarriers = filteredCarriers.slice(indexOfFirstCarrier, indexOfLastCarrier);
  const totalPages = Math.ceil(filteredCarriers.length / itemsPerPage);

  const handleAddCarrier = () => {
    setEditingCarrier({
      id: null,
      name: '',
      code: '',
      modals: [],
      apiUrl: '',
      isActive: true,
      integration: 'Em configuração'
    });
    setOpenDialog(true);
  };

  const handleEditCarrier = (carrier: any) => {
    setEditingCarrier({ ...carrier });
    setOpenDialog(true);
  };

  const handleSaveCarrier = () => {
    if (editingCarrier.id) {
      // Update existing carrier
      setCarriers(carriers.map(c => 
        c.id === editingCarrier.id ? editingCarrier : c
      ));
    } else {
      // Add new carrier
      setCarriers([
        ...carriers,
        {
          ...editingCarrier,
          id: Math.max(...carriers.map(c => c.id), 0) + 1
        }
      ]);
    }
    setOpenDialog(false);
  };

  const handleDeleteCarrier = (id: number) => {
    setCarriers(carriers.filter(c => c.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setCarriers(carriers.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transportadoras</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as transportadoras e suas integrações
            </p>
          </div>
          <Button
            onClick={handleAddCarrier}
            className="btn-material-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Transportadora
          </Button>
        </div>

        <Card className="card-material">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  placeholder="Buscar por nome ou código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="field-material"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modais</TableHead>
                  <TableHead>URL da API</TableHead>
                  <TableHead>Integração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCarriers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma transportadora encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCarriers.map((carrier) => (
                    <TableRow key={carrier.id}>
                      <TableCell className="font-medium">{carrier.code}</TableCell>
                      <TableCell>{carrier.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {carrier.modals.map((modal: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-primary-50 dark:bg-primary-900/20">
                              {modal}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[200px]">
                        {carrier.apiUrl}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          carrier.integration === 'Ativo' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {carrier.integration}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={carrier.isActive}
                            onCheckedChange={() => handleToggleActive(carrier.id)}
                            className="mr-2"
                          />
                          <span className={carrier.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                            {carrier.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                            onClick={() => handleEditCarrier(carrier)}
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                            title="Configurar"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteCarrier(carrier.id)}
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
                Mostrando <span className="font-medium">{indexOfFirstCarrier + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCarrier, filteredCarriers.length)}
                </span>{" "}
                de <span className="font-medium">{filteredCarriers.length}</span> transportadoras
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

      {/* Add/Edit Carrier Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingCarrier?.id ? 'Editar Transportadora' : 'Nova Transportadora'}</DialogTitle>
            <DialogDescription>
              Preencha os dados da transportadora e configuração de integração
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrierCode" className="text-right">
                Código
              </Label>
              <Input
                id="carrierCode"
                value={editingCarrier?.code || ''}
                onChange={(e) => setEditingCarrier({ ...editingCarrier, code: e.target.value })}
                className="col-span-3 field-material"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrierName" className="text-right">
                Nome
              </Label>
              <Input
                id="carrierName"
                value={editingCarrier?.name || ''}
                onChange={(e) => setEditingCarrier({ ...editingCarrier, name: e.target.value })}
                className="col-span-3 field-material"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrierModals" className="text-right">
                Modais
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {['Rodoviário', 'Aéreo', 'Marítimo'].map((modal) => (
                  <Badge 
                    key={modal}
                    variant={editingCarrier?.modals?.includes(modal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentModals = editingCarrier?.modals || [];
                      const newModals = currentModals.includes(modal)
                        ? currentModals.filter((m: string) => m !== modal)
                        : [...currentModals, modal];
                      setEditingCarrier({ ...editingCarrier, modals: newModals });
                    }}
                  >
                    {modal}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrierApiUrl" className="text-right">
                URL da API
              </Label>
              <Input
                id="carrierApiUrl"
                value={editingCarrier?.apiUrl || ''}
                onChange={(e) => setEditingCarrier({ ...editingCarrier, apiUrl: e.target.value })}
                className="col-span-3 field-material"
                placeholder="https://api.exemplo.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  checked={editingCarrier?.isActive}
                  onCheckedChange={(checked) => 
                    setEditingCarrier({ ...editingCarrier, isActive: checked })
                  }
                />
                <span>
                  {editingCarrier?.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveCarrier} className="btn-material-primary">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
