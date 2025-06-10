import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'

const store  = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice
    }
})

export default store;