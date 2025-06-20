import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  recommendations: [], 
};



export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {

    const query = new URLSearchParams({ 
      ...filterParams,
      sortBy: sortParams,
    });

    // console.log(query);  //Output: ex - category=men%2Cwomen&brand=nike&sortBy=price-lowtohigh
    
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );    

    return result?.data;
  }
);

//Product details
export const fetchProductDetails = createAsyncThunk("/shop/productDetails",
  async({id})=>{
    const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`,{
      withCredentials:true,
    })
    return result.data;
  }
)

export const fetchRecommendations = createAsyncThunk(
  "/shop/fetchRecommendations",
  async ({ category, excludeId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get?category=${category}`
      );
      const all = response.data?.data || [];
      const filtered = all.filter((p) => p._id !== excludeId);
      return filtered;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch recommendations");
    }
  }
);


const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })

      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action?.payload?.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })

      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.recommendations = [];
      });
      
  },
});


export default shoppingProductSlice.reducer;