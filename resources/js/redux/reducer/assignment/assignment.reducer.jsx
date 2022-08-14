import { createSlice } from '@reduxjs/toolkit';

export const assignmentReducer = createSlice({
  name: 'assignment',
  initialState: {
    assignment: {},
    asset: {},
    assetName: '',
    userName: '',
    staffCode: '',
    assetCode: '',
    user: {},
    isAdd: false,
    isSelect: true,
    key: 0,
    isEdit: false,
    assetId: 0,
    userId: 0,
    isSearching: false,
    isSearchingAsset: false,
    isFocusAsset: false,
    isFocusUser: false,
  },
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload;
    },
    setAsset: (state, action) => {
      state.asset = { ...action.payload };
    },
    setAssignment: (state, action) => {
      state.assignment = { ...action.payload };
    },
    setAssetName: (state, action) => {
      state.assetName = action.payload;
    },
    setUser: (state, action) => {
      state.user = { ...action.payload };
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
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setAssetId: (state, action) => {
      state.assetId = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setIsSearchingAsset: (state, action) => {
      state.isSearchingAsset = action.payload;
    },
    setIsFocusAsset: (state, action) => {
      state.isFocusAsset = action.payload;
    },
    setIsFocusUser: (state, action) => {
      state.isFocusUser = action.payload;
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
  setIsEdit,
  setAssignment,
  setUserId,
  setAssetId,
  setIsSearching,
  setIsSearchingAsset,
  setIsFocusAsset,
  setIsFocusUser,
} = assignmentReducer.actions;
export default assignmentReducer.reducer;
