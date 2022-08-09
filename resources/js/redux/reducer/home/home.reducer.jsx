import { createSlice } from '@reduxjs/toolkit';

export const homeReducer = createSlice({
  name: 'home',
  initialState: {
    key: 0,
  },
  reducers: {
    setHomeKey: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { setHomeKey } = homeReducer.actions;
export default homeReducer.reducer;
