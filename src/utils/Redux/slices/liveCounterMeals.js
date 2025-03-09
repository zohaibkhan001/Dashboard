import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async Thunk for fetching Live Counter Meals
export const fetchLiveCounterMeals = createAsyncThunk(
  'superAdmin/fetchLiveCounterMeals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // Retrieve token from auth state

      if (!token) {
        return rejectWithValue('Unauthorized: No token found');
      }

      const response = await api.get('/superAdmin/get_live_counter_meals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // Return data on success
    } catch (error) {
      return rejectWithValue(error.msg || 'Something went wrong');
    }
  }
);

// Slice Definition
const liveCounterMealsSlice = createSlice({
  name: 'liveCounterMeals',
  initialState: {
    liveCounterMeals: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No extra reducers needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveCounterMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveCounterMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.liveCounterMeals = action.payload; // Store fetched meals
      })
      .addCase(fetchLiveCounterMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default liveCounterMealsSlice.reducer;
