import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from './shop/products-slice/'
import shopCartSlice from "./shop/cart-slice";


const store  = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice,
        shopProducts:shopProductsSlice,
        shopCart: shopCartSlice,

    }
})

export default store;