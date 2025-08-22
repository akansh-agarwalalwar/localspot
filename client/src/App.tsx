import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./components/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import SubadminDashboard from "./components/subadmin/SubadminDashboard";
import Index from "./pages/Index";
import PGHostels from "./pages/PGHostels";
import PGDetails from "./pages/PGDetails";
import MessCafe from "./pages/MessCafe";
import MessDetails from "./pages/MessDetails";
import GamingZone from "./pages/GamingZone";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Debug from "./pages/Debug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/pg-hostels" element={<PGHostels />} />
            <Route path="/pg-details/:id" element={<PGDetails />} />
            <Route path="/mess-cafe" element={<MessCafe />} />
            <Route path="/mess-details/:id" element={<MessDetails />} />
            <Route path="/gaming-zone" element={<GamingZone />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/debug" element={<Debug />} />

            {/* Authentication Routes - PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes - PROTECTED */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Subadmin Routes - PROTECTED */}
            <Route
              path="/subadmin"
              element={
                <ProtectedRoute allowedRoles={["subadmin"]}>
                  <SubadminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subadmin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["subadmin"]}>
                  <SubadminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Access Route */}
            <Route
              path="/unauthorized"
              element={
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                      Unauthorized Access
                    </h2>
                    <p className="text-gray-600 mb-4">
                      You don't have permission to access this page.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
