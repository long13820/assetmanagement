import { createSlice } from '@reduxjs/toolkit';
export const assetReduccer = createSlice({
  name: 'asset',
  initialState: {
    loading: false,
    loadingDetail: false,
    isListAssetSuccess: false,
    isDetailAssetSuccess: false,
    isdetailAsset: false,
    listAsset: [],
    detailAsset: {},
    filter: {
      'filter[state]': 'Available,Not Available,Assigned',
      'filter[category]': undefined,
      'sort[asset_code]': 'desc',
      'sort[asset_name]': 'desc',
      'sort[category_name]': 'desc',
      'sort[state]': 'desc',
    },
    message: '',
    totalRecordPage: 0,
  },
  reducers: {
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
  },
});
export const assetAction = assetReduccer.actions;
export default assetReduccer.reducer;
