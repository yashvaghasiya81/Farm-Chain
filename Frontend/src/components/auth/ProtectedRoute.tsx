
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  userType?: "consumer" | "farmer" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userType }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user type if specified
  if (userType && user?.userType !== userType) {
    // Redirect to appropriate dashboard
    const redirectPath = user?.userType === "farmer" 
      ? "/farmer/dashboard" 
      : user?.userType === "admin" 
        ? "/admin" 
        : "/consumer/dashboard";
    
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
