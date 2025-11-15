import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { HomeBuyer } from "./pages/HomeBuyer";
import { ProductDetail } from "./pages/ProductDetail";
import { StoreDetail } from "./pages/StoreDetail";
import { DashboardSeller } from "./pages/DashboardSeller";
import { Maps } from "./pages/Maps";
import { Favorites } from "./pages/Favorites";
import { useAuth } from "./contexts/AuthContext";
import { initializeDummyAccounts } from "./data/dummyAccounts";
// Orders removed

// Initialize dummy accounts on app load
initializeDummyAccounts();

function App() {
  const Root: React.FC = () => {
    const { isAuthenticated, isBuyer, isSeller } = useAuth();
    // If logged in, send to the correct home
    if (isAuthenticated) {
      if (isBuyer) return <Navigate to="/home" replace />;
      if (isSeller) return <Navigate to="/dashboard-seller" replace />;
    }
    // Default root shows HomeBuyer content
    return <HomeBuyer />;
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <main className="pt-20">
            <Routes>
          {/* Root: show HomeBuyer when not logged-in; redirect when logged-in */}
          <Route path="/" element={<Root />} />
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
              <ProtectedRoute>
                <Maps />
              </ProtectedRoute>
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
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
