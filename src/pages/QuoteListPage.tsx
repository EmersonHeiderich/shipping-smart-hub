
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, FilterIcon, ChevronLeft, 
  ChevronRight, Eye, Download, RefreshCw 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for quotes
const mockQuotes = Array.from({ length: 15 }, (_, i) => ({
  id: `QT-${2023000 + i}`,
  client: `Cliente ${String.fromCharCode(65 + (i % 10))}`,
  date: new Date(2023, 0, 1 + i).toLocaleDateString('pt-BR'),
  totalPackages: Math.floor(Math.random() * 10) + 1,
  totalWeight: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  value: parseFloat((Math.random() * 300 + 50).toFixed(2)),
  status: i % 5 === 0 ? 'Pendente' : i % 5 === 1 ? 'Aprovada' : i % 5 === 2 ? 'Cancelada' : 'Concluída',
  carrier: i % 3 === 0 ? 'Transportadora A' : i % 3 === 1 ? 'Transportadora B' : 'Transportadora C',
}));

export default function QuoteListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  // Filter quotes based on search term and status
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = 
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || quote.status === selectedStatus;
      
    return matchesSearch && matchesStatus;
  });

  // Paginate quotes
  const indexOfLastQuote = currentPage * itemsPerPage;
  const indexOfFirstQuote = indexOfLastQuote - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstQuote, indexOfLastQuote);
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consulta de Cotações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e acompanhe todas as cotações
            </p>
          </div>
          <Button
            onClick={() => navigate('/cotacao/nova')}
            className="btn-material-primary"
          >
            Nova Cotação
          </Button>
        </div>

        <Card className="card-material">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por ID ou cliente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="field-material pl-9"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="field-material">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                  }}
                >
                  Limpar
                </Button>
                <Button 
                  variant="default"
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Atualizar
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
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Volumes</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      Nenhuma cotação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  currentQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>{quote.client}</TableCell>
                      <TableCell>{quote.date}</TableCell>
                      <TableCell>{quote.totalPackages}</TableCell>
                      <TableCell>{quote.totalWeight}</TableCell>
                      <TableCell>{quote.carrier}</TableCell>
                      <TableCell>R$ {quote.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                            title="Exportar"
                          >
                            <Download className="h-4 w-4" />
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
                Mostrando <span className="font-medium">{indexOfFirstQuote + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastQuote, filteredQuotes.length)}
                </span>{" "}
                de <span className="font-medium">{filteredQuotes.length}</span> resultados
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageToShow = currentPage;
                  if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  
                  // Ensure we're showing valid page numbers
                  if (pageToShow > 0 && pageToShow <= totalPages) {
                    return (
                      <Button
                        key={i}
                        variant={pageToShow === currentPage ? "default" : "outline"}
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(pageToShow)}
                      >
                        {pageToShow}
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
    </MainLayout>
  );
}
