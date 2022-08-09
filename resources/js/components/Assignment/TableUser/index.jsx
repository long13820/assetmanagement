import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { staffCodeSelector, userNameSelector } from '../../../redux/selectors';
import Table from '../../Layouts/Table';

export default function AssignmentUserTable(props) {
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
        if (index != findIndexHeader && index != 0) {
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
        if (index != findIndexHeader && index != 0) {
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
        if (index != findIndexHeader && index != 0) {
          tempTableHeader[index].isSortAsc = false;
          tempTableHeader[index].isSortDesc = false;
        }
      });
    }

    props.handleSort(tempSort, tempTableHeader);
  };

  const userName = useSelector(userNameSelector);
  const staffCode = useSelector(staffCodeSelector);

  const handleSelectUser = (name, id, code) => {
    props.handleCurrentSetUserName(name, id, code);
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr
          key={item.id}
          className="cursor-pointer"
          onClick={() => handleSelectUser(item.full_name, item.id, item.staff_code)}
        >
          <td>
            <input
              type="checkbox"
              className="form-check-input"
              checked={userName === item.full_name && staffCode === item.staff_code}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectUser(item.full_name, item.id, item.staff_code);
              }}
            />
            <span className="checkmark" />
          </td>
          <td>{item.staff_code}</td>
          <td>{item.full_name}</td>
          <td>
            <p
              className={`${
                item.type === 'Staff' ? 'bg-blue-100 text-blue' : 'bg-red-100 text-red'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.type}
            </p>
          </td>
        </tr>
      );
    });
  };

  return <Table tableHeader={props.renderTableHeader} tableBody={renderTableBody()} handleSort={handleSort} />;
}

AssignmentUserTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
  handleCurrentSetUserName: PropTypes.func,
};
