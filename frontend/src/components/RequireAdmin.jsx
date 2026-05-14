import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("mm_admin_token") : null;
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
