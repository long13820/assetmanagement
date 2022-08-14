import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPen, FaTimesCircle, FaUndoAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssetById } from '../../../api/Asset/assetAPI';
import { deleteAssignment, editAssignmentById, getAssignmentById, getReturnRequestById } from '../../../api/Assignment';
import { setExpiredToken, setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setAssignment, setIsEdit } from '../../../redux/reducer/assignment/assignment.reducer';
import { userSelector } from '../../../redux/selectors';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import AssignmentDetail from '../Detail';
import ModalDelete from '../ModalDelete/ModalDelete';

export default function AssignmentTable(props) {
  const userDetail = useSelector(userSelector);
  const [showDetail, setShowDetail] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [confirmIdDelete, setConfirmIdDelete] = React.useState(-1);
  const [confirmIdAsset, setConfirmIdAsset] = React.useState(-1);
  const [assignmentId, setAssignmentId] = React.useState(-1);
  const [modalReturnAssignment, setModalReturnAssignment] = React.useState(false);
  const [assignedIdAdmin, setAssignedIdAdmin] = React.useState('');
  const dispatch = useDispatch();

  const handleReturnAssignmentClick = async (id, assigned_by_id) => {
    setModalReturnAssignment(true);
    setAssignmentId(id);
    setAssignedIdAdmin(assigned_by_id);
  };

  const changeStateToReturnAssignment = async () => {
    BlockUI('#root', 'fixed');
    const resultAssigmentReturnId = await getReturnRequestById(assignedIdAdmin);
    const countReturnId = resultAssigmentReturnId == undefined ? 1 : parseInt(resultAssigmentReturnId.returned_id) + 1;
    const state = {
      state: 'Waiting for returning',
      returned_id: countReturnId,
      requested_id: userDetail.id,
    };

    const result = await editAssignmentById(assignmentId, state);
    if (result === 200) {
      SuccessToast('The request for returning is created successfully', 3000);
      setModalReturnAssignment(false);
      setAssignmentId(-1);
      props.forceReload();
    } else {
      ErrorToast('The request for returning is created unsuccessfully', 3000);
    }
  };

  const handleEditAssignment = async (id) => {
    BlockUI('#root', 'fixed');
    const data = await getAssignmentById(id);
    if (Object.keys(data).length > 0) {
      dispatch(setAssignment(data));
      dispatch(setIsEdit(true));
      dispatch(setSubTitle('Edit assignment'));
      Notiflix.Block.remove('#root');
    } else {
      Notiflix.Block.remove('#root');
    }
  };

  const handleSort = (key, valueAsc, valueDesc) => {
    let tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      if (tempSort[0].key === 'No.') {
        tempSort[0].key = 'Created At';
      }
      tempTableHeader[findIndexHeader].isSortAsc = true;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 7) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (valueAsc && !valueDesc) {
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      if (tempSort[0].key === 'No.') {
        tempSort[0].key = 'Created At';
      }
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 7) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (!valueAsc && valueDesc) {
      tempSort[0].key = 'created_at';
      tempSort[0].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 7) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    props.handleSort(tempSort, tempTableHeader);
  };

  const handleShowDetail = async (id) => {
    BlockUI('#root', 'fixed');
    const data = await getAssignmentById(id);
    if (Object.keys(data).length > 0) {
      Notiflix.Block.remove('#root');
      setDetail({ ...data });
      setShowDetail(true);
    } else if (data === 401) {
      Notiflix.Block.remove('#root');
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else {
      Notiflix.Block.remove('#root');
      ErrorToast('Something went wrong. Please try again', 3000);
    }
  };
  const handleSoftDeleteAssigment = async (id, assetId) => {
    BlockUI('#root', 'fixed');
    const stateField = { state: 'Available' };
    const response = await deleteAssignment(id);
    if (response === 200) {
      const responseTwo = await editAssetById(assetId, stateField);
      if (responseTwo === 200) {
        SuccessToast('Delete assignment is successfully', 3000);
        props.backtoManageAssignment();
        setStateModalDelete();
      } else if (response === 401) {
        dispatch(setExpiredToken(true));
        localStorage.removeItem('token');
      }
    } else if (response === 401) {
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else {
      ErrorToast('Delete assignment is unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };
  const handleShowConfirm = (id, assetId) => {
    setConfirmIdDelete(id);
    setConfirmIdAsset(assetId);
    setConfirmDelete(true);
  };
  const setStateModalDelete = () => {
    setConfirmIdDelete(-1);
    setConfirmIdAsset(-1);
    setConfirmDelete(false);
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id} className="cursor-pointer" onClick={() => handleShowDetail(item.id)}>
          <td>{item.no}</td>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.assigned_to}</td>
          <td>{item.assigned_by}</td>
          <td>{formatDate(item.assigned_date, 'DD/MM/YYYY')}</td>
          <td>
            <p
              className={`${item.state === 'Waiting for returning' && 'bg-blue-100 text-blue'} ${
                item.state === 'Accepted' && 'bg-red-100 text-red'
              } ${item.state === 'Waiting for acceptance' && 'bg-infor-100 text-info'} ${
                item.state === 'Declined' && 'bg-warning-100 text-warning'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.state}
            </p>
          </td>
          <td>
            <div className="d-flex">
              <button
                id="manage-assignment-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  item.state !== 'Waiting for acceptance' ? undefined : handleEditAssignment(item.id);
                }}
                className={`br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none ${
                  item.state !== 'Waiting for acceptance' && 'cursor-no-drop'
                }`}
              >
                <FaPen className={`text-black font-20px ${item.state !== 'Waiting for acceptance' && 'opacity-50'}`} />
              </button>
              <button
                id="manage-assignment-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  item.state !== 'Waiting for acceptance' ? undefined : handleShowConfirm(item.id, item.asset_id);
                }}
                className={`br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none mx-3 ${
                  item.state !== 'Waiting for acceptance' && 'cursor-no-drop'
                }`}
              >
                <FaTimesCircle
                  className={`text-danger font-20px ${item.state !== 'Waiting for acceptance' && 'opacity-50'}`}
                />
              </button>
              <button
                id="manage-assignment-request-btn"
                className={`br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none ${
                  item.state !== 'Accepted' && 'cursor-no-drop'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  item.state !== 'Accepted' ? undefined : handleReturnAssignmentClick(item.id, item.assigned_by_id);
                }}
              >
                <FaUndoAlt className={`text-blue font-18px ${item.state !== 'Accepted' && 'opacity-50'}`} />
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
      {Object.keys(detail).length > 0 && (
        <AssignmentDetail show={showDetail} detail={detail} setStateModal={() => setShowDetail(false)} />
      )}
      <Modal
        show={modalReturnAssignment}
        setStateModal={() => {
          setModalReturnAssignment(false);
          setAssignmentId(-1);
        }}
        backdrop="static"
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3">
              <h6>Do you want to create a returning request for this asset?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                onClick={() => changeStateToReturnAssignment()}
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
                  setModalReturnAssignment(false);
                  setAssignmentId(-1);
                }}
              >
                No
              </Button>
            </div>
          </>
        }
      />
      <ModalDelete
        show={confirmDelete}
        id={confirmIdDelete}
        assetId={confirmIdAsset}
        setStateModalDelete={() => setStateModalDelete()}
        handleSoftDeleteAssigment={handleSoftDeleteAssigment}
      />
    </>
  );
}

AssignmentTable.propTypes = {
  data: PropTypes.any.isRequired,
  forceReload: PropTypes.func,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
  backtoManageAssignment: PropTypes.func,
};
