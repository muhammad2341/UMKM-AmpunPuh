import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth() as any;
  const { isAuthenticated } = auth;
  const hydrated = auth?.hydrated ?? true;
  console.log("🔐 ProtectedRoute check:", { isAuthenticated, hydrated });

  // Avoid redirect until auth state is hydrated from storage
  if (!hydrated) return null;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
      console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
