import { call, put, takeLatest } from 'redux-saga/effects';

import { handleChangePassword } from '../../../api/Auth';
import { authAction } from '../../reducer/auth/auth.reducer';

function* fetchChangePassword(action) {
  try {
    const response = yield call(handleChangePassword, action.payload.data);
    yield put(authAction.fetchChangePasswordResponse(response));
  } catch (error) {
    yield put(authAction.fetchChangePasswordResponse(error));
  }
}
export default function* authSaga() {
  yield takeLatest(authAction.fetchChangePassword, fetchChangePassword);
}
