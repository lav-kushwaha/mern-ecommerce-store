import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    approvalURL : null,
    isLoading : false,
    orderId : null,
    orderList:[],
    orderDetails:null
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

export const captureOrder = createAsyncThunk(
  'order/captureOrder',
  async ({ orderID, orderId }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/shop/order/capture', {
        orderID,
        orderId,
      });
      return response.data;
    } catch (err) {
      console.error("Capture Error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  'order/getAllOrdersByUserId',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shop/order/details/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails:(state)=>{
        state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action?.payload?.orderId;
        state.approvalURL = action.payload.approvalURL;
        // sessionStorage.setItem(
        //   "currentOrderId",
        //   JSON.stringify(action?.payload?.orderId)
        // );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null
        state.orderId = null
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderList = action?.payload?.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderDetails = action?.payload?.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
  },
});

export const {resetOrderDetails} = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;