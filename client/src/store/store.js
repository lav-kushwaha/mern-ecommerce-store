import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from './shop/products-slice/'
import shopCartSlice from "./shop/cart-slice";
import addressSlice from "./shop/address-slice/index.js"
import shopAddressSlice from "./shop/address-slice";


const store  = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice,
        shopProducts:shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
    }
})

export default store;