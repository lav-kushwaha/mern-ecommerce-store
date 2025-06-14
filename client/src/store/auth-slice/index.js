import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Register User Thunk
export const registerUser = createAsyncThunk('/auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Invalid fields" });
    }
  }
);

// Login User Thunk
export const loginUser = createAsyncThunk('/auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

//logout
export const logoutUser = createAsyncThunk('/auth/logout',
  async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/logout',{},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

// Check Auth Thunk
export const checkAuth = createAsyncThunk('/auth/checkauth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Expires: '0'
        }
      });      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Something went wrong in auth" });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
     
    }
  },
  extraReducers: (builder) => {
    builder
      //Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null; // Not auto-login
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message;
      })

      //Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
      })

      //Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log(action,+"action")
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload.user : null;
        state.isAuthenticated = action.payload?.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Auth check failed";
      })

      //logout user
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Logout failed";
      });
  }
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
