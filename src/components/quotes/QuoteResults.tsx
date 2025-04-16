
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Check, Info, TruckIcon, Clock, DollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuoteResult {
  id: number;
  carrier: string;
  price: number;
  percentage: number;
  deliveryTime: string;
  quoteNumber: string;
  modal: string;
  message?: string;
}

interface QuoteResultsProps {
  results: QuoteResult[];
  isLoading: boolean;
  onNewQuote: () => void;
}

export function QuoteResults({ results, isLoading, onNewQuote }: QuoteResultsProps) {
  const [view, setView] = useState('cards');

  // Sort results by price
  const sortedResults = [...results].sort((a, b) => a.price - b.price);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Obtendo cotações...</p>
      </div>
    );
  }

  if (sortedResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Nenhuma cotação disponível</p>
        <Button onClick={onNewQuote}>Nova Cotação</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cotações Recebidas</h2>
        <Tabs value={view} onValueChange={setView} className="w-auto">
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="cards">Cartões</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="cards" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedResults.map((quote, index) => (
            <Card 
              key={quote.id} 
              className={`overflow-hidden border-l-4 hover:shadow-md transition-shadow ${
                index === 0 ? 'border-l-primary-500' : 
                index === 1 ? 'border-l-secondary-500' : 
                'border-l-muted'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{quote.carrier}</h3>
                    <Badge variant="outline" className="mt-1">{quote.modal}</Badge>
                  </div>
                  {index === 0 && (
                    <Badge variant="default" className="bg-primary-500">Melhor Preço</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{quote.deliveryTime}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {quote.percentage.toFixed(2)}% sobre valor
                  </div>
                </div>
                
                <div className="text-lg font-bold mt-2 mb-3">
                  R$ {quote.price.toFixed(2)}
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Cotação: {quote.quoteNumber}</span>
                  {quote.message && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{quote.message}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/30 border-t flex justify-between p-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button 
                  size="sm"
                  className={index === 0 ? "btn-material-primary" : ""}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Selecionar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="table" className="mt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-4 py-2 text-left">Transportadora</th>
                <th className="border px-4 py-2 text-left">Modal</th>
                <th className="border px-4 py-2 text-left">Prazo</th>
                <th className="border px-4 py-2 text-right">% sobre Valor</th>
                <th className="border px-4 py-2 text-right">Preço (R$)</th>
                <th className="border px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((quote, index) => (
                <tr 
                  key={quote.id}
                  className={`${index === 0 ? 'bg-primary-50/30' : 'hover:bg-muted/20'}`}
                >
                  <td className="border px-4 py-2">
                    <div className="font-medium">{quote.carrier}</div>
                    <div className="text-xs text-muted-foreground">
                      Cotação: {quote.quoteNumber}
                    </div>
                  </td>
                  <td className="border px-4 py-2">{quote.modal}</td>
                  <td className="border px-4 py-2">{quote.deliveryTime}</td>
                  <td className="border px-4 py-2 text-right">{quote.percentage.toFixed(2)}%</td>
                  <td className="border px-4 py-2 text-right font-bold">
                    {quote.price.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        className={index === 0 ? "btn-material-primary" : ""}
                      >
                        Selecionar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </div>
  );
}
