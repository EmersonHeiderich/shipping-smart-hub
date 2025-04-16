
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Package, User, Truck, 
  ChevronDown, Menu, LogOut, Settings 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Package,
  },
  {
    title: "Nova Cotação",
    href: "/cotacao/nova",
    icon: Truck,
  },
  {
    title: "Consultar Cotações",
    href: "/cotacao/consulta",
    icon: Package,
  },
  {
    title: "Transportadoras",
    href: "/admin/transportadoras",
    icon: Truck,
    adminOnly: true,
  },
  {
    title: "Usuários",
    href: "/admin/usuarios",
    icon: User,
    adminOnly: true,
  },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  // Mock user for the demo
  const isAdmin = true;
  const userInitials = "JS";
  const userName = "João Silva";
  
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="hidden items-center space-x-2 md:flex">
            <Package className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-xl">ShippingHub</span>
          </Link>
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="px-2 py-6">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 mb-8"
                  onClick={() => setOpen(false)}
                >
                  <Package className="h-6 w-6 text-primary-500" />
                  <span className="font-bold text-xl">ShippingHub</span>
                </Link>
                <nav className="flex flex-col space-y-3">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-2 text-lg px-3 py-2 rounded-md ${
                        location.pathname === item.href
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex md:gap-4 lg:gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9 bg-primary-100 text-primary-700">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/perfil" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login" className="cursor-pointer text-red-500 hover:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
