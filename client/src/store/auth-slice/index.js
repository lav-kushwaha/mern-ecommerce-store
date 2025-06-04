import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
   isAuthenticated:false,
   isLoading:false,
   user:null
}

//Redux asyncthunk
//register API
export const registerUser = createAsyncThunk('/auth/register',
    async(formData, {rejectWithValue }) =>{
      try {      // console.log('Sending formData:', formData); // Debug
        const response = await axios.post('http://localhost:5000/api/auth/register',formData,{
            withCredentials:true
        })
        return response.data;
    }catch (err) {
      // Return backend's error message (if exists)
      return rejectWithValue(err.response?.data || { message: "Invalid fields" });
    }
}
)

//login API
export const loginUser = createAsyncThunk('/auth/login',
    async(formData,{ rejectWithValue }) =>{
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      // Return backend's error message (if exists)
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
)

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            
        }
    },

    //pending,fulfilled and rejected
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true
        }).addCase(registerUser.fulfilled,(state)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
            state.error = action.payload?.message;
        }).addCase(loginUser.pending,(state)=>{
            state.isLoading = true
        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.user = action?.payload?.success ? action?.payload?.user:null;
            state.isAuthenticated = action.payload.success;
        }).addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload?.message || "Login failed";
        })
    }
})

export const {setUser} = authSlice.actions;
export const authReducer =  authSlice.reducer;
