import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk: only companyId is passed, token is fetched from state
export const fetchCompanyReviews = createAsyncThunk(
  'companyReviews/fetch',
  async (companyId, thunkAPI) => {
    const state = thunkAPI.getState();
    const { token } = state.superAdminAuth; // Adjust the path based on your auth slice

    try {
      const response = await api.get(`/superAdmin/company_orders/reviews/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.msg || 'Unknown error');
    }
  }
);

const companyReviewSlice = createSlice({
  name: 'companyReviews',
  initialState: {
    reviews: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchCompanyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      });
  },
});

export default companyReviewSlice.reducer;
