
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FeatureCard } from "@/components/ui/feature-card";
import { 
  Truck, Search, Users, Settings, 
  Package, TrendingUp, Clock 
} from "lucide-react";

export default function DashboardPage() {
  // Mock data for dashboard summary
  const stats = [
    { label: "Cotações hoje", value: "12", icon: Package, color: "text-primary-500" },
    { label: "Cotações pendentes", value: "3", icon: Clock, color: "text-secondary-500" },
    { label: "Total mensal", value: "153", icon: TrendingUp, color: "text-success-500" },
  ];

  // Features cards representing main app sections
  const features = [
    {
      title: "Nova Cotação",
      description: "Solicite uma nova cotação de frete para seus clientes",
      icon: Truck,
      href: "/cotacao/nova",
    },
    {
      title: "Consultar Cotações",
      description: "Visualize e gerencie todas as cotações realizadas",
      icon: Search,
      href: "/cotacao/consulta",
    },
    {
      title: "Transportadoras",
      description: "Configure e gerencie as transportadoras parceiras",
      icon: Settings,
      href: "/admin/transportadoras",
      adminOnly: true,
    },
    {
      title: "Usuários",
      description: "Gerencie os usuários da plataforma",
      icon: Users,
      href: "/admin/usuarios",
      adminOnly: true,
    },
  ];

  // Mock - in real app would come from auth system
  const isAdmin = true;
  
  const filteredFeatures = features.filter(
    (feature) => !feature.adminOnly || (feature.adminOnly && isAdmin)
  );

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao Sistema de Cotação e Rastreio de Frete
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="card-material p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/20">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Acesso rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                href={feature.href}
              />
            ))}
          </div>
        </div>

        {/* Recent activity - would be populated from API */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Atividade recente</h2>
          <div className="card-material overflow-hidden">
            <div className="bg-primary-50/50 dark:bg-primary-900/10 px-4 py-3 border-b">
              <h3 className="font-medium">Últimas cotações</h3>
            </div>
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cotação #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">
                        Cliente: Empresa {String.fromCharCode(64 + i)}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {i === 1 ? "Hoje" : `Há ${i} dias`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
