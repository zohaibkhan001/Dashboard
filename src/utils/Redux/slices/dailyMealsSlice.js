import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async Thunk for fetching Repeating Meals
export const fetchRepeatingMeals = createAsyncThunk(
  'superAdmin/fetchRepeatingMeals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // Retrieve token from auth state

      if (!token) {
        return rejectWithValue('Unauthorized: No token found');
      }

      const response = await api.get('/superAdmin/get_repeating_meals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // Return fetched data
    } catch (error) {
      return rejectWithValue(error.msg || 'Something went wrong');
    }
  }
);

// Slice Definition
const repeatingMealsSlice = createSlice({
  name: 'repeatingMeals',
  initialState: {
    repeatingMeals: [], // Properly named meal array
    loading: false,
    error: null,
  },
  reducers: {}, // No extra reducers needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepeatingMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepeatingMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.repeatingMeals = action.payload; // Store fetched meals properly
      })
      .addCase(fetchRepeatingMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default repeatingMealsSlice.reducer;
