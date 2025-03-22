import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ConsumerDashboard from "@/pages/dashboard/ConsumerDashboard";
import FarmerDashboard from "@/pages/dashboard/FarmerDashboard";
import Marketplace from "@/pages/marketplace/Marketplace";
import ProductDetails from "@/pages/marketplace/ProductDetails";
import Checkout from "@/pages/checkout/Checkout";
import OrderTracking from "@/pages/orders/OrderTracking";
import Chat from "@/pages/chat/Chat";
import AdminPanel from "@/pages/admin/AdminPanel";
import NotFound from "@/pages/NotFound";
import CartPage from "@/pages/cart/CartPage";
import TermsAndConditions from "@/pages/legal/TermsAndConditions";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Profile from "@/pages/farmer/Profile";
import Settings from "@/pages/farmer/Settings";
import Analytics from "@/pages/farmer/Analytics";
import DeliveryPage from "@/pages/farmer/Delivery";
import AddProduct from "@/pages/farmer/AddProduct";

// Layout components
import MainLayout from "@/components/layouts/MainLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/marketplace/:id" element={<Navigate to="/product/:id" replace />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
                
                {/* Protected Consumer Routes */}
                <Route element={<ProtectedRoute userType="consumer" />}>
                  <Route element={<DashboardLayout userType="consumer" />}>
                    <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders/:id" element={<OrderTracking />} />
                    <Route path="/chat/:id?" element={<Chat />} />
                  </Route>
                </Route>
                
                {/* Protected Farmer Routes */}
                <Route element={<ProtectedRoute userType="farmer" />}>
                  <Route element={<DashboardLayout userType="farmer" />}>
                    <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                    <Route path="/farmer/dashboard/profile" element={<Profile />} />
                    <Route path="/farmer/dashboard/settings" element={<Settings />} />
                    <Route path="/farmer/dashboard/analytics" element={<Analytics />} />
                    <Route path="/farmer/dashboard/delivery" element={<DeliveryPage />} />
                    <Route path="/farmer/dashboard/add-product" element={<AddProduct />} />
                    <Route path="/farmer/orders/:id" element={<OrderTracking />} />
                    <Route path="/farmer/chat/:id?" element={<Chat />} />
                  </Route>
                </Route>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute userType="admin" />}>
                  <Route path="/admin/*" element={<AdminPanel />} />
                </Route>
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
