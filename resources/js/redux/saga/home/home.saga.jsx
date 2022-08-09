import { fork, put } from 'redux-saga/effects';

import { setHomeKey } from '../../reducer/home/home.reducer';

function* handleSetHomeKey(action) {
  yield put(setHomeKey(action));
}
export const homeSaga = [fork(handleSetHomeKey)];
