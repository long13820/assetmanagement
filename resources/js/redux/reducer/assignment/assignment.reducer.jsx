import { createSlice } from '@reduxjs/toolkit';

export const assignmentReducer = createSlice({
  name: 'assignment',
  initialState: {
    asset: {},
    assetName: '',
    userName: '',
    staffCode: '',
    assetCode: '',
    user: [],
    isAdd: false,
    isSelect: true,
    key: 0,
  },
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload;
    },
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
    setStaffCode: (state, action) => {
      state.staffCode = action.payload;
    },
    setAssetCode: (state, action) => {
      state.assetCode = action.payload;
    },
  },
});

export const {
  setAsset,
  setUser,
  setIsAdd,
  setIsSelect,
  setAssetName,
  setUserName,
  setStaffCode,
  setAssetCode,
  setKey,
} = assignmentReducer.actions;
export default assignmentReducer.reducer;
