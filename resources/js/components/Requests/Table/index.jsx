import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { formatDate } from '../../../utils/formatDate';
import Table from '../../Layouts/Table';

export default function RequestsTable(props) {
  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = [];
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);

    if (!valueAsc && !valueDesc) {
      if (key === 'No.') key = 'returned_id';
      if (key === 'Requested by') key = 'Assigned to';
      if (key === 'Accepted by') key = 'Assigned by';
      tempSort.push({ key: '', value: '' });
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
      if (key === 'No.') key = 'returned_id';
      if (key === 'Requested by') key = 'Assigned to';
      if (key === 'Accepted by') key = 'Assigned by';
      tempSort.push({ key: '', value: '' });
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

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.returned_id}</td>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.requested_by}</td>
          <td>{formatDate(item.assigned_date, 'DD/MM/YYYY')}</td>
          <td>{item.accepted_by}</td>
          <td>{formatDate(item.returned_date, 'DD/MM/YYYY')}</td>
          <td>
            <p
              className={`${
                item.state === 'Completed' ? 'bg-blue-100 text-blue' : 'bg-red-100 text-red'
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
              >
                <FaCheck className={`text-danger font-20px ${item.state === 'Completed' ? 'opacity-25' : ''}`} />
              </button>
              <button
                id="home-decline-btn"
                className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none mx-3"
              >
                <FaTimes className={`text-black font-20px ${item.state === 'Completed' ? 'opacity-25' : ''}`} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return <Table tableHeader={props.renderTableHeader} tableBody={renderTableBody()} handleSort={handleSort} />;
}

RequestsTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
};
