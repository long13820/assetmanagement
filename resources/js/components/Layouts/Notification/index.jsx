import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Modal from '../Modal';

export default function Notification(props) {
  return (
    <Modal
      show={props.show}
      backdrop="static"
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Notifcation</p>}
      elementModalBody={
        <div>
          <div>
            <h6>Do you want to cancel?</h6>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <Button id="yes-btn" variant="danger" className="font-weight-bold" onClick={() => props.backToView()}>
              Yes
            </Button>
            <Button
              id="no-btn"
              variant="outline-secondary"
              className="ms-3 font-weight-bold"
              onClick={() => props.setStateModal()}
            >
              No
            </Button>
          </div>
        </div>
      }
    />
  );
}

Notification.propTypes = {
  show: PropTypes.bool,
  setStateModal: PropTypes.func,
  backToView: PropTypes.func,
};
