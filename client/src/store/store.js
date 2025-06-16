import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from './shop/products-slice/'

const store  = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice,
        shopProducts:shopProductsSlice
    }
})

export default store;