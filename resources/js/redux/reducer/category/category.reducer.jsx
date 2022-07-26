import { createSlice } from '@reduxjs/toolkit';
export const categoryReduccer = createSlice({
  name: 'category',
  initialState: {
    loading: false,
    isListCategorySuccess: false,
    listCategory: [],
    message: '',
  },
  reducers: {
    fetchListCategory(state, action) {
      state.loading = true;
      state.isListCategorySuccess = true;
    },
    fetchListCategorySuccess(state, action) {
      state.loading = false;
      state.isListCategorySuccess = false;
      state.listCategory = action.payload.data.data;
      state.message = action.payload.data.message;
    },
    fetchListCategoryError(state, action) {
      state.loading = false;
      state.isListCategorySuccess = false;
      state.listCategory = action.payload;
    },
  },
});
export const categoryAction = categoryReduccer.actions;
export default categoryReduccer.reducer;
