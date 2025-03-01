import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

// ✅ Async Thunk for Deleting a Company
export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().superAdminAuth; // Extract token from Redux state
      // console.log(token);
      const response = await api.delete(`/superAdmin/delete_company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to the request
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete company');
      }

      return companyId; // Return deleted company ID for optimistic update
    } catch (error) {
      return rejectWithValue(error.msg || 'Error deleting company');
    }
  }
);

// ✅ Slice Definition
const deleteCompanySlice = createSlice({
  name: 'deleteCompany',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deleteCompanySlice.reducer;
