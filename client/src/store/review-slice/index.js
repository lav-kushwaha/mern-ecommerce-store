import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const initialState = {
  isLoading: false,
  reviews: [],
  hasPurchased: false,
  error: null,
};

// Async thunk to add a review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/shop/review/add`,
        formData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

// Async thunk to fetch reviews by product ID
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/review/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// Async thunk to check if user has purchased the product
export const checkPurchaseStatus = createAsyncThunk(
  "review/checkPurchaseStatus",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/shop/review/check-purchase`, {
        userId,
        productId,
      });
      return response.data.hasPurchased;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check purchase status"
      );
    }
  }
);

// Review slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.reviews = [];
      })

      // Add review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check purchase status
      .addCase(checkPurchaseStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkPurchaseStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasPurchased = action.payload;
      })
      .addCase(checkPurchaseStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.hasPurchased = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
