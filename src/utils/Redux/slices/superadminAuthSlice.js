import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk for super admin login
export const superAdminLogin = createAsyncThunk(
  'superAdmin/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/superAdmin/login', { email, password });

      return response.data; // Return full response data on success
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid credentials');
      }
      return rejectWithValue(error.msg || 'Invalid Credentials');
    }
  }
);

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false, // New state for login status
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(superAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(superAdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // Store user details
        state.token = action.payload.token; // Store token
        state.isLoggedIn = true; // Set login status to true
        state.message = action.payload.msg; // Store success message
        state.error = null;
      })
      .addCase(superAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false; // Ensure login status remains false on failure
      });
  },
});

export const { logout } = superAdminAuthSlice.actions;

export default superAdminAuthSlice.reducer;
