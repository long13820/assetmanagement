import { createSlice } from '@reduxjs/toolkit';

export const appReducer = createSlice({
  name: 'app',
  initialState: {
    isLogin: false,
    role: 'admin',
    currentPage: 1,
    totalRecord: 500,
    status: 200,
    user: {},
    title: '',
    subNameTitle: '',
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalRecord: (state, action) => {
      state.totalRecord = action.payload;
    },
    setUser: (state, action) => {
      state.user = { ...action.payload };
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setSubTitle: (state, action) => {
      state.subNameTitle = action.payload;
    },
  },
});

export const { setIsLogin, setRole, setCurrentPage, setTotalRecord, setUser, setMenu, setTitle, setSubTitle } =
  appReducer.actions;
export default appReducer.reducer;
