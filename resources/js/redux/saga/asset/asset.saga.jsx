import { call, put, takeLatest } from 'redux-saga/effects';

import assetAPI from '../../../api/Asset/assetAPI';
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

export default function* assetSaga() {
  yield takeLatest(assetAction.fetchListAsset, handleListAsset);
  yield takeLatest(assetAction.fetctDetailAsset, handleAssetDetail);
}
