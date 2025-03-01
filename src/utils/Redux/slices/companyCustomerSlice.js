import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk for fetching company customers
export const fetchCompanyCustomer = createAsyncThunk(
  'companyCustomer/fetch',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      // Get the token from the superAdminAuth slice
      const { token } = getState().superAdminAuth;
      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      // API request
      const response = await api.get(`/superAdmin/fetch_company_customer/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

const companyCustomerSlice = createSlice({
  name: 'companyCustomer',
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload?.data || [];
        state.error = null;
      })
      .addCase(fetchCompanyCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companyCustomerSlice.reducer;
