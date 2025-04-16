
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronRight, Package, User, 
  Box, Truck, Plus, MinusCircle 
} from "lucide-react";
import { PackageTypeAdjuster } from "@/components/quotes/PackageTypeAdjuster";
import { QuoteResults } from "@/components/quotes/QuoteResults";
import { usePackageTypes, PackageType } from "@/hooks/usePackageTypes";
import { useClients, Client } from "@/hooks/useClients";
import { useCarriers } from "@/hooks/useCarriers";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Step = 'client' | 'packages' | 'quotes';

interface PackageItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
}

interface ClientInfo {
  id?: number;
  code: string;
  cnpj: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  merchandiseValue: number;
}

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

export default function NewQuotePage() {
  const { user } = useAuth();
  const { packageTypes, isLoading: isLoadingPackages, updatePackageType } = usePackageTypes();
  const { getClientByCode, getClientByCNPJ } = useClients();
  const { carriers } = useCarriers();
  
  const [currentStep, setCurrentStep] = useState<Step>('client');
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    code: '',
    cnpj: '',
    merchandiseValue: 0
  });
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [customPackage, setCustomPackage] = useState<Omit<PackageItem, 'id' | 'quantity'>>({
    name: "Personalizada",
    length: 0,
    width: 0,
    height: 0,
    weight: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [quoteResults, setQuoteResults] = useState<QuoteResult[]>([]);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  // If we're on the quotes step and have no results yet, start a timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (currentStep === 'quotes' && quoteResults.length === 0 && carriers.length > 0) {
      // Simulate receiving quotes from carriers one by one
      let currentIndex = 0;
      
      intervalId = setInterval(() => {
        if (currentIndex < carriers.length) {
          const carrier = carriers[currentIndex];
          
          // Generate a random quote
          const price = parseFloat((Math.random() * 200 + 80).toFixed(2));
          const percentage = parseFloat(((price / clientInfo.merchandiseValue) * 100).toFixed(2));
          
          const newQuote: QuoteResult = {
            id: carrier.id,
            carrier: carrier.name,
            price,
            percentage,
            deliveryTime: `${Math.floor(Math.random() * 5) + 1} dias úteis`,
            quoteNumber: `QT-${Math.floor(Math.random() * 10000)}`,
            modal: Math.random() > 0.5 ? "Rodoviário" : "Aéreo",
            message: Math.random() > 0.7 ? "Seguro incluso no valor" : undefined
          };
          
          setQuoteResults(prev => [...prev, newQuote]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 1500); // Receive a new quote every 1.5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentStep, quoteResults.length, carriers, clientInfo.merchandiseValue]);

  const fetchClientByCode = async () => {
    try {
      const client = await getClientByCode(clientInfo.code);
      if (client) {
        setClientInfo({
          ...clientInfo,
          id: client.id,
          cnpj: client.cnpj,
          name: client.name,
          address: client.address,
          city: client.city,
          state: client.state,
          zip_code: client.zip_code
        });
      } else {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum cliente encontrado com este código.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao buscar cliente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchClientByCNPJ = async () => {
    try {
      const client = await getClientByCNPJ(clientInfo.cnpj);
      if (client) {
        setClientInfo({
          ...clientInfo,
          id: client.id,
          code: client.code || '',
          name: client.name,
          address: client.address,
          city: client.city,
          state: client.state,
          zip_code: client.zip_code
        });
      } else {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum cliente encontrado com este CNPJ.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao buscar cliente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addPredefinedPackage = (packageTemplate: PackageType, quantity: number = 1) => {
    const newItem: PackageItem = {
      id: Math.random().toString(36).substring(2, 11),
      name: packageTemplate.name,
      length: packageTemplate.length,
      width: packageTemplate.width,
      height: packageTemplate.height,
      weight: packageTemplate.weight,
      quantity
    };
    
    setPackageItems([...packageItems, newItem]);
  };

  const addCustomPackage = () => {
    if (customPackage.length && customPackage.width && customPackage.height && customPackage.weight) {
      const newItem: PackageItem = {
        ...customPackage,
        id: Math.random().toString(36).substring(2, 11),
        quantity: 1
      };
      
      setPackageItems([...packageItems, newItem]);
      setShowCustomForm(false);
    }
  };

  const removePackage = (id: string) => {
    setPackageItems(packageItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setPackageItems(
      packageItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleNextStep = () => {
    if (currentStep === 'client') {
      setCurrentStep('packages');
    } else if (currentStep === 'packages') {
      requestQuotes();
    }
  };

  const requestQuotes = async () => {
    try {
      setIsLoading(true);
      setQuoteResults([]);
      
      // Calculate totals
      const totalPackages = packageItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalWeight = packageItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
      const totalVolume = packageItems.reduce(
        (sum, item) => sum + ((item.length * item.width * item.height / 1000000) * item.quantity), 0
      );
      
      // Save the quote to Supabase
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          user_id: user?.id,
          client_id: clientInfo.id,
          merchandise_value: clientInfo.merchandiseValue,
          total_weight: totalWeight,
          total_volume: totalVolume,
          total_packages: totalPackages,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Save the packages
      if (data) {
        setQuoteId(data.id);
        
        const packagesToInsert = packageItems.map(item => ({
          quote_id: data.id,
          name: item.name,
          length: item.length,
          width: item.width,
          height: item.height,
          weight: item.weight,
          quantity: item.quantity
        }));
        
        const { error: packagesError } = await supabase
          .from('quote_packages')
          .insert(packagesToInsert);
        
        if (packagesError) throw packagesError;
      }
      
      // Move to the quotes step
      setCurrentStep('quotes');
    } catch (error: any) {
      toast({
        title: "Erro ao solicitar cotações",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error requesting quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('client');
    setPackageItems([]);
    setClientInfo({
      code: '',
      cnpj: '',
      merchandiseValue: 0
    });
    setQuoteResults([]);
    setQuoteId(null);
  };

  // Calculate total weight and volume
  const totalWeight = packageItems.reduce(
    (sum, item) => sum + (item.weight * item.quantity), 0
  );
  
  const totalVolume = packageItems.reduce(
    (sum, item) => sum + ((item.length * item.width * item.height / 1000000) * item.quantity), 0
  );

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Cotação</h1>
          <p className="text-muted-foreground mt-1">
            Solicite cotações de frete para seus clientes
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'client' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
            }`}>
              <User size={20} />
            </div>
            <div className="w-12 h-1 bg-primary/20 mx-1"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'packages' ? 'bg-primary text-primary-foreground' : 
              currentStep === 'quotes' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <Box size={20} />
            </div>
            <div className="w-12 h-1 bg-primary/20 mx-1"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'quotes' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Truck size={20} />
            </div>
          </div>
        </div>

        {/* Step 1: Client Information */}
        {currentStep === 'client' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientCode">Código do Cliente</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="clientCode"
                      value={clientInfo.code}
                      onChange={e => setClientInfo({...clientInfo, code: e.target.value})}
                      placeholder="Ex: 123456"
                    />
                    <Button 
                      type="button"
                      onClick={fetchClientByCode}
                      variant="outline"
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCNPJ">CNPJ</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="clientCNPJ"
                      value={clientInfo.cnpj}
                      onChange={e => setClientInfo({...clientInfo, cnpj: e.target.value})}
                      placeholder="Ex: 12.345.678/0001-99"
                    />
                    <Button 
                      type="button"
                      onClick={fetchClientByCNPJ}
                      variant="outline"
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>

              {clientInfo.name && (
                <div className="bg-primary-500/5 p-4 rounded-md animate-fade-in space-y-2">
                  <h3 className="font-medium">Dados do Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span className="font-medium">Nome:</span> {clientInfo.name}
                    </div>
                    <div>
                      <span className="font-medium">CNPJ:</span> {clientInfo.cnpj}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Endereço:</span> {clientInfo.address}{clientInfo.city && `, ${clientInfo.city}`}{clientInfo.state && `/${clientInfo.state}`}{clientInfo.zip_code && ` - CEP: ${clientInfo.zip_code}`}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="merchandiseValue">Valor da Mercadoria (R$)</Label>
                <Input 
                  id="merchandiseValue"
                  type="number"
                  value={clientInfo.merchandiseValue || ''}
                  onChange={e => setClientInfo({
                    ...clientInfo, 
                    merchandiseValue: parseFloat(e.target.value) || 0
                  })}
                  placeholder="Ex: 10000.00"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNextStep}
                  disabled={!clientInfo.merchandiseValue}
                >
                  Próximo 
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Package Selection */}
        {currentStep === 'packages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Embalagens Pré-definidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoadingPackages ? (
                      <div className="col-span-2 py-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      packageTypes.map((pkg) => (
                        <div 
                          key={pkg.id}
                          className="border rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer relative"
                          onClick={() => addPredefinedPackage(pkg)}
                        >
                          <PackageTypeAdjuster 
                            packageType={pkg} 
                            onUpdate={updatePackageType} 
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{pkg.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {pkg.length} x {pkg.width} x {pkg.height} cm
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Peso: {pkg.weight} kg
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-primary hover:text-primary/80 hover:bg-primary/5"
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Embalagem Personalizada</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCustomForm(!showCustomForm)}
                  >
                    {showCustomForm ? "Cancelar" : "Adicionar"}
                  </Button>
                </CardHeader>
                {showCustomForm && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customName">Nome</Label>
                        <Input 
                          id="customName"
                          value={customPackage.name}
                          onChange={e => setCustomPackage({...customPackage, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customWeight">Peso (kg)</Label>
                        <Input 
                          id="customWeight"
                          type="number"
                          value={customPackage.weight || ''}
                          onChange={e => setCustomPackage({...customPackage, weight: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customLength">Comprimento (cm)</Label>
                        <Input 
                          id="customLength"
                          type="number"
                          value={customPackage.length || ''}
                          onChange={e => setCustomPackage({...customPackage, length: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customWidth">Largura (cm)</Label>
                        <Input 
                          id="customWidth"
                          type="number"
                          value={customPackage.width || ''}
                          onChange={e => setCustomPackage({...customPackage, width: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customHeight">Altura (cm)</Label>
                        <Input 
                          id="customHeight"
                          type="number"
                          value={customPackage.height || ''}
                          onChange={e => setCustomPackage({...customPackage, height: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={addCustomPackage}
                        disabled={!customPackage.length || !customPackage.width || !customPackage.height || !customPackage.weight}
                      >
                        Adicionar à Lista
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumo da Cotação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{clientInfo.name || 'Não especificado'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">CNPJ:</span>
                      <span className="font-medium">{clientInfo.cnpj || 'Não especificado'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Valor da mercadoria:</span>
                      <span className="font-medium">R$ {clientInfo.merchandiseValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Total volumes:</span>
                      <span className="font-medium">{packageItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Peso total:</span>
                      <span className="font-medium">{totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Volume total:</span>
                      <span className="font-medium">{totalVolume.toFixed(3)} m³</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Itens selecionados</h3>
                    {packageItems.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Nenhuma embalagem selecionada</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {packageItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.length}x{item.width}x{item.height}cm, {item.weight}kg
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <span className="text-lg">-</span>
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <span className="text-lg">+</span>
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                onClick={() => removePackage(item.id)}
                              >
                                <MinusCircle size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('client')}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={packageItems.length === 0 || isLoading}
                >
                  {isLoading ? "Solicitando..." : "Solicitar Cotações"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Quotes Result */}
        {currentStep === 'quotes' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resumo da Solicitação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{clientInfo.name || 'Não especificado'}</p>
                    <p className="text-sm">{clientInfo.cnpj || ''}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor da Mercadoria</p>
                    <p className="font-medium">R$ {clientInfo.merchandiseValue.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantidade de Volumes</p>
                    <p className="font-medium">{packageItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Peso Total</p>
                    <p className="font-medium">{totalWeight.toFixed(2)} kg</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Detalhes das Embalagens</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Embalagem</th>
                          <th className="pb-2">Dimensões (cm)</th>
                          <th className="pb-2">Peso</th>
                          <th className="pb-2">Quantidade</th>
                          <th className="pb-2">Peso Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packageItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.length}x{item.width}x{item.height}</td>
                            <td className="py-2">{item.weight} kg</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">{(item.weight * item.quantity).toFixed(2)} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QuoteResults 
              results={quoteResults}
              isLoading={quoteResults.length === 0 && currentStep === 'quotes'}
              onNewQuote={resetForm}
            />

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('packages')}
              >
                Voltar
              </Button>
              <div className="space-x-4">
                <Button variant="outline">
                  Exportar PDF
                </Button>
                <Button onClick={resetForm}>
                  Nova Cotação
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
