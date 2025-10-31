"use client";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { HomeBuyer } from "./pages/HomeBuyer";
import { ProductDetail } from "./pages/ProductDetail";
import { StoreDetail } from "./pages/StoreDetail";
import { DashboardSeller } from "./pages/DashboardSeller";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Buyer Routes */}
        <Route
          path="/home"
          element={
            user?.role === "buyer" ? <HomeBuyer /> : <Navigate to="/login" />
          }
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/store/:id" element={<StoreDetail />} />

        {/* Seller Routes */}
        <Route
          path="/dashboard"
          element={
            user?.role === "seller" ? (
              <DashboardSeller />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
