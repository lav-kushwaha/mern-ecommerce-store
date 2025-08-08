import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

// Layouts
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";

// Pages - Auth
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// Pages - Admin
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";

// Pages - Shop
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ProductsDetails from "./pages/shopping-view/products-details";
import PaypalSuccess from "./pages/shopping-view/PaypalSuccess";
import OrderConfirmed from "./pages/shopping-view/OrderConfirmed";
import SearchProducts from "./pages/shopping-view/search";

// Other
import NotFound from "./components/not-found";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import ScrollToTop from "./components/common/scrollToTop";

//loader
import { Loader2 } from "lucide-react";
import LandingPage from "./pages/Landing-page/LandingPage";
import LandingLayout from "./pages/Landing-page/LandingLayout";

const Loader = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-black gap-6">
    <h1 className="text-2xl font-semibold tracking-wide">Loading...</h1>
    <div className="flex items-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      <span className="text-sm text-gray-500">Checking authentication, please wait</span>
    </div>
  </div>
);


function App() {
  const { isAuthenticated, user, isLoading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'));
    dispatch(checkAuth(token));
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ScrollToTop />

      <Routes>
        {/* Auth Check for root */}
        <Route
        path="/"
        element={
          isAuthenticated
            ? user?.role === "admin"
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/shop/home" replace />
            : (
                <LandingLayout>
                  <LandingPage />
                </LandingLayout>
              )
        }
      />

        {/* Auth Pages */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Pages */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shopping Pages */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Navigate to="listing" replace />} />
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="product-details/:id" element={<ProductsDetails />} />
          <Route path="paypal-success" element={<PaypalSuccess />} />
          <Route path="order-confirmed/:orderId" element={<OrderConfirmed />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* Fallback Routes */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
