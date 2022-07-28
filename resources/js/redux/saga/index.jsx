import { all } from 'redux-saga/effects';

import { appSaga } from './app/app.saga';
import assetSaga from './asset/asset.saga';
import { assignmentSaga } from './assigment/assignment.saga';
import authSaga from './auth/auth.saga';
import categorySaga from './category/category.saga';

export default function* rootSaga() {
  yield all([...appSaga, authSaga(), assetSaga(), categorySaga(), ...assignmentSaga]);
}
