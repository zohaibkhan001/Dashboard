import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk to fetch orders
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get('/superAdmin/all_orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success === 1 && Array.isArray(response.data.data)) {
        return response.data.data; // Return orders array
      }
      return rejectWithValue('Invalid response format');
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false, // Replacing status with loading boolean
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
