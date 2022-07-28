import React from 'react';
import { FaCheck, FaTimes, FaUndoAlt } from 'react-icons/fa';

import { home_table_header } from '../../../../assets/data/home_table_header';
import { home_sample_data } from '../../../../assets/sample_data/home.sample';
import Table from '../../Layouts/Table';

const body_sample_data = [...home_sample_data];

export default function HomeTable() {
  const [renderTableHeader] = React.useState([...home_table_header]);

  const renderTableBody = () => {
    return (
      body_sample_data.length > 0 &&
      body_sample_data?.map((item) => {
        return (
          <tr key={item.id}>
            <td>{item.asset_code}</td>
            <td>{item.asset_name}</td>
            <td>{item.asset_category}</td>
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
                <button className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none">
                  <FaCheck
                    className={`text-danger font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-25' : ''}`}
                  />
                </button>
                <button className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none mx-3">
                  <FaTimes
                    className={`text-black font-20px ${item.state !== 'Waiting for acceptance' ? 'opacity-25' : ''}`}
                  />
                </button>
                <button className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none">
                  <FaUndoAlt className={`text-blue font-18px ${item.state !== 'Accepted' ? 'opacity-25' : ''}`} />
                </button>
              </div>
            </td>
          </tr>
        );
      })
    );
  };

  return <Table tableHeader={renderTableHeader} tableBody={renderTableBody()} />;
}
