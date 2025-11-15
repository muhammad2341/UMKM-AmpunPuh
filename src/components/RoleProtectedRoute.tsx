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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, redirect to login
      navigate("/login");
      return;
    }

    if (user && user.role !== allowedRole) {
      // Wrong role, redirect to appropriate page
      if (user.role === "buyer") {
        navigate("/home");
        alert("Halaman ini hanya untuk penjual!");
      } else if (user.role === "seller") {
        navigate("/dashboard-seller");
        alert("Halaman ini hanya untuk pembeli!");
      }
    }
  }, [user, isAuthenticated, allowedRole, navigate]);

  // If user is authenticated and has correct role, show the page
  if (isAuthenticated && user && user.role === allowedRole) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
};
