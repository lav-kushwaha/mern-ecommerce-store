import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  recommendations: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
};

// Fetch all filtered products (pagination, filters, sorting)
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page = 1 }, thunkAPI) => {
    try {
      const query = new URLSearchParams({
        sortBy: sortParams,
        page,
        limit: 8,
      });

      // Handle array-based filters like category[] or brand[]
      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, v));
        } else {
          query.append(key, value);
        }
      });

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`
      );

      return result.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching products"
      );
    }
  }
);

// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "/shop/productDetails",
  async ({ id }) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`,
      {
        withCredentials: true,
      }
    );
    return result.data;
  }
);

// Fetch recommendations (same category, excluding current product)
export const fetchRecommendations = createAsyncThunk(
  "/shop/fetchRecommendations",
  async ({ category, excludeId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get?category=${category}`
      );
      const all = response.data?.data || [];
      const filtered = all.filter((p) => p._id !== excludeId);
      return filtered;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch recommendations"
      );
    }
  }
);

// Slice
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All products (filtered)
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
        state.totalItems = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // Product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action?.payload?.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })

      // Recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.recommendations = [];
      });
  },
});

export const { setPage, setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
