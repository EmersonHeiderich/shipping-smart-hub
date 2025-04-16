
import React from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShippingHub. Todos os direitos reservados.</p>
          <nav className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-foreground">Termos</a>
            <a href="#" className="hover:text-foreground">Privacidade</a>
            <a href="#" className="hover:text-foreground">Contato</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
