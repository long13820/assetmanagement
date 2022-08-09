import { fork, put } from 'redux-saga/effects';

import { setRequestKey } from '../../reducer/request/request.reducer';

function* handleSetRequestKey(action) {
  yield put(setRequestKey(action));
}
export const homeSaga = [fork(handleSetRequestKey)];
