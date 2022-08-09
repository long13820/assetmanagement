/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Modal from '../../Layouts/Modal';

import './style.css';
export default function ModalDeleteHistory(props) {
  return (
    <Modal
      show={props.show}
      backdrop="static"
      setStateModal={() => props.setStateModalDeleteWrong()}
      elementModalTitle={
        <h5 className=" d-flex text-danger font-weight-bold">
          <p className="d-flex align-items-center w-100">
            <span className="flex-grow-1">Cannot Delete Asset</span>
            <span onClick={() => props.setStateModalDeleteWrong()} className="cursor-pointer">
              <FaTimes />
            </span>
          </p>
        </h5>
      }
      elementModalBody={
        <div>
          <h6>Cannot delete the asset because it belongs to one or more historical assignments.</h6>
          <h6>
            If the asset is not able to be used anymore, please update its state in&nbsp;
            <span
              onClick={(e) => props.handleSoftDeleteAssetWrong(e, props.id)}
              className="text-primary cursor-pointer font-weight-bold border-none bg-white text-decoration-underline m-0 p-0"
            >
              Edit Asset Page
            </span>
          </h6>
        </div>
      }
    />
  );
}

ModalDeleteHistory.propTypes = {
  id: PropTypes.number,
  show: PropTypes.bool,
  setStateModalDeleteWrong: PropTypes.func,
  handleSoftDeleteAssetWrong: PropTypes.func,
};
