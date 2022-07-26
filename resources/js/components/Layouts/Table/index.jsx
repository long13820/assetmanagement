import React from 'react';
import { Table as TableBootstrap } from 'react-bootstrap';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import './style.css';

export default function Table(props) {
  const { tableHeader, tableBody } = props;
  const location = useLocation();
  return (
    <TableBootstrap id="table" responsive>
      <thead>
        <tr>
          {tableHeader.map((element) => (
            <th
              key={element.id}
              onClick={() => {
                if (element.name !== null && element.name !== 'Username') {
                  if (location.pathname === '/manage_asset') {
                    props.tableSort(element.id);
                    element.isSortDesc = !element.isSortDesc;
                    element.isSortAsc = !element.isSortAsc;
                  } else {
                    props.handleSort(element.name, element.isSortAsc);
                  }
                }
              }}
              className={`${element.cursor ? 'cursor-pointer' : ''}`}
            >
              <div className="d-flex align-items-center">
                <p className="me-2">{element.name}</p>
                {element.isSortAsc && <FaSortDown className="mb-2" />}
                {element.isSortDesc && <FaSortUp className="mt-2" />}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </TableBootstrap>
  );
}

Table.propTypes = {
  tableHeader: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      isSortAsc: PropTypes.bool,
      isSortDesc: PropTypes.bool,
    })
  ),
  tableBody: PropTypes.array.isRequired,
  handleSort: PropTypes.func,
  tableSort: PropTypes.func,
};
