import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({isAuthenticated, user, children}) {
        const location = useLocation();

       //if user is not authenticated and try to visit any other route then redirect to the login page.
        if(!isAuthenticated && !(location.pathname.includes("/login")) || !(location.pathname.includes("/register"))){
           return <Navigate to='/auth/login'/>;
        }

        //if user is already loggedin and then they try to login or register then redirect to admin or shoping home according to role.
        if(isAuthenticated && (location.pathname.includes("/login")) || (location.pathname.includes("/register"))){
             if(user?.role=='admin'){
                return <Navigate to='/admin/dashboard'/>;       
             }else{
                return <Navigate to='/shop/home'/>;
             }
        }
}

export default CheckAuth; 
