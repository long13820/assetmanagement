import React from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck, FaTimes, FaUndoAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { acceptAssignment } from '../../../api/Assignment';
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
  const [modalAcceptAssignment, setModalAcceptAssignment] = React.useState(false);

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

  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = [];
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      if (key === 'Category') key = 'Categories';
      tempSort.push({ key: '', value: '' });
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
      tempSort.push({ key: '', value: '' });
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

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.category_name}</td>
          <td>{item.assigned_date}</td>
          <td>
            <p
              className={`${
                item.state === 'Waiting for acceptance' ? 'bg-blue-100 text-blue' : 'bg-red-100 text-red'
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
                  className={`text-danger font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-25' : ''}`}
                />
              </button>
              <button
                id="home-decline-btn"
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none mx-3"
                disabled={item.state !== 'Waiting for acceptance'}
              >
                <FaTimes
                  className={`text-black font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-25' : ''}`}
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
                <FaUndoAlt className={`text-blue font-18px ${item.state !== 'Accepted' ? 'opacity-25' : ''}`} />
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
                  setModalAcceptAssignment(false);
                  setAcceptId(-1);
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

HomeTable.propTypes = {
  data: PropTypes.any,
  forceReload: PropTypes.func,
  renderTableHeader: PropTypes.any,
  handleSort: PropTypes.func,
};
