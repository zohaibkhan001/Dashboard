import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// Async Thunk for Creating a Company
export const createCompany = createAsyncThunk(
  'company/create',
  async (companyData, { rejectWithValue, getState }) => {
    try {
      // Extract token from Redux state
      // console.log(companyData);
      const { token } = getState().superAdminAuth; // ✅ Extract token

      if (!token) {
        return rejectWithValue('Authentication token is missing!');
      }

      // Set authorization header
      const response = await api.post('/superAdmin/create_company', companyData, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Include token in headers
      });

      return response.data;
    } catch (error) {
      //   console.log(error);
      return rejectWithValue(error.msg || 'Something went wrong');
    }
  }
);

// Initial State
const initialState = {
  company: null,
  loading: false,
  error: null,
  success: false,
};

// Slice
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanyState: (state) => {
      state.company = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions
export const { resetCompanyState } = companySlice.actions;

// Export Reducer
export default companySlice.reducer;
