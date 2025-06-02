import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import Authregister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/product"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import ShoppingLayout from "./pages/shopping-view/layout"
import NotFound from "./components/not-found"
import ShoppingHome from "./components/shopping-view/home"
import ShoppingListing from "./components/shopping-view/listing"
import ShoppingCheckout from "./components/shopping-view/checkout"
import ShoppingAccount from "./components/shopping-view/account"

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
        <Routes>

            {/* auth components */}
           <Route path="/auth" element={<AuthLayout/>}>
              <Route path="login" element={<AuthLogin/>}/>
              <Route path="register" element={<Authregister/>}/>
           </Route>

           {/* Admin components */}
           <Route path="/admin" element={<AdminLayout/>}>
              <Route path="dashboard" element={<AdminDashboard/>}/>
              <Route path="products" element={<AdminProducts/>}/>
              <Route path="orders" element={<AdminOrders/>}/>
              <Route path="features" element={<AdminFeatures/>}/>
           </Route>

            {/* Shopping components */}
           <Route path="/shop" element={<ShoppingLayout/>}>
              <Route path="home" element={<ShoppingHome/>}/>
              <Route path="listing" element={<ShoppingListing/>}/>
              <Route path="checkout" element={<ShoppingCheckout/>}/>
              <Route path="account" element={<ShoppingAccount/>}/>
           </Route>
           
           <Route path="*" element={<NotFound/>}/>

        </Routes>
    </div>
  )
}

export default App
