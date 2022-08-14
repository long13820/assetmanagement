import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAsset } from '../../../api/Asset/assetAPI';
import { completeRequestById } from '../../../api/Assignment';
import { setExpiredToken } from '../../../redux/reducer/app/app.reducer';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';

import './style.css';
function ModalCompleteRequest(props) {
  const dispatch = useDispatch();

  const handleCompleteRequest = async () => {
    const id = props.idRequest;
    BlockUI('#root', 'fixed');
    const date = new Date();
    const currentDate = formatDate(date, 'YYYY-MM-DD');
    const state = {
      state: 'Completed',
      returned_date: currentDate,
    };
    const result = await completeRequestById(id, state);
    if (result === 200) {
      await editAsset(
        {
          state: 'Available',
        },
        props.idAsset
      );
      SuccessToast('Complete Request Successfully', 3000);
      Notiflix.Block.remove('#root');
      props.forceReload();
      props.setModalCompleteRequest();
    } else if (result === 401) {
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
      Notiflix.Block.remove('#root');
    } else {
      ErrorToast('Create request user unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
      props.setModalCompleteRequest();
    }
  };
  return (
    <div className="edit_form d-flex justify-content-center">
      <Modal
        show={props.show}
        setStateModal={() => {
          props.setModalCompleteRequest();
        }}
        backdrop="static"
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3">
              <h6>Do you want to mark this returning request as &apos;Completed&apos;?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                onClick={() => handleCompleteRequest()}
                id="yes-btn"
                variant="danger"
                className="font-weight-bold"
              >
                Yes
              </Button>
              <Button
                id="no-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => {
                  props.setModalCompleteRequest();
                }}
              >
                No
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
}

ModalCompleteRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.any,
  forceReload: PropTypes.func,
  setModalCompleteRequest: PropTypes.func,
  assignedByIdAdmin: PropTypes.any,
  idRequest: PropTypes.any,
  idAsset: PropTypes.any,
};

export default ModalCompleteRequest;
