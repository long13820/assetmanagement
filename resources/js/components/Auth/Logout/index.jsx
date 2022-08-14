import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../../adapter/AppAdapter';
import { setExpiredToken } from '../../../redux/reducer/app/app.reducer';
import Modal from '../../Layouts/Modal';

export default function Logout(props) {
  const [backdrop, setBackdrop] = React.useState('static');

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setBackdrop('static');
    const response = await logout();
    if (response === 500) {
      setBackdrop('static');
    }
    if (response === 401) {
      props.setStateModal();
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    }
  };

  return (
    <Modal
      show={props.show}
      backdrop={backdrop}
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Are you sure?</p>}
      elementModalBody={
        <div>
          <h6 className="mb-3">Do you want to logout?</h6>
          <div className="d-flex align-items-center justify-content-end">
            <Button type="submit" variant="danger" className="me-3 font-weight-bold" onClick={() => handleLogout()}>
              Logout
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => props.setStateModal()}
            >
              Cancel
            </Button>
          </div>
        </div>
      }
    />
  );
}

Logout.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
