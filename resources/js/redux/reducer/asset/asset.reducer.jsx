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
    },
    fetchListAssetError(state, action) {
      state.loading = false;
      state.isListAssetSuccess = false;
      state.listAsset = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },

    // AssetDetail

    fetctDetailAsset(state) {
      state.loadingDetail = true;
      state.isDetailAssetSuccess = true;
    },
    fetctDetailAssetSuccess(state, action) {
      state.loadingDetail = false;
      state.isDetailAssetSuccess = false;
      state.detailAsset = action.payload.data;
    },
    fetctDetaiAssetError(state, action) {
      state.loadingDetail = false;
      state.isDetailAssetSuccess = false;
      state.detailAsset = action.payload;
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
