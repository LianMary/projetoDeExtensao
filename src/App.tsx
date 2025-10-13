// Conteúdo final e correto para: src/App.tsx

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/StudentLogin";
import TestPage from "./pages/TestPage";
import { Header } from "./components/common/HeaderTemp"; 

const queryClient = new QueryClient();

// Layout Padrão com o Header componentizado
const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota sem o layout */}
          <Route path="/login" element={<StudentLogin />} />

          {/* Rotas que usam o layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/teste" element={<TestPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;