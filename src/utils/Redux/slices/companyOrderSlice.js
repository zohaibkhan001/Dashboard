import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk for fetching company orders
export const fetchCompanyOrders = createAsyncThunk(
  'companyOrders/fetch',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth;
      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.get(`/superAdmin/company_orders/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log(response.data.data);
      return response.data?.data || []; // Extract the "data" array
    } catch (error) {
      return rejectWithValue(error.msg || 'Failed to fetch company orders');
    }
  }
);

const companyOrdersSlice = createSlice({
  name: 'companyOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchCompanyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companyOrdersSlice.reducer;
