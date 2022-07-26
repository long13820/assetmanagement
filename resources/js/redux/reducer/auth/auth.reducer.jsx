import { createSlice } from '@reduxjs/toolkit';

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    response: {},
  },
  reducers: {
    fetchChangePassword() {},
    fetchChangePasswordResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

export const authAction = authReducer.actions;
export default authReducer.reducer;
