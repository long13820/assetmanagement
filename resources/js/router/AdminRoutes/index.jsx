import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { checkLogin, handleGetMe } from '../../adapter/AppAdapter';
import AssetCreate from '../../components/AssetCreate';
import AssetEdit from '../../components/AssetEdit';
import AdminLayout from '../../layouts/Admin';
import LoginLayout from '../../layouts/Login';
import Asset from '../../pages/Asset';
import AssignmentPage from '../../pages/Assignment';
import HomePage from '../../pages/Home';
import LoginPage from '../../pages/Login';
import UserPage from '../../pages/User';
import { setExpiredToken, setIsLogin, setUser } from '../../redux/reducer/app/app.reducer';
import { isLoginSelector, keyAssignmentSelector, keyUserSelector, userSelector } from '../../redux/selectors';
import ProtectedRoutes from '../ProtectedRoutes';
import PublicRoutes from '../PublicRoutes';

export default function AdminRoutes() {
  const dispatch = useDispatch();
  const isAuthenticate = useSelector(isLoginSelector);
  const user = useSelector(userSelector);
  const keyUser = useSelector(keyUserSelector);
  const keyAsset = useSelector((state) => state.asset.key);
  const keyAssignment = useSelector(keyAssignmentSelector);

  React.useEffect(() => {
    dispatch(setIsLogin(checkLogin()));
    if (checkLogin()) {
      handleGetMe().then((result) => {
        if (result !== 401) {
          dispatch(setUser(result));
        } else {
          dispatch(setExpiredToken(true));
          localStorage.removeItem('token');
        }
      });
    }
  }, [dispatch]);

  return (
    <Routes>
      {user?.type === 'Admin' && (
        <Route element={<ProtectedRoutes isAuthenticate={isAuthenticate} />}>
          <Route path="/" element={<AdminLayout slot={<HomePage />} />} />
          <Route path="/manage_user" element={<AdminLayout slot={<UserPage key={keyUser} />} />} />
          <Route path="/manage_asset" element={<AdminLayout slot={<Asset key={keyAsset} />} />} />
          <Route path="/manage_assignment" element={<AdminLayout slot={<AssignmentPage key={keyAssignment} />} />} />
        </Route>
      )}

      {user?.type === 'Staff' && (
        <Route element={<ProtectedRoutes isAuthenticate={isAuthenticate} />}>
          <Route path="/" element={<AdminLayout slot={<HomePage />} />} />
        </Route>
      )}

      {Object.keys(user).length === 0 && (
        <Route element={<ProtectedRoutes isAuthenticate={isAuthenticate} />}>
          <Route path="/" element={<AdminLayout slot={<HomePage />} />} />
        </Route>
      )}

      <Route element={<PublicRoutes isAuthenticate={isAuthenticate} />}>
        <Route path="/login" element={<LoginLayout slot={<LoginPage />} />} />
      </Route>

      <Route path="/asset" element={<AdminLayout slot={<AssetCreate />} />} />
      <Route path="/edit-asset/:id" element={<AdminLayout slot={<AssetEdit />} />} />
    </Routes>
  );
}
