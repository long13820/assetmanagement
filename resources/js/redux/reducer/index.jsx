import { combineReducers } from 'redux';

import appReducer from './app/app.reducer';
import assetReduccer from './asset/asset.reducer';
import assignmentReducer from './assignment/assignment.reducer';
import authReducer from './auth/auth.reducer';
import categoryReduccer from './category/category.reducer';
import homeReducer from './home/home.reducer';
import requestReducer from './request/request.reducer';
import userReducer from './user/user.reducer';

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  auth: authReducer,
  asset: assetReduccer,
  category: categoryReduccer,
  assignment: assignmentReducer,
  home: homeReducer,
  request: requestReducer,
});

export default rootReducer;
