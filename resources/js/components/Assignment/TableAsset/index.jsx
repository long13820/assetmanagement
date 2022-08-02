import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { assetCodeSelector, assetNameSelector } from '../../../redux/selectors';
import Table from '../../Layouts/Table';

export default function AssignmentAssetTable(props) {
  const handleSort = (key, valueAsc, valueDesc) => {
    const tempSort = JSON.parse(JSON.stringify(props.sort));
    const tempTableHeader = JSON.parse(JSON.stringify(props.renderTableHeader));
    const findIndexHeader = props.renderTableHeader.findIndex((e) => e.name === key);
    if (!valueAsc && !valueDesc) {
      if (tempSort.length === 0) {
        tempSort.push({ key: '', value: '' });
      }
      tempSort[0].key = key;
      tempSort[0].value = 'asc';
      if (tempSort[0].key === 'Category') {
        tempSort[0].key = 'Categories';
      }
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
      if (tempSort.length === 0) {
        tempSort.push({ key: '', value: '' });
      }
      tempSort[0].key = key;
      tempSort[0].value = 'desc';
      if (tempSort[0].key === 'Category') {
        tempSort[0].key = 'Categories';
      }
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

  const assetName = useSelector(assetNameSelector);
  const assetCode = useSelector(assetCodeSelector);
  const handleSelectAsset = (name, id, code) => {
    props.handleCurrentSetAssetName(name, id, code);
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
              checked={assetName === item.asset_name && assetCode === item.asset_code}
              onChange={() => handleSelectAsset(item.asset_name, item.id, item.asset_code)}
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
