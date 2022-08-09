/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck, FaTimes, FaUndoAlt } from 'react-icons/fa';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAsset } from '../../../api/Asset/assetAPI';
import { acceptAssignment, declineAssignment, getAssignmentById } from '../../../api/Assignment';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import UserCreateRequest from '../createRequestUser';

export default function HomeTable(props) {
  const [showModalCreateRequestUser, setModalCreateRequestUser] = React.useState(false);
  const [idCreateRequestUser, setCreateRequestUser] = React.useState('');
  const [assignedIdAdmin, setAssignedIdAdmin] = React.useState('');
  const [acceptId, setAcceptId] = React.useState(-1);
  const [assetId, setAssetId] = React.useState(-1);
  const [modalAcceptAssignment, setModalAcceptAssignment] = React.useState(false);
  const [modalDeclineAssignment, setModalDeclineAssignment] = React.useState(false);
  const [modalDetailAssignment, setModalDetailAssignment] = React.useState(false);
  const [detail, setDetail] = React.useState({});

  const handleCreateRequestUser = async (e, id, assigned_by_id) => {
    e.stopPropagation();
    setModalCreateRequestUser(true);
    setCreateRequestUser(id);
    setAssignedIdAdmin(assigned_by_id);
  };

  const handleAcceptAssignmentClick = async (e, id) => {
    e.stopPropagation();
    setModalAcceptAssignment(true);
    setAcceptId(id);
  };

  const handleDeclineAssigmentClick = async (e, id, id_asset) => {
    e.stopPropagation();
    setModalDeclineAssignment(true);
    setAcceptId(id);
    setAssetId(id_asset);
  };

  const changeStateToAcceptAssignment = async () => {
    BlockUI('#root', 'fixed');
    const result = await acceptAssignment(acceptId);
    if (result === 200) {
      SuccessToast('Accept assignment successfully', 3000);
      setModalAcceptAssignment(false);
      setAcceptId(-1);
      props.forceReload();
    } else {
      ErrorToast('Accept assignment unsuccessfully', 3000);
    }
  };

  const changeStateToDeclineAssignment = async () => {
    BlockUI('#root', 'fixed');
    const result = await declineAssignment(acceptId);
    if (result === 200) {
      SuccessToast('Decline assignment successfully', 3000);
      await editAsset(
        {
          state: 'Available',
        },
        assetId
      );
      setModalDeclineAssignment(false);
      setAcceptId(-1);
      setAssetId(-1);
      props.forceReload();
    } else {
      ErrorToast('Decline assignment unsuccessfully', 3000);
    }
  };

  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      if (key === 'Category') key = 'Categories';
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      tempTableHeader[findIndexHeader].isSortAsc = true;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 5) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (valueAsc && !valueDesc) {
      if (key === 'Category') key = 'Categories';
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 5) {
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
        if (index != findIndexHeader && index != 5) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    props.handleSort(tempSort, tempTableHeader);
  };

  const showDetailMyAssignment = async (id) => {
    BlockUI('#root', 'fixed');
    const result = await getAssignmentById(id);
    if (Object.keys(result).length > 0) {
      setDetail({ ...result });
      setModalDetailAssignment(true);
      Notiflix.Block.remove('#root');
    }
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id} onClick={() => showDetailMyAssignment(item.id)} className="cursor-pointer">
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.category_name}</td>
          <td>{item.assigned_date}</td>
          <td>
            <p
              className={`${item.state === 'Waiting for returning' && 'bg-blue-100 text-blue'} ${
                item.state === 'Accepted' && 'bg-red-100 text-red'
              } ${
                item.state === 'Waiting for acceptance' && 'bg-success-100 text-success'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.state}
            </p>
          </td>
          <td>
            <div className="d-flex">
              <button
                id="home-accept-btn"
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
                disabled={item.state !== 'Waiting for acceptance'}
                onClick={(e) => {
                  handleAcceptAssignmentClick(e, item.id);
                }}
              >
                <FaCheck
                  className={`text-danger font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-50' : ''}`}
                />
              </button>
              <button
                id="home-decline-btn"
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none mx-3"
                disabled={item.state !== 'Waiting for acceptance'}
                onClick={(e) => {
                  handleDeclineAssigmentClick(e, item.id, item.asset_id);
                }}
              >
                <FaTimes
                  className={`text-black font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-50' : ''}`}
                />
              </button>

              <button
                id="home-request-btn"
                disabled={item.state !== 'Accepted'}
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
                onClick={(e) => {
                  handleCreateRequestUser(e, item.id, item.assigned_by_id);
                }}
              >
                <FaUndoAlt className={`text-blue font-18px ${item.state !== 'Accepted' ? 'opacity-50' : ''}`} />
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
      <UserCreateRequest
        show={showModalCreateRequestUser}
        setModalCreateRequestUser={() => setModalCreateRequestUser(false)}
        idCreateRequestUser={idCreateRequestUser}
        assignedByIdAdmin={assignedIdAdmin}
        forceReload={() => props.forceReload()}
      />
      <Modal
        show={modalAcceptAssignment}
        setStateModal={() => {
          setModalAcceptAssignment(false);
          setAcceptId(-1);
        }}
        backdrop="static"
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3">
              <h6>Do you want to accept this assignment?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                onClick={() => changeStateToAcceptAssignment()}
                id="accept-yes-btn"
                variant="danger"
                className="font-weight-bold"
              >
                Accept
              </Button>
              <Button
                id="accept-no-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => {
                  setModalAcceptAssignment(false);
                  setAcceptId(-1);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        }
      />
      <Modal
        show={modalDeclineAssignment}
        setStateModal={() => {
          setModalDeclineAssignment(false);
          setAcceptId(-1);
          setAssetId(-1);
        }}
        backdrop="static"
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3">
              <h6>Do you want to decline this assignment?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                id="decline-btn"
                variant="danger"
                className="font-weight-bold"
                onClick={() => changeStateToDeclineAssignment()}
              >
                Decline
              </Button>
              <Button
                id="cancel-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => {
                  setModalDeclineAssignment(false);
                  setAcceptId(-1);
                  setAssetId(-1);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        }
      />
      <Modal
        show={modalDetailAssignment}
        backdrop="static"
        setStateModal={() => {
          setModalDetailAssignment(false);
          setDetail({});
        }}
        elementModalTitle={
          <p className="d-flex align-items-center w-100">
            <span className="flex-grow-1">Detailed Assignment Information</span>
            <span
              onClick={() => {
                setModalDetailAssignment(false);
                setDetail({});
              }}
              className="cursor-pointer"
              id="close-detail-my-assignment"
            >
              <FaTimes />
            </span>
          </p>
        }
        elementModalBody={
          <div>
            <table align="center" border="0" className="table table-bordered mb-0">
              <tbody>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Asset Code</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.asset_code}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Asset Name</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.asset_name}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Specification</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.specification}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Assigned to</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.assigned_to}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Assigned by</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.assigned_by}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Assigned Date</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.assigned_date}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>State</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.state}</p>
                  </td>
                </tr>
                <tr>
                  <td width="30%" className="ps-0">
                    <p>
                      <strong>Note</strong>
                    </p>
                  </td>
                  <td width="70%" className="pe-0">
                    <p className="word-break">{detail.note}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      />
    </>
  );
}

HomeTable.propTypes = {
  data: PropTypes.any,
  forceReload: PropTypes.func,
  renderTableHeader: PropTypes.any,
  handleSort: PropTypes.func,
  sort: PropTypes.any,
};
