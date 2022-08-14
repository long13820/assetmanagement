import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { checkLogin } from '../../adapter/AppAdapter';

export default function ProtectedRoutes() {
  const isAuthenticate = checkLogin();

  return isAuthenticate ? <Outlet /> : <Navigate to="/login" />;
}
