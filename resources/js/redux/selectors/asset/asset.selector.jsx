export const assetLoadingSelector = (state) => state.asset.loading;
export const assetListSelector = (state) => state.asset.listAsset;
export const assetMessageSelector = (state) => state.asset.message;
export const assetTotalRecordPageSelector = (state) => state.asset.totalRecordPage;
export const assetFilterSelector = (state) => state.asset.filter;
export const assetKeySelector = (state) => state.asset.key;
export const assetEditData = (state) => state.asset.editData;
export const assetIsDeleteSelector = (state) => state.asset.isDelete;
// Show detail Asset
export const assetLoadingDetailSelector = (state) => state.asset.loadingDetail;
export const assetDetailSelector = (state) => state.asset.detailAsset;
// Show detail AssetAssignment
// Show detail Asset
export const assetAssignmentLoadingSelector = (state) => state.asset.loadingDetailAssignment;
export const assetAssignmentDetailSelector = (state) => state.asset.detailAssetAssignment;
export const assetIsAddSelector = (state) => state.asset.isAdd;
export const assetIsEditSelector = (state) => state.asset.isEdit;
// Get Id asset
export const assetgetIdSelector = (state) => state.asset.idAsset;
// Get sort header
export const assetgetSortHeaderSelector = (state) => state.asset.isSortHeader;
// loading assets filter
export const assetLoadingAssetFilterSelector = (state) => state.asset.loadingFilter;
