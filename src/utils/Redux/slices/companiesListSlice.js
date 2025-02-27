import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// 🔹 Fetch Companies (Async Thunk)
export const fetchCompanies = createAsyncThunk(
  'superAdmin/fetchCompanies',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // ✅ Destructuring Fix
      if (!token) throw new Error('Unauthorized: No token found!');

      const response = await api.get('/superAdmin/list_companies', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach Bearer Token
        },
      });

      return response.data; // ✅ Return the fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch companies');
    }
  }
);

// 🔹 Slice Definition
const listCompaniesSlice = createSlice({
  name: 'listCompanies',
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCompaniesState: (state) => {
      state.companies = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data; // ✅ Store fetched companies
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ Store error
      });
  },
});

export const { clearCompaniesState } = listCompaniesSlice.actions;
export default listCompaniesSlice.reducer;
