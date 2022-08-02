import React from 'react';
import { Table as TableBootstrap } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
                    tableHeader.map((item) => {
                      if (item.id == element.id) {
                        item.isSortDesc = !item.isSortDesc;
                        item.isSortAsc = !item.isSortAsc;
                      } else {
                        // eslint-disable-next-line no-empty
                        if (item.id == 5) {
                        } else {
                          item.isSortDesc = false;
                          item.isSortAsc = true;
                        }
                      }
                    });
                  } else {
                    props.handleSort(element.name, element.isSortAsc, element.isSortDesc);
                  }
                }
              }}
              className={`${element.cursor ? 'cursor-pointer' : ''}`}
            >
              <div className="d-flex align-items-center">
                <p className="me-2">{element.name}</p>
                {element.isSort && (
                  <>
                    {!element.isSortAsc && !element.isSortDesc && (
                      <FaChevronUp id="table-sort-default" className="font-12px text-gray-300" />
                    )}
                    {element.isSortAsc && (
                      <FaChevronUp
                        id="table-sort-asc"
                        className={`font-12px ${element.isSortAsc ? 'text-black' : 'text-gray-300'}`}
                      />
                    )}
                    {element.isSortDesc && (
                      <FaChevronDown
                        id="table-sort-desc"
                        className={`font-12px ${element.isSortDesc ? 'text-black' : 'text-gray-300'}`}
                      />
                    )}
                  </>
                )}
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
  tableBody: PropTypes.any,
  handleSort: PropTypes.func,
  tableSort: PropTypes.func,
};
