import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // console.log(isAuthenticated,user);
  
  
  // 1. If NOT authenticated and trying to access protected routes, redirect to login
  if (
    !isAuthenticated &&
    !(location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // 2. If authenticated and tries to access login/register, redirect based on role
  if (
  isAuthenticated &&
  (location.pathname.includes("/login") || location.pathname.includes("/register"))
) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
}

  // 3. If non-admin user tries to access admin route, redirect to unauth-page
  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // 4. If admin tries to access shop route, redirect to admin dashboard
  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

 // 5. All good — allow access
  return <>{children}</>;
}

export default CheckAuth;
