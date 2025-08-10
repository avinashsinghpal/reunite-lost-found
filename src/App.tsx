import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LostItems from "@/pages/LostItems";
import FoundItems from "@/pages/FoundItems";
import ReportLost from "@/pages/ReportLost";
import ReportFound from "@/pages/ReportFound";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import ItemDetails from "@/pages/ItemDetails";
import { ItemsProvider } from "@/context/ItemsContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <ItemsProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/lost" element={<LostItems />} />
                  <Route path="/found" element={<FoundItems />} />
                  <Route path="/report-lost" element={<ReportLost />} />
                  <Route path="/report-found" element={<ReportFound />} />
                  <Route path="/items/:id" element={<ItemDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </ItemsProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
