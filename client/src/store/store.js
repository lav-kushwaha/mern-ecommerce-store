import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from './shop/products-slice/'
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from './shop/order-slice/index.js'
import adminOrderSlice from "./admin/orders-slice/index.js";


const store  = configureStore({
    reducer:{
        
        auth:authReducer,

        adminProduct:adminProductsSlice,
        adminOrder: adminOrderSlice,

        shopProducts:shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shoppingOrder:shoppingOrderSlice
    }
})

export default store;