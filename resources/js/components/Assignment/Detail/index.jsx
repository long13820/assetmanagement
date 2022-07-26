/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { formatDate } from '../../../utils/formatDate';
import Modal from '../../Layouts/Modal';

export default function AssignmentDetail(props) {
  return (
    <Modal
      show={props.show}
      backdrop={true}
      setStateModal={() => props.setStateModal()}
      elementModalTitle={
        <p className="d-flex align-items-center w-100">
          <span className="flex-grow-1">Detailed Assignment Information</span>
          <span onClick={() => props.setStateModal()} className="cursor-pointer">
            <FaTimes />
          </span>
        </p>
      }
      elementModalBody={
        <div>
          <table align="center" border="0" className="table table-bordered mb-0">
            <tbody>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Asset Code</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.asset_code}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Asset Name</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.asset_name}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Specification</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.specification}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Assigned to</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.assigned_to}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Assigned by</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.assigned_by}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Assigned Date</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{formatDate(props.detail?.assigned_date, 'DD/MM/YYYY')}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>State</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{capitalizeFirstLetter(props.detail?.state)}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Note</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.note}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    />
  );
}

AssignmentDetail.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
  detail: PropTypes.object,
};
