import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOME = {
  donor: "/donor-dashboard",
  collector: "/collector-dashboard",
  admin: "/admin-dashboard",
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={HOME[user.role] || "/"} replace />;
}