import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// ✅ **Async Thunk to Create Super Admin User**
export const createSuperAdminUser = createAsyncThunk(
  'superAdmin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/superAdmin/create_user', userData);
      return response.data; // ✅ Returns API response if successful
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create super admin user');
    }
  }
);

// ✅ **Slice Definition**
const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState: {
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    clearSuperAdminState: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSuperAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSuperAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // ✅ Stores created user data
        state.error = null;
      })
      .addCase(createSuperAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ Stores error message
      });
  },
});

// ✅ **Actions & Reducer Export**
export const { clearSuperAdminState } = superAdminSlice.actions;
export default superAdminSlice.reducer;
