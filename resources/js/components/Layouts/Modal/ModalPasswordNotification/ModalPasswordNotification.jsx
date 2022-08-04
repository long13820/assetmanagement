import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Modal from '..';

export default function ModalPasswordNotification(props) {
  return (
    <Modal
      show={props.changePasswordSuccess}
      backdrop="true"
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Notification</p>}
      elementModalBody={
        <>
          <h6 className="mb-3">Your password has been changed successfully</h6>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              variant="outline-secondary"
              className="font-weight-bold"
              onClick={() => props.setStateModal()}
            >
              Close
            </Button>
          </div>
        </>
      }
    />
  );
}

ModalPasswordNotification.propTypes = {
  changePasswordSuccess: PropTypes.bool,
  setStateModal: PropTypes.func,
};
