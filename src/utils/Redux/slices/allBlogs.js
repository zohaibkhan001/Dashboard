import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

export const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchAllBlogs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth;

      const response = await api.get('/superAdmin/fetch_all_blogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.msg || 'Failed to fetch blogs');
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogsSlice.reducer;
