import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

export default function Login(props) {
  const { slot } = props;

  return <div id="login_page">{slot}</div>;
}

Login.propTypes = {
  slot: PropTypes.element.isRequired,
};
