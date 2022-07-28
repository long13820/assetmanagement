import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { assetNameSelector } from '../../../redux/selectors';
import Table from '../../Layouts/Table';

export default function AssignmentAssetTable(props) {
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
        key: key === 'Category' ? 'Categories' : key,
        value: 'desc',
      });
      tempTableHeader[findIndexHeader].isSortAsc = false;
      tempTableHeader[findIndexHeader].isSortDesc = true;
    }
    props.handleSort(tempSort, tempTableHeader);
  };

  const assetName = useSelector(assetNameSelector);

  const handleSelectAsset = (name, id) => {
    props.handleCurrentSetAssetName(name, id);
  };

  const renderTableBody = () => {
    return props.data.map((item) => {
      return (
        <tr key={item.id} className="cursor-pointer">
          <td>
            <input
              type="checkbox"
              label={item.asset_name}
              className="form-check-input"
              checked={assetName === item.asset_name}
              onChange={() => handleSelectAsset(item.asset_name, item.id)}
            />
            <span className="checkmark" />
          </td>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.category_name}</td>
        </tr>
      );
    });
  };

  return <Table tableHeader={props.renderTableHeader} tableBody={renderTableBody()} handleSort={handleSort} />;
}

AssignmentAssetTable.propTypes = {
  data: PropTypes.any.isRequired,
  handleSort: PropTypes.func,
  renderTableHeader: PropTypes.any,
  sort: PropTypes.any,
  handleCurrentSetAssetName: PropTypes.any,
};
