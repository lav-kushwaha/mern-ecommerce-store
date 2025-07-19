import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from './auth-slice/index.js'
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from './shop/products-slice/'
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from './shop/order-slice/index.js'
import adminOrderSlice from "./admin/orders-slice/index.js";
import shopSearchSlice from "./search-slice/index.js"
import shopReviewSlice from "./review-slice/index.js"
import commonFeatureSlice from "./common-slice";


const store  = configureStore({
    reducer:{
        
        auth:authReducer,

        adminProduct:adminProductsSlice,
        adminOrder: adminOrderSlice,

        shopProducts:shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shoppingOrder:shoppingOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,

        commonFeature: commonFeatureSlice,
    }
})

export default store;