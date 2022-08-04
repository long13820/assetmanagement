import { fork, put } from 'redux-saga/effects';

import { setAsset, setAssetName, setIsAdd, setKey, setUserName } from '../../reducer/assignment/assignment.reducer';

function* handleSetAsset(action) {
  yield put(setAsset(action));
}

function* handleSetIsAdd(action) {
  yield put(setIsAdd(action));
}

function* handleSetAssetName(action) {
  yield put(setAssetName(action));
}

function* handleSetUserName(action) {
  yield put(setUserName(action));
}

function* handleSetKey(action) {
  yield put(setKey(action));
}

export const assignmentSaga = [
  fork(handleSetAsset),
  fork(handleSetIsAdd),
  fork(handleSetAssetName),
  fork(handleSetUserName),
  fork(handleSetKey),
];
