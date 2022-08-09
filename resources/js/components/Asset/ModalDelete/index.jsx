import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Modal from '../../Layouts/Modal';

import './style.css';

export default function ModalDelete(props) {
  return (
    <Modal
      show={props.show}
      backdrop="static"
      setStateModal={() => props.setStateModalDelete()}
      elementModalTitle={<p>Are you sure?</p>}
      elementModalBody={
        <div>
          <h6>Do you want to delete this asset?</h6>
          <div className="d-flex align-items-center justify-content-start mt-3">
            <Button
              id="yes-btn"
              variant="danger"
              className="font-weight-bold"
              onClick={() => props.handleSoftDeleteAsset(props.id)}
            >
              Delete
            </Button>
            <Button
              id="no-btn"
              variant="outline-secondary"
              className="ms-3 font-weight-bold"
              onClick={() => props.setStateModalDelete()}
            >
              Cancel
            </Button>
          </div>
        </div>
      }
    />
  );
}

ModalDelete.propTypes = {
  id: PropTypes.number,
  show: PropTypes.bool,
  setStateModalDelete: PropTypes.func,
  handleSoftDeleteAsset: PropTypes.func,
};
