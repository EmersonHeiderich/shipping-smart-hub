
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, PackageOpen, Map, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/cotacao/nova", label: "Nova Cotação" },
  { path: "/cotacao/consulta", label: "Consultar Cotações" },
  { path: "/rastreio", label: "Rastreio" },
  { path: "/admin/transportadoras", label: "Transportadoras", isAdmin: true },
  { path: "/admin/usuarios", label: "Usuários", isAdmin: true },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Check if user is admin (this would come from your user's role in a real app)
  const isAdmin = true; // For demo purposes - in a real app, check from user object

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 items-center">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle className="text-left">ShippingHub</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium mt-4">
                {menuItems
                  .filter(item => !item.isAdmin || (item.isAdmin && isAdmin))
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted ${
                        location.pathname === item.path
                          ? "bg-muted font-medium"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.path.includes("cotacao") ? (
                        <PackageOpen className="h-5 w-5" />
                      ) : item.path.includes("rastreio") ? (
                        <Map className="h-5 w-5" />
                      ) : (
                        <div className="w-5" /> // Empty div for spacing
                      )}
                      {item.label}
                    </Link>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">ShippingHub</span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-6">
            {menuItems
              .filter(item => !item.isAdmin || (item.isAdmin && isAdmin))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline-block">
                  {user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
