import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  // 1. Block unauthenticated access to protected pages (except login/register)
  const isPublicPage = path.includes("/auth/login") || path.includes("/auth/register");
  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Prevent authenticated users from seeing login/register
  if (isAuthenticated && isPublicPage) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // 3. Prevent regular users from accessing admin routes
  if (isAuthenticated && user?.role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  // 4. Prevent admin from accessing shop routes
  if (isAuthenticated && user?.role === "admin" && path.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 5. Otherwise, allow access
  return <>{children}</>;
}

export default CheckAuth;