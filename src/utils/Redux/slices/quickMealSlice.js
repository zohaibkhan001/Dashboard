import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';
// Async Thunk for fetching Quick Meals
export const fetchQuickMeals = createAsyncThunk(
  'superAdmin/fetchQuickMeals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // Retrieve token from auth state

      if (!token) {
        return rejectWithValue('Unauthorized: No token found');
      }

      const response = await api.get('/superAdmin/get_quick_meals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // Return fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Slice Definition
const quickMealsSlice = createSlice({
  name: 'quickMeals',
  initialState: {
    quickMeals: [], // Properly named meal array
    loading: false,
    error: null,
  },
  reducers: {}, // No extra reducers needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuickMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuickMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.quickMeals = action.payload; // Store fetched meals properly
      })
      .addCase(fetchQuickMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quickMealsSlice.reducer;
