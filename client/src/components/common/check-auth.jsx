import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // if user is not authenticated and try to visit any other route then redirect to the login page.
  if (
    !isAuthenticated &&
    !(location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if user is already isAuthenticated and then he try to access login or register page then redirect to the according to role i.e- shopping home or admin.
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // if user is not admin and he try to access admin page then redirect to unauth-page.
  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // if user is admin and he try to access shop-page then redirect to the admin/dashboard.
  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
