
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronRight, Package, User, 
  Box, Truck, Plus, MinusCircle 
} from "lucide-react";

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
  code: string;
  cnpj: string;
  name?: string;
  address?: string;
  merchandiseValue: number;
}

// Predefined package types
const predefinedPackages: Omit<PackageItem, 'id' | 'quantity'>[] = [
  { name: "Caixa Pequena", length: 30, width: 20, height: 15, weight: 1 },
  { name: "Caixa Média", length: 50, width: 40, height: 30, weight: 3 },
  { name: "Caixa Grande", length: 60, width: 50, height: 40, weight: 5 },
  { name: "Envelope", length: 35, width: 25, height: 1, weight: 0.2 },
  { name: "Pallet", length: 120, width: 100, height: 15, weight: 10 },
];

export default function NewQuotePage() {
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

  // If we had client data from ERP, this would fetch it
  const fetchClientByCode = () => {
    // Mock client fetch
    if (clientInfo.code === "123") {
      setClientInfo({
        ...clientInfo,
        cnpj: "12.345.678/0001-99",
        name: "Empresa ABC Ltda",
        address: "Rua Exemplo, 123 - São Paulo/SP"
      });
    }
  };

  const fetchClientByCNPJ = () => {
    // Mock client fetch
    if (clientInfo.cnpj === "12.345.678/0001-99") {
      setClientInfo({
        ...clientInfo,
        code: "123",
        name: "Empresa ABC Ltda",
        address: "Rua Exemplo, 123 - São Paulo/SP"
      });
    }
  };

  const addPredefinedPackage = (packageTemplate: Omit<PackageItem, 'id' | 'quantity'>, quantity: number = 1) => {
    const newItem: PackageItem = {
      ...packageTemplate,
      id: Math.random().toString(36).substring(2, 11),
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

  const requestQuotes = () => {
    setIsLoading(true);
    // This would send requests to carriers
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('quotes');
    }, 1500);
  };

  // Calculate total weight and volume
  const totalWeight = packageItems.reduce(
    (sum, item) => sum + (item.weight * item.quantity), 0
  );
  
  const totalVolume = packageItems.reduce(
    (sum, item) => sum + ((item.length * item.width * item.height / 1000000) * item.quantity), 0
  );

  // Mock carriers and quotes result
  const mockQuotes = [
    { 
      carrier: "Transportadora A", 
      price: 125.50, 
      percentage: 1.25, 
      deliveryTime: "2 dias úteis",
      quoteNumber: "QT123456",
      modal: "Rodoviário",
      message: "Cotação válida por 7 dias"
    },
    { 
      carrier: "Transportadora B", 
      price: 142.75, 
      percentage: 1.43, 
      deliveryTime: "1 dia útil",
      quoteNumber: "Q-987654",
      modal: "Aéreo",
      message: "Seguro incluso no valor"
    },
    { 
      carrier: "Transportadora C", 
      price: 98.30, 
      percentage: 0.98, 
      deliveryTime: "3 dias úteis",
      quoteNumber: "C2023-789",
      modal: "Rodoviário",
      message: "Tarifa econômica"
    }
  ];

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
              currentStep === 'client' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-700'
            }`}>
              <User size={20} />
            </div>
            <div className="w-12 h-1 bg-primary-100 mx-1"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'packages' ? 'bg-primary-500 text-white' : 
              currentStep === 'quotes' ? 'bg-primary-100 text-primary-700' : 'bg-muted text-muted-foreground'
            }`}>
              <Box size={20} />
            </div>
            <div className="w-12 h-1 bg-primary-100 mx-1"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 'quotes' ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <Truck size={20} />
            </div>
          </div>
        </div>

        {/* Step 1: Client Information */}
        {currentStep === 'client' && (
          <Card className="card-material">
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
                      className="field-material"
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
                      className="field-material"
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
                <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-md animate-fade-in">
                  <h3 className="font-medium mb-2">Dados do Cliente</h3>
                  <p><span className="font-medium">Nome:</span> {clientInfo.name}</p>
                  <p><span className="font-medium">CNPJ:</span> {clientInfo.cnpj}</p>
                  <p><span className="font-medium">Endereço:</span> {clientInfo.address}</p>
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
                  className="field-material"
                  placeholder="Ex: 10000.00"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNextStep}
                  disabled={!clientInfo.merchandiseValue}
                  className="btn-material-primary"
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
              <Card className="card-material">
                <CardHeader>
                  <CardTitle className="text-xl">Embalagens Pré-definidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predefinedPackages.map((pkg, index) => (
                      <div 
                        key={index}
                        className="border rounded-md p-4 hover:border-primary-300 transition-colors cursor-pointer"
                        onClick={() => addPredefinedPackage(pkg)}
                      >
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
                            className="text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-material">
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
                          className="field-material"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customWeight">Peso (kg)</Label>
                        <Input 
                          id="customWeight"
                          type="number"
                          value={customPackage.weight || ''}
                          onChange={e => setCustomPackage({...customPackage, weight: parseFloat(e.target.value) || 0})}
                          className="field-material"
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
                          className="field-material"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customWidth">Largura (cm)</Label>
                        <Input 
                          id="customWidth"
                          type="number"
                          value={customPackage.width || ''}
                          onChange={e => setCustomPackage({...customPackage, width: parseFloat(e.target.value) || 0})}
                          className="field-material"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customHeight">Altura (cm)</Label>
                        <Input 
                          id="customHeight"
                          type="number"
                          value={customPackage.height || ''}
                          onChange={e => setCustomPackage({...customPackage, height: parseFloat(e.target.value) || 0})}
                          className="field-material"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={addCustomPackage}
                        disabled={!customPackage.length || !customPackage.width || !customPackage.height || !customPackage.weight}
                        className="btn-material-primary"
                      >
                        Adicionar à Lista
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="card-material">
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
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
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
                  className="btn-material-primary"
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
            <Card className="card-material">
              <CardHeader>
                <CardTitle className="text-xl">Resumo da Solicitação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{clientInfo.name || 'Não especificado'}</p>
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

            <div>
              <h2 className="text-xl font-semibold mb-4">Cotações Recebidas</h2>
              <div className="space-y-4">
                {mockQuotes.map((quote, index) => (
                  <Card 
                    key={index} 
                    className={`card-material overflow-hidden border-l-4 ${
                      index === 0 ? 'border-l-primary-500' : 
                      index === 1 ? 'border-l-secondary-500' : 
                      'border-l-muted'
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Transportadora</p>
                          <p className="font-medium">{quote.carrier}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Valor do Frete</p>
                          <p className="font-bold text-lg">R$ {quote.price.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">% sobre Mercadoria</p>
                          <p className="font-medium">{quote.percentage.toFixed(2)}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Prazo de Entrega</p>
                          <p className="font-medium">{quote.deliveryTime}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Modal</p>
                          <p className="font-medium">{quote.modal}</p>
                        </div>
                      </div>
                      <div className="bg-muted/20 px-4 py-3 border-t flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Cotação: </span>
                          <span className="text-sm font-medium">{quote.quoteNumber}</span>
                          {quote.message && (
                            <span className="text-sm ml-4">{quote.message}</span>
                          )}
                        </div>
                        <Button 
                          className={index === 0 ? "btn-material-primary" : "btn-material"}
                        >
                          Selecionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

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
                <Button 
                  onClick={() => {
                    setCurrentStep('client');
                    setPackageItems([]);
                    setClientInfo({
                      code: '',
                      cnpj: '',
                      merchandiseValue: 0
                    });
                  }}
                  className="btn-material-primary"
                >
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
