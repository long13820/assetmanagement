import { fork, put } from 'redux-saga/effects';

import { setCurrentPage, setTitle } from '../../reducer/app/app.reducer';

function* handleCurrentPage(action) {
  yield put(setCurrentPage(action));
}

function* handleSetTitle(action) {
  yield put(setTitle(action));
}

export const appSaga = [fork(handleCurrentPage), fork(handleSetTitle)];
