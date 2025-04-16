
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TruckIcon, ClockIcon, MapPinIcon, CalendarIcon, PackageIcon } from "lucide-react";

interface TrackingHistoryItem {
  id: number;
  occurred_at: string;
  status_code: string;
  status_description: string;
  internal_code: string;
  location: string;
}

interface TrackingInfo {
  id: string;
  invoice_number: string;
  last_status: string;
  last_location: string;
  last_date: string;
  carrier: {
    name: string;
  };
  history: TrackingHistoryItem[];
}

export default function TrackingPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);

  const handleSearch = async () => {
    if (!invoiceNumber) {
      toast({
        title: "Erro",
        description: "Por favor, informe o número da nota fiscal.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // First, check if we already have tracking data for this invoice
      const { data: tracking, error } = await supabase
        .from("tracking")
        .select(`
          id,
          invoice_number,
          last_status,
          last_location,
          last_date,
          carriers:carriers(name)
        `)
        .eq("invoice_number", invoiceNumber)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (tracking) {
        // If we have tracking, get its history
        const { data: history, error: historyError } = await supabase
          .from("tracking_history")
          .select("*")
          .eq("tracking_id", tracking.id)
          .order("occurred_at", { ascending: false });

        if (historyError) throw historyError;

        setTrackingInfo({
          ...tracking,
          carrier: tracking.carriers,
          history: history || [],
        });
      } else {
        // In a real app, this would make an API call to the carrier API
        // For now, we'll just show a message
        toast({
          title: "Nota fiscal não encontrada",
          description: "Nenhum registro de rastreio encontrado para esta nota fiscal.",
          variant: "destructive",
        });
        setTrackingInfo(null);
      }
    } catch (error: any) {
      console.error("Error searching tracking:", error);
      toast({
        title: "Erro ao buscar informações",
        description: error.message || "Ocorreu um erro ao buscar informações de rastreio.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColorClass = (internalCode: string) => {
    switch (internalCode) {
      case "DELIVERED":
        return "bg-green-100 border-green-300 text-green-800";
      case "IN_TRANSIT":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getStatusIcon = (internalCode: string) => {
    switch (internalCode) {
      case "DELIVERED":
        return <PackageIcon className="h-5 w-5 text-green-600" />;
      case "IN_TRANSIT":
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case "PROCESSING":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rastreio de Envios</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o status das suas entregas
          </p>
        </div>

        <Card className="card-material">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Consultar Rastreio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Digite o número da nota fiscal"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="field-material"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !invoiceNumber}
                className="btn-material-primary"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {trackingInfo && (
          <div className="space-y-6">
            <Card className="card-material overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Nota Fiscal</div>
                    <div className="text-xl font-semibold">{trackingInfo.invoice_number}</div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <div className="text-sm text-muted-foreground">Transportadora</div>
                    <div className="font-medium">{trackingInfo.carrier.name}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status Atual</div>
                        <div className="font-medium">{trackingInfo.last_status || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Localização</div>
                        <div className="font-medium">{trackingInfo.last_location || "N/A"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Atualização</div>
                        <div className="font-medium">{formatDate(trackingInfo.last_date)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-4">Histórico de Rastreio</h3>
                  
                  {trackingInfo.history.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      Nenhum histórico de rastreio disponível
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trackingInfo.history.map((item, index) => (
                        <div 
                          key={item.id}
                          className={`border rounded-lg p-4 ${getStatusColorClass(item.internal_code)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getStatusIcon(item.internal_code)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <div className="font-semibold">{item.status_description}</div>
                                <div className="text-sm">{formatDate(item.occurred_at)}</div>
                              </div>
                              {item.location && (
                                <div className="flex items-center gap-1 mt-1 text-sm">
                                  <MapPinIcon className="h-4 w-4" />
                                  <span>{item.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
