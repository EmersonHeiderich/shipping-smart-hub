
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NewQuotePage from "./pages/NewQuotePage";
import QuoteListPage from "./pages/QuoteListPage";
import CarriersPage from "./pages/CarriersPage";
import UsersPage from "./pages/UsersPage";
import TrackingPage from "./pages/TrackingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* App Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/cotacao/nova" element={<ProtectedRoute><NewQuotePage /></ProtectedRoute>} />
            <Route path="/cotacao/consulta" element={<ProtectedRoute><QuoteListPage /></ProtectedRoute>} />
            <Route path="/rastreio" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/transportadoras" element={<ProtectedRoute adminOnly><CarriersPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
