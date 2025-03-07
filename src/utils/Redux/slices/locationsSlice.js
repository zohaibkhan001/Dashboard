import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// 🔹 Fetch Locations (Async Thunk)
export const fetchAllLocations = createAsyncThunk(
  'listAllLocations/fetchAllLocations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // ✅ Destructuring Fix
      if (!token) throw new Error('Unauthorized: No token found!');

      const response = await api.get('/superAdmin/list_all_locations', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach Bearer Token
        },
      });

      return response.data; // ✅ Return the fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch locations');
    }
  }
);

// 🔹 Slice Definition
const listLocationsSlice = createSlice({
  name: 'listAllLocations',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLocationsState: (state) => {
      state.locations = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.data; // ✅ Store fetched locations
        state.error = null;
      })
      .addCase(fetchAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ Store error
      });
  },
});

export const { clearLocationsState } = listLocationsSlice.actions;
export default listLocationsSlice.reducer;
