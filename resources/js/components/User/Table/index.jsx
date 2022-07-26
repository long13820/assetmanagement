import React from 'react';
import { FaPen, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { getUserById } from '../../../api/User';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setIsEdit, setUser } from '../../../redux/reducer/user/user.reducer';
import { formatDate } from '../../../utils/formatDate';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import UserDetail from '../Detail';

export default function UserTable(props) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [detail, setDetail] = React.useState({});
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
    } else {
      Notiflix.Block.remove('#root');
    }
  };

  const handleSort = (key, value) => {
    const tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndex = props.sort.findIndex((e) => e.key === key);
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);
    if (findIndex !== -1 && value) {
      tempSort[findIndex].value = 'desc';
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
    }
    if (findIndex !== -1 && !value) {
      tempSort.splice(findIndex, 1);
      tempTableHeader[findIndexHeader].isSortAsc = true;
      tempTableHeader[findIndexHeader].isSortDesc = false;
    }
    if (findIndex === -1 && value) {
      tempSort.push({
        key,
        value: 'desc',
      });
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
    }
    props.handleSort(tempSort, tempTableHeader);
  };

  const handleShowDetail = async (id) => {
    BlockUI('#root', 'fixed');
    const data = await getUserById(id);
    if (Object.keys(data).length > 0) {
      Notiflix.Block.remove('#root');
      setDetail({ ...data });
      setShowDetail(true);
    } else {
      Notiflix.Block.remove('#root');
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
                onClick={(e) => {
                  handleEditUser(e, item.id);
                }}
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
              >
                <FaPen className="text-black font-20px" />
              </button>
              <span className="br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center">
                <FaTimesCircle className="text-danger font-20px" />
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
        <UserDetail show={showDetail} detail={detail} setStateModal={() => setShowDetail(false)} />
      )}
    </>
  );
}

UserTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
};
