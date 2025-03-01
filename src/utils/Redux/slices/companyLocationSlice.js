import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async thunk to fetch locations
export const fetchLocations = createAsyncThunk(
  'locations/fetch',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth;
      if (!token) {
        return rejectWithValue('Authentication token is missing');
      }

      const response = await api.get(`/superAdmin/list_locations/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data || []; // Extracting "data" array
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch locations');
    }
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
