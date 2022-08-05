import React from 'react';
import { FaPen, FaTimesCircle, FaUndoAlt } from 'react-icons/fa';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssetById } from '../../../api/Asset/assetAPI';
import { deleteAssignment, getAssignmentById } from '../../../api/Assignment';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import AssignmentDetail from '../Detail';
import ModalDelete from '../ModalDelete/ModalDelete';

export default function AssignmentTable(props) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [confirmIdDelete, setConfirmIdDelete] = React.useState(-1);
  const [confirmIdAsset, setConfirmIdAsset] = React.useState(-1);

  const handleEditAssignment = (e, id) => {
    e.stopPropagation();
    console.log(id);
  };

  const handleSort = (key, valueAsc, valueDesc) => {
    let tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      if (tempSort.length === 0) {
        tempSort.push({
          key: '',
          value: '',
        });
      }
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      if (tempSort[0].key === 'No.') {
        tempSort[0].key = 'Id';
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
      if (tempSort.length === 0) {
        tempSort.push({
          key: '',
          value: '',
        });
      }
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      if (tempSort[0].key === 'No.') {
        tempSort[0].key = 'Id';
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
      tempSort = [];
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
    } else {
      Notiflix.Block.remove('#root');
    }
  };
  const handleSoftDeleteAssigment = async (id, assetId) => {
    BlockUI('#root', 'fixed');
    const stateField = { state: 'Available' };
    const response = await deleteAssignment(id);
    const responseTwo = await editAssetById(assetId, stateField);
    if (response === 200 && responseTwo === 200) {
      SuccessToast('Delete assignment is successfully', 3000);
      props.backtoManageAssignment();
      setStateModalDelete();
    } else {
      ErrorToast('Delete assignment is unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };
  const handleShowConfirm = (e, id, assetId) => {
    e.stopPropagation();
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
          <td>{item.id}</td>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.assigned_to}</td>
          <td>{item.assigned_by}</td>
          <td>{formatDate(item.assigned_date, 'DD/MM/YYYY')}</td>
          <td>{item.state}</td>
          <td>
            <div className="d-flex">
              <button className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none">
                <FaPen className="text-black font-20px" />
              </button>

              <span>
                {item.state === 'Waiting for acceptance' || item.state === 'Declined' ? (
                  <>
                    <button
                      onClick={(e) => handleShowConfirm(e, item.id, item.asset_id)}
                      className="br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
                    >
                      <FaTimesCircle className="text-danger font-20px" />
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none opacity-25"
                  >
                    <FaTimesCircle className="text-danger font-20px" />
                  </button>
                )}
              </span>
              <span className="br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center">
                <FaUndoAlt className="text-primary font-20px" />
              </span>
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
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
  backtoManageAssignment: PropTypes.func,
};
