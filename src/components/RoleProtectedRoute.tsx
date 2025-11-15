import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "buyer" | "seller";
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRole 
}) => {
  const auth = useAuth() as any;
  const { user, isAuthenticated } = auth;
  const hydrated = auth?.hydrated ?? true;
  const navigate = useNavigate();

  useEffect(() => {
        if (!hydrated) return; // wait for hydration
        console.log("🔒 RoleProtectedRoute check:", {
          isAuthenticated,
          user: user ? { email: user.email, role: user.role } : null,
          allowedRole
        });

    if (!isAuthenticated) {
      // Not logged in, redirect to login
        console.log("❌ Not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    if (user && user.role !== allowedRole) {
      // Wrong role, redirect to appropriate page
        console.log("❌ Wrong role, redirecting");
      if (user.role === "buyer") {
        navigate("/home");
        alert("Halaman ini hanya untuk penjual!");
      } else if (user.role === "seller") {
        navigate("/dashboard-seller");
        alert("Halaman ini hanya untuk pembeli!");
      }
    }
  }, [user, isAuthenticated, allowedRole, navigate, hydrated]);

  // If user is authenticated and has correct role, show the page
  if (!hydrated) return null;

  if (isAuthenticated && user && user.role === allowedRole) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
};
