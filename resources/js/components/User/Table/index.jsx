/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPen, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { checkDisabledUser, disableUser, getUserById } from '../../../api/User';
import { setExpiredToken, setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setIsEdit, setUser } from '../../../redux/reducer/user/user.reducer';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import UserDetail from '../Detail';

export default function UserTable(props) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [cannotDisable, setCanNotDisable] = React.useState(false);
  const [canDisable, setCanDisable] = React.useState(false);
  const [idDisable, setIdDisable] = React.useState(-1);
  const dispatch = useDispatch();

  const handleEditUser = async (e, id) => {
    e.stopPropagation();
    BlockUI('#root', 'fixed');
    const data = await getUserById(id);
    if (Object.keys(data).length > 0) {
      Notiflix.Block.remove('#root');
      dispatch(setUser(data));
      dispatch(setIsEdit(true));
      dispatch(setSubTitle('Edit user'));
    } else if (data === 401) {
      Notiflix.Block.remove('#root');
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else {
      Notiflix.Block.remove('#root');
      ErrorToast('Something went wrong. Please try again', 3000);
    }
  };

  const handleCheckDisabledUser = async (e, id) => {
    e.stopPropagation();
    BlockUI('#root', 'fixed');
    const result = await checkDisabledUser(id);
    if (result === 405) {
      setCanNotDisable(true);
      Notiflix.Block.remove('#root');
      return;
    }
    if (result === 200) {
      setCanDisable(true);
      setIdDisable(id);
      Notiflix.Block.remove('#root');
      return;
    }
    if (result === 401) {
      Notiflix.Block.remove('#root');
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
      return;
    }
    if (result === 500) {
      Notiflix.Block.remove('#root');
      ErrorToast('Something went wrong. Please try again', 3000);
    }
  };

  const handleDisableUser = async () => {
    BlockUI('#root', 'fixed');
    const result = await disableUser(idDisable);
    if (result === 200) {
      SuccessToast('The user is disabled successfully', 3000);
      setCanDisable(false);
      setIdDisable(-1);
      props.forceReload();
    } else if (result === 401) {
      Notiflix.Block.remove('#root');
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else {
      Notiflix.Block.remove('#root');
      ErrorToast('The user is disabled unsuccessfully', 3000);
    }
  };

  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      tempTableHeader[findIndexHeader].isSortAsc = true;
      tempTableHeader[findIndexHeader].isSortDesc = false;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 5 && index != 2) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (valueAsc && !valueDesc) {
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
      tempTableHeader.forEach((_, index) => {
        if (index != findIndexHeader && index != 5 && index != 2) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    if (!valueAsc && valueDesc) {
      tempSort[0].key = 'first_name';
      tempSort[0].value = 'asc';
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

  const handleShowDetail = async (id) => {
    BlockUI('#root', 'fixed');
    const result = await getUserById(id);
    if (Object.keys(result).length > 0) {
      Notiflix.Block.remove('#root');
      setDetail({ ...result });
      setShowDetail(true);
    } else if (result === 401) {
      Notiflix.Block.remove('#root');
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else {
      Notiflix.Block.remove('#root');
      ErrorToast('Something went wrong. Please try again', 3000);
    }
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id} className="cursor-pointer" onClick={() => handleShowDetail(item.id)}>
          <td>{item.staff_code}</td>
          <td>{item.full_name}</td>
          <td>{item.username}</td>
          <td>{formatDate(item.joined_date, 'DD/MM/YYYY')}</td>
          <td>
            <p
              className={`${
                item.type === 'Staff' ? 'bg-blue-100 text-blue' : 'bg-red-100 text-red'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.type}
            </p>
          </td>
          <td>
            <div className="d-flex">
              <button
                id="edit-user"
                onClick={(e) => {
                  handleEditUser(e, item.id);
                }}
                className="br-6px p-2 bg-gray-100 text-black w-48px h-48px d-flex align-items-center justify-content-center border-none"
              >
                <FaPen className="font-20px" />
              </button>
              <button
                id="disabled-user"
                onClick={(e) => {
                  handleCheckDisabledUser(e, item.id);
                }}
                className="br-6px p-2 ms-3 text-danger bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
              >
                <FaTimesCircle className="text-danger font-20px" />
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
        <UserDetail show={showDetail} detail={detail} setStateModal={() => setShowDetail(false)} />
      )}
      <Modal
        show={canDisable}
        backdrop="static"
        setStateModal={() => {
          setCanDisable(false);
          setIdDisable(-1);
        }}
        elementModalTitle={<p>Are you sure?</p>}
        elementModalBody={
          <>
            <div className="mb-3 font-weight-semi">Do you want to disable this user?</div>
            <div className="d-flex align-items-center justify-content-start">
              <Button
                id="disable-btn"
                variant="danger"
                className="font-weight-bold"
                onClick={() => handleDisableUser()}
              >
                Disable
              </Button>
              <Button
                id="cancel-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => {
                  setCanDisable(false);
                  setIdDisable(-1);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        }
      />
      <Modal
        show={cannotDisable}
        backdrop="static"
        setStateModal={() => setCanNotDisable(false)}
        elementModalTitle={
          <p className="d-flex align-items-center w-100">
            <span className="flex-grow-1">Can not disabled user</span>
            <span id="user-disabled-close-btn" onClick={() => setCanNotDisable(false)} className="cursor-pointer">
              <FaTimes />
            </span>
          </p>
        }
        elementModalBody={
          <>
            <div className="font-weight-semi">There are valid assignments belonging to this user.</div>
            <div className="font-weight-semi">Please close all assignments before disabling user.</div>
          </>
        }
      />
    </>
  );
}

UserTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  forceReload: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
};
