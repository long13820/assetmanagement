import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function PublicRoutes(props) {
  const { isAuthenticate } = props;
  return isAuthenticate ? <Navigate to="/" /> : <Outlet />;
}

PublicRoutes.propTypes = {
  isAuthenticate: PropTypes.bool.isRequired,
};
