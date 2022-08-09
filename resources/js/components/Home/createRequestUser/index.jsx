import React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssignmentById } from '../../../api/Assignment';
import { userSelector } from '../../../redux/selectors';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';

import './style.css';
function UserCreateRequest(props) {
  const userDetail = useSelector(userSelector);

  const handleCreateRequestUser = async () => {
    const id = props.idCreateRequestUser;
    BlockUI('#root', 'fixed');
    const state = {
      state: 'Waiting for returning',
      requested_id: userDetail.id,
    };
    const result = await editAssignmentById(id, state);
    if (result === 200) {
      SuccessToast('The request for returning is created successfully', 3000);
      Notiflix.Block.remove('#root');
      props.forceReload();
      props.setModalCreateRequestUser();
    } else {
      ErrorToast('The request for returning is created unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
      props.setModalCreateRequestUser();
    }
  };
  return (
    <div className="edit_form d-flex justify-content-center">
      <Modal
        show={props.show}
        backdrop="static"
        setStateModal={() => {
          props.setModalCreateRequestUser();
        }}
        elementModalTitle={<p className="font-weight-bold">Are you sure?</p>}
        elementModalBody={
          <div>
            <div>
              <h6>Do you want to create a returning request for this asset? </h6>
            </div>
            <div className="d-flex align-items-center justify-content-start mt-3">
              <Button
                id="request-yes-btn"
                variant="danger"
                className="font-weight-bold"
                onClick={() => handleCreateRequestUser()}
              >
                Yes
              </Button>
              <Button
                id="request-no-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => props.setModalCreateRequestUser()}
              >
                No
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

UserCreateRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.any,
  forceReload: PropTypes.func,
  setModalCreateRequestUser: PropTypes.func,
  assignedByIdAdmin: PropTypes.any,
  idCreateRequestUser: PropTypes.any,
};

export default UserCreateRequest;
