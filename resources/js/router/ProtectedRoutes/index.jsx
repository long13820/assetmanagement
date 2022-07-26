import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProtectedRoutes(props) {
  const { isAuthenticate } = props;
  return isAuthenticate ? <Outlet /> : <Navigate to="/login" />;
}

ProtectedRoutes.propTypes = {
  isAuthenticate: PropTypes.bool.isRequired,
};
