import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ModalNotification({ title = 'Notifications!', content, show, setShow }) {
  return (
    <div>
      <Modal show={show} onHide={() => setShow(false)} top id="detail-dialog">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#CF2338' }}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
      </Modal>
    </div>
  );
}

ModalNotification.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  show: PropTypes.any,
  setShow: PropTypes.any,
};
