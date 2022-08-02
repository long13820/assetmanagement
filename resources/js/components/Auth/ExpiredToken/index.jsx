import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Modal from '../../Layouts/Modal';
export default function ExpiredToken(props) {
  return (
    <Modal
      show={props.show}
      backdrop="static"
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Notification</p>}
      elementModalBody={
        <div>
          <h6>
            Your session has expired, please <span className="font-weight-bold">login</span>&nbsp;again
          </h6>
          <div className="d-flex align-items-center justify-content-end">
            <Button variant="danger" href="/login" className="font-weight-bold">
              I understand
            </Button>
          </div>
        </div>
      }
    />
  );
}

ExpiredToken.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func,
};
