import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const authCheckLoading = useSelector((state) => state.auth.authCheckLoading);

  if (authCheckLoading) {
    return <div className="bg-[#323639] pt-10 min-h-screen ">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
