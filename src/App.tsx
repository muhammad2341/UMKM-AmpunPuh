import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { HomeBuyer } from "./pages/HomeBuyer";
import { ProductDetail } from "./pages/ProductDetail";
import { StoreDetail } from "./pages/StoreDetail";
import { DashboardSeller } from "./pages/DashboardSeller";
import { Maps } from "./pages/Maps";
import { Favorites } from "./pages/Favorites";
import { initializeDummyAccounts } from "./data/dummyAccounts";
// Orders removed

// Initialize dummy accounts on app load
initializeDummyAccounts();

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
          {/* Public Routes - Only Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Buyer Routes - Only for buyers */}
          <Route
            path="/home"
            element={
              <RoleProtectedRoute allowedRole="buyer">
                <HomeBuyer />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <RoleProtectedRoute allowedRole="buyer">
                <ProductDetail />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/store/:id"
            element={
              <RoleProtectedRoute allowedRole="buyer">
                <StoreDetail />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/maps"
            element={
              <RoleProtectedRoute allowedRole="buyer">
                <Maps />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <RoleProtectedRoute allowedRole="buyer">
                <Favorites />
              </RoleProtectedRoute>
            }
          />

          {/* Seller Routes - Only for sellers */}
          <Route
            path="/dashboard-seller"
            element={
              <RoleProtectedRoute allowedRole="seller">
                <DashboardSeller />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute allowedRole="seller">
                <DashboardSeller />
              </RoleProtectedRoute>
            }
          />
          {/* Cart route removed - ordering via WhatsApp */}
          {/* Orders route removed */}
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
