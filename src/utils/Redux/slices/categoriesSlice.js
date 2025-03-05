import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import api from 'src/utils/api';

// ✅ Fetch categories from API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().superAdminAuth; // Get token from state
      const response = await api.get('/superAdmin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return categories data
    } catch (error) {
      return rejectWithValue(error.msg || 'Error fetching categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Add category manually
    // addCategory: (state, action) => {
    //   state.categories.push(action.payload);
    // },
    // // Optional: Remove a category manually
    // removeCategory: (state, action) => {
    //   state.categories = state.categories.filter((cat) => cat.id !== action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const { addCategory, removeCategory } = categorySlice.actions;
export default categorySlice.reducer;

// ✅ Custom Hook to Get Categories in Components
// export const useCategories = () => useSelector((state) => state.categories);
