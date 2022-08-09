import { createSlice } from '@reduxjs/toolkit';

export const requestReducer = createSlice({
  name: 'request',
  initialState: {
    key: 0,
  },
  reducers: {
    setRequestKey: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { setRequestKey } = requestReducer.actions;
export default requestReducer.reducer;
