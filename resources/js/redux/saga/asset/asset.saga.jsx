import { call, put, takeLatest } from 'redux-saga/effects';

import assetAPI from '../../../api/Asset/assetAPI';
import { getAllAssignmentsAsset } from '../../../api/Assignment';
import { assetAction } from '../../reducer/asset/asset.reducer';
function* handleListAsset(action) {
  try {
    const response = yield call(assetAPI.getlistAsset, action.payload);
    if (response.status == 'success') {
      yield put(assetAction.fetchListAssetSuccess(response));
    } else {
      yield put(assetAction.fetchListAssetError(response));
    }
  } catch (error) {
    yield put(assetAction.fetchListAssetError(error));
  }
}

// getAssetId
function* handleAssetDetail(action) {
  try {
    const response = yield call(assetAPI.getDetailAsset, action.payload);

    yield put(assetAction.fetctDetailAssetSuccess(response));
  } catch (error) {
    yield put(assetAction.fetctDetaiAssetError());
  }
}
// getAssetAssignments
function* handleAssetAssigmentDetail(action) {
  try {
    const response = yield call(getAllAssignmentsAsset, action.payload);
    yield put(assetAction.fetctDetailAssetAssignmentSuccess(response));
  } catch (error) {
    yield put(assetAction.fetctDetaiAssetAssignmentError());
  }
}

export default function* assetSaga() {
  yield takeLatest(assetAction.fetchListAsset, handleListAsset);
  yield takeLatest(assetAction.fetctDetailAsset, handleAssetDetail);
  yield takeLatest(assetAction.fetctDetailAssetAssignment, handleAssetAssigmentDetail);
}
