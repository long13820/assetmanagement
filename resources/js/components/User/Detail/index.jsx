/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { formatDate } from '../../../utils/formatDate';
import Modal from '../../Layouts/Modal';

export default function UserDetail(props) {
  return (
    <Modal
      show={props.show}
      backdrop={true}
      setStateModal={() => props.setStateModal()}
      elementModalTitle={
        <p className="d-flex align-items-center w-100">
          <span className="flex-grow-1">Detailed User Information</span>
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
                    <strong>Staff Code</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.staff_code}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Full Name</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.full_name}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Username</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.username}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Date of birth</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{formatDate(props.detail?.date_of_birth, 'DD/MM/YYYY')}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Gender</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{capitalizeFirstLetter(props.detail?.gender)}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Joined Date</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{formatDate(props.detail?.joined_date, 'DD/MM/YYYY')}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Type</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.type}</p>
                </td>
              </tr>
              <tr>
                <td className="ps-0">
                  <p>
                    <strong>Location</strong>
                  </p>
                </td>
                <td className="pe-0">
                  <p>{props.detail?.user_location.name}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    />
  );
}

UserDetail.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
  detail: PropTypes.object,
};
