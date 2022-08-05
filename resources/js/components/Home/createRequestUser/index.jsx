import React from 'react';
import { Button } from 'react-bootstrap';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssignmentById, getReturnRequestById } from '../../../api/Assignment';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';

import './style.css';
function UserCreateRequest(props) {
  const handleCreateRequestUser = async () => {
    const resultAssigmentReturnId = await getReturnRequestById(props.assignedByIdAdmin);
    const id = props.idCreateRequestUser;
    BlockUI('#root', 'fixed');
    const date = new Date();
    const currentDate = formatDate(date, 'YYYY-MM-DD');
    const countReturnId = resultAssigmentReturnId == undefined ? 1 : parseInt(resultAssigmentReturnId.returned_id) + 1;
    const state = {
      state: 'Waiting for returning',
      returned_date: currentDate,
      returned_id: countReturnId,
    };
    const result = await editAssignmentById(id, state);
    if (result === 200) {
      SuccessToast('Create request user successfully', 3000);
      Notiflix.Block.remove('#root');
      props.forceReload();
      props.setModalCreateRequestUser();
    } else {
      ErrorToast('Create request user unsuccessfully', 3000);
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
          <div className="p-3">
            <div>
              <h6>Do you want to create a returning request for this asset? </h6>
            </div>
            <div className="d-flex align-items-center justify-content-start mt-3">
              <Button
                id="yes-btn"
                variant="danger"
                className="font-weight-bold"
                onClick={() => handleCreateRequestUser()}
              >
                Yes
              </Button>
              <Button
                id="no-btn"
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
