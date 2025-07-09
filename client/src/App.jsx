import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./components/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingAccount from "./pages/shopping-view/account"
import CheckAuth from "./components/common/check-auth"
import UnauthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import ProductsDetails from "./pages/shopping-view/products-details"
import PaypalSuccess from "./pages/shopping-view/PaypalSuccess"
import OrderConfirmed from "./pages/shopping-view/OrderConfirmed"


function App() {

   const {isAuthenticated,user,isLoading} = useSelector((store)=>store.auth);
   const dispatch = useDispatch();

   useEffect(()=>{
      dispatch(checkAuth());
   },[dispatch]);

   if(isLoading) return <div>Loading..</div>

  return (
    <div className="flex flex-col overflow-hidden bg-black">
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
              <Route path="product-details/:id" element={<ProductsDetails/>}/>
              <Route path="paypal-success" element={<PaypalSuccess />} />
              <Route path="order-confirmed/:orderId" element={<OrderConfirmed/>} />
           </Route>
           
           <Route path="*" element={<NotFound/>}/>
           <Route path="/unauth-page" element={<UnauthPage/>}/>

        </Routes>
    </div>
  )
}

export default App
