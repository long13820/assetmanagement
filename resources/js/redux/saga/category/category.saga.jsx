import { call, put, takeLatest } from 'redux-saga/effects';

import categoryAPI from '../../../api/Category/categoryAPI';
import { categoryAction } from '../../reducer/category/category.reducer';
function* handleListCategory(action) {
  try {
    const response = yield call(categoryAPI.getlistCategory, action.payload);
    if (response.status == 'success') {
      yield put(categoryAction.fetchListCategorySuccess(response));
    } else {
      yield put(categoryAction.fetchListCategoryError(response));
    }
  } catch (error) {
    yield put(categoryAction.fetchListCategoryError(error));
  }
}
export default function* categorySaga() {
  yield takeLatest(categoryAction.fetchListCategory, handleListCategory);
}
