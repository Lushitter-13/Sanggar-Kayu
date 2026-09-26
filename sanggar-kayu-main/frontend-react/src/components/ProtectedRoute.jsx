import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  routeAccess,
  firstRouteByRole
} from "../config/RouteAccess";

function ProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = Number(user.role);
  const currentRoute = location.pathname.split("/")[1];

  // Route tidak terdaftar
  if (!routeAccess[currentRoute]) {
    return (
      <Navigate
        to = {firstRouteByRole[role]}
        replace
      />
    )
  }

  // Tidak punya akses
  if (!routeAccess[currentRoute].includes(role)) {
    return (
      <Navigate
        to = {firstRouteByRole[role]}
        replace
      />
    )
  }

  return <Outlet />;
}

export default ProtectedRoute;