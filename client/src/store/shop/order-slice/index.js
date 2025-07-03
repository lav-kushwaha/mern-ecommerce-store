import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    approvalURL : null,
    isLoading : false,
    orderId : null
}

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {    
    try {
      const res = await axios.post("http://localhost:5000/api/shop/order/create", orderData);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      return rejectWithValue(message);
    }
  }
);


const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;
        state.approvalURL = action.payload.approvalURL
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null
        state.orderId = null
      });
  },
});

export default shoppingOrderSlice.reducer;