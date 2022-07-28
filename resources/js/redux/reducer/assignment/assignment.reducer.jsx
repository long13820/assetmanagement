import { createSlice } from '@reduxjs/toolkit';

export const assignmentReducer = createSlice({
  name: 'assignment',
  initialState: {
    asset: {},
    assetName: '',
    userName: '',
    user: [],
    isAdd: false,
    isSelect: true,
  },
  reducers: {
    setAsset: (state, action) => {
      state.asset = { ...action.payload };
    },
    setAssetName: (state, action) => {
      state.assetName = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAdd: (state, action) => {
      state.isAdd = action.payload;
    },
    setIsSelect: (state, action) => {
      state.isSelect = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const { setAsset, setUser, setIsAdd, setIsSelect, setAssetName, setUserName } = assignmentReducer.actions;
export default assignmentReducer.reducer;
