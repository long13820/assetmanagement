import React from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssignmentById } from '../../../api/Assignment';
import { setExpiredToken } from '../../../redux/reducer/app/app.reducer';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import ModalCompleteRequest from '../ModalCompleteRequest';

export default function RequestsTable(props) {
  const [assignmentId, setAssignmentId] = React.useState(-1);
  const [modalCancelRequest, setModalCancelRequest] = React.useState(false);

  const dispatch = useDispatch();

  function handleCancelClick(id) {
    setModalCancelRequest(true);
    setAssignmentId(id);
  }

  const changeStateToCancelRequestOfReturning = async () => {
    BlockUI('#root', 'fixed');
    const state = {
      state: 'Accepted',
    };

    const result = await editAssignmentById(assignmentId, state);
    if (result === 200) {
      SuccessToast('Cancel returning request successfully', 3000);
      setModalCancelRequest(false);
      setAssignmentId(-1);
      // eslint-disable-next-line react/prop-types
      props.forceReload();
    } else if (result === 401) {
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
      Notiflix.Block.remove('#root');
    } else {
      ErrorToast('Cancel returning request unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };

  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);
    if (!valueAsc && !valueDesc) {
      if (key === 'No.') key = 'id';
      if (key === 'Requested by') key = 'Assigned to';
      if (key === 'Accepted by') key = 'Assigned by';
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      tempTableHeader[findIndexHeader].isSortAsc = true;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 8) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (valueAsc && !valueDesc) {
      if (key === 'No.') key = 'id';
      if (key === 'Requested by') key = 'Assigned to';
      if (key === 'Accepted by') key = 'Assigned by';
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 8) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (!valueAsc && valueDesc) {
      tempSort[0].key = 'updated_at';
      tempSort[0].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 5 && index != 2) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    props.handleSort(tempSort, tempTableHeader);
  };
  const [showModalCompleteRequest, setModalComplelteRequest] = React.useState(false);
  const [idRequest, setRequest] = React.useState('');
  const [idAsset, setIdAsset] = React.useState('');
  const handleCompleteRequestClick = async (id, id_asset) => {
    setModalComplelteRequest(true);
    setRequest(id);
    setIdAsset(id_asset);
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.no}</td>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.requested_by}</td>
          <td>{formatDate(item.assigned_date, 'DD/MM/YYYY')}</td>
          <td>{item.accepted_by}</td>
          <td>{item.state === 'Completed' ? formatDate(item.returned_date, 'DD/MM/YYYY') : undefined}</td>
          <td>
            <p
              className={`${
                item.state === 'Completed' ? 'bg-success-100 text-success' : 'bg-red-100 text-red'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.state}
            </p>
          </td>
          <td>
            <div className="d-flex">
              <button
                id="request-accept-btn"
                className={`br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none ${
                  item.state === 'Completed' && 'cursor-no-drop'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  item.state === 'Completed' ? undefined : handleCompleteRequestClick(item.id, item.asset_id);
                }}
              >
                <FaCheck className={`text-danger font-20px ${item.state === 'Completed' ? 'opacity-50' : ''}`} />
              </button>
              <button
                id="request-cancel-btn"
                className={`br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none ms-3 ${
                  item.state === 'Completed' && 'cursor-no-drop'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  item.state === 'Completed' ? undefined : handleCancelClick(item.id);
                }}
              >
                <FaTimes className={`text-black font-20px ${item.state === 'Completed' ? 'opacity-50' : ''}`} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <Table tableHeader={props.renderTableHeader} tableBody={renderTableBody()} handleSort={handleSort} />
      <ModalCompleteRequest
        show={showModalCompleteRequest}
        setModalCompleteRequest={() => {
          setModalComplelteRequest(false);
          setRequest('');
          setIdAsset('');
        }}
        idRequest={idRequest}
        idAsset={idAsset}
        forceReload={() => props.forceReload()}
      />
      <Modal
        show={modalCancelRequest}
        setStateModal={() => {
          setModalCancelRequest(false);
          setAssignmentId(-1);
        }}
        backdrop="static"
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3">
              <h6>Do you want to cancel this returning request?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                onClick={() => changeStateToCancelRequestOfReturning()}
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
                  setModalCancelRequest(false);
                  setAssignmentId(-1);
                }}
              >
                No
              </Button>
            </div>
          </>
        }
      />
    </>
  );
}

RequestsTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
  forceReload: PropTypes.func,
};
