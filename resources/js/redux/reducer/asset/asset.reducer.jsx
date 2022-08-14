import { createSlice } from '@reduxjs/toolkit';
export const assetReduccer = createSlice({
  name: 'asset',
  initialState: {
    loading: false,
    loadingDetail: false,
    loadingFilter: false,
    isListAssetSuccess: false,
    isDetailAssetSuccess: false,
    isdetailAsset: false,
    listAsset: [],
    detailAsset: {},
    detailAssetAssignment: [],
    isDetailAssetAssignmentSuccess: false,
    loadingDetailAssignment: false,
    isAdd: false,
    isEdit: false,
    key: 0,
    isSortHeader: false,
    idAsset: '',
    filter: {
      'filter[state]': 'Available,Not Available,Assigned',
      'filter[category]': undefined,
      'sort[asset_code]': 'asc',
      'sort[asset_name]': undefined,
      'sort[category_name]': undefined,
      'sort[state]': undefined,
      'sort[updated_at]': undefined,
    },
    message: '',
    totalRecordPage: 0,
    editData: {},
    code: 200,
  },
  reducers: {
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
    setKey: (state, action) => {
      state.key = action.payload;
    },
    setIsAdd: (state, action) => {
      state.isAdd = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload.isEdit;
      state.idAsset = action.payload.idAsset;
    },

    setSortHeader: (state, action) => {
      state.isSortHeader = action.payload;
    },
    setLoadingFilter: (state, action) => {
      state.loadingFilter = action.payload;
    },
    fetchListAsset(state) {
      state.loading = true;
      state.isListAssetSuccess = true;
    },
    fetchListAssetSuccess(state, action) {
      state.loading = false;
      state.isListAssetSuccess = false;
      state.listAsset = action.payload.data.data;
      state.message = action.payload.data.message;
      state.totalRecordPage = action.payload.data.meta.total;
      state.loadingFilter = false;
      state.code === 200;
    },
    fetchListAssetError(state) {
      state.loading = false;
      state.loadingFilter = false;
      state.isListAssetSuccess = false;
      state.listAsset = [];
      state.totalRecordPage = 0;
      state.code = 500;
    },
    fetchListAssetUnthorization(state) {
      state.loading = false;
      state.loadingFilter = false;
      state.isListAssetSuccess = false;
      state.listAsset = [];
      state.totalRecordPage = 0;
      state.code = 401;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },

    // AssetDetail

    fetctDetailAsset(state) {
      state.loadingDetail = true;
      state.isDetailAssetSuccess = true;
      state.code = 200;
    },
    fetctDetailAssetSuccess(state, action) {
      state.loadingDetail = false;
      state.isDetailAssetSuccess = false;
      state.detailAsset = action.payload.data;
      state.code = 200;
    },
    fetctDetaiAssetError(state) {
      state.loadingDetail = false;
      state.isDetailAssetSuccess = false;
      state.code = 500;
      state.detailAsset = {};
    },
    fetchDetailAssetUnthorization(state) {
      state.loadingDetail = false;
      state.isDetailAssetSuccess = false;
      state.code = 401;
      state.detailAsset = {};
    },

    fetctDetailAssetAssignment(state) {
      state.loadingDetailAssignment = true;
      state.isDetailAssetAssignmentSuccess = true;
    },
    fetctDetailAssetAssignmentSuccess(state, action) {
      state.loadingDetailAssignment = false;
      state.isDetailAssetAssignmentSuccess = false;
      state.detailAssetAssignment = action.payload.data.data;
    },
    fetctDetaiAssetAssignmentError(state) {
      state.loadingDetailAssignment = false;
      state.isDetailAssetAssignmentSuccess = false;
      state.detailAssetAssignment = [];
    },
  },
});
export const assetAction = assetReduccer.actions;
export default assetReduccer.reducer;
