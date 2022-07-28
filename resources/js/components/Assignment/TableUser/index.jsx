import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { userNameSelector } from '../../../redux/selectors';
import Table from '../../Layouts/Table';

export default function AssignmentUserTable(props) {
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

  const userName = useSelector(userNameSelector);

  const handleSelectUser = (name, id) => {
    props.handleCurrentSetUserName(name, id);
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id} className="cursor-pointer">
          <td>
            <input
              type="checkbox"
              className="form-check-input"
              checked={userName === item.full_name}
              onChange={() => handleSelectUser(item.full_name, item.id)}
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
