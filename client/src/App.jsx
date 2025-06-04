import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
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
import CheckAuth from "./components/common/check-auth"
import UnauthPage from "./pages/unauth-page"
import { useSelector } from "react-redux"

function App() {

   const {isAuthenticated,user} = useSelector((store)=>store.auth);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
        <Routes>

            {/* auth components */}
           <Route path="/auth" element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                 <AuthLayout/>
              </CheckAuth>
           }>
              <Route path="login" element={<AuthLogin/>}/>
              <Route path="register" element={<AuthRegister/>}/>
           </Route>


           {/* Admin components */}
           <Route path="/admin" element={
               <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout/>
               </CheckAuth>
           }>
              <Route path="dashboard" element={<AdminDashboard/>}/>
              <Route path="products" element={<AdminProducts/>}/>
              <Route path="orders" element={<AdminOrders/>}/>
              <Route path="features" element={<AdminFeatures/>}/>
           </Route>


            {/* Shopping components */}
           <Route path="/shop" element={
             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
               <ShoppingLayout/>
             </CheckAuth>
           }>
              <Route path="home" element={<ShoppingHome/>}/>
              <Route path="listing" element={<ShoppingListing/>}/>
              <Route path="checkout" element={<ShoppingCheckout/>}/>
              <Route path="account" element={<ShoppingAccount/>}/>
           </Route>
           
           <Route path="*" element={<NotFound/>}/>
           <Route path="/unauth-page" element={<UnauthPage/>}/>

        </Routes>
    </div>
  )
}

export default App
