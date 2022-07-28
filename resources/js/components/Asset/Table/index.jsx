import React, { useEffect, useState } from 'react';
import { FaPen, FaTimesCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';

import { asset_table_header } from '../../../../assets/data/asset_table_header';
import { setTotalRecord } from '../../../redux/reducer/app/app.reducer';
import { assetAction } from '../../../redux/reducer/asset/asset.reducer';
import { categoryAction } from '../../../redux/reducer/category/category.reducer';
import { currentPageSelector } from '../../../redux/selectors';
import {
  assetFilterSelector,
  assetListSelector,
  assetTotalRecordPageSelector,
} from '../../../redux/selectors/asset/asset.selector';
import { BlockUI } from '../../Layouts/Notiflix';
import Table from '../../Layouts/Table';
import ShowDetailAsset from '../Detail';
export default function AssetTable() {
  const [renderTableHeader] = React.useState([...asset_table_header]);
  const current_page = useSelector(currentPageSelector);
  const assetFilterState = useSelector(assetFilterSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      assetAction.fetchListAsset({
        'filter[state]': assetFilterState['filter[state]'],
        'filter[category]': assetFilterState['filter[category]'],
        'sort[asset_code]': assetFilterState['sort[asset_code]'],
        'sort[asset_name]': assetFilterState['sort[asset_name]'],
        'sort[category_name]': assetFilterState['sort[category_name]'],
        'sort[state]': assetFilterState['sort[state]'],
        per_page: 20,
        page: current_page,
      })
    );
    dispatch(categoryAction.fetchListCategory());
  }, [dispatch, current_page, assetFilterState]);

  // Sort
  const initialStateSortAssets = {
    1: 'sort[asset_code]',
    2: 'sort[asset_name]',
    3: 'sort[category_name]',
    4: 'sort[state]',
  };
  const handleSortState = (sortTitle) => {
    switch (sortTitle) {
      case 1: {
        const sortOld1 = assetFilterState[initialStateSortAssets[sortTitle]];
        dispatch(
          assetAction.setFilter({
            ...assetFilterState,
            'sort[asset_code]': sortOld1 == 'desc' ? 'asc' : 'desc',
            'sort[asset_name]': undefined,
            'sort[category_name]': undefined,
            'sort[state]': undefined,
          })
        );
        break;
      }

      case 2: {
        const sortOld2 = assetFilterState[initialStateSortAssets[sortTitle]];
        dispatch(
          assetAction.setFilter({
            ...assetFilterState,
            'sort[asset_name]': sortOld2 == 'desc' ? 'asc' : 'desc',
            'sort[asset_code]': undefined,
            'sort[category_name]': undefined,
            'sort[state]': undefined,
          })
        );

        break;
      }

      case 3: {
        const sortOld3 = assetFilterState[initialStateSortAssets[sortTitle]];
        dispatch(
          assetAction.setFilter({
            ...assetFilterState,
            'sort[category_name]': sortOld3 == 'desc' ? 'asc' : 'desc',
            'sort[asset_code]': undefined,
            'sort[asset_name]': undefined,
            'sort[state]': undefined,
          })
        );
        break;
      }

      case 4: {
        const sortOld4 = assetFilterState[initialStateSortAssets[sortTitle]];
        dispatch(
          assetAction.setFilter({
            ...assetFilterState,
            'sort[state]': sortOld4 == 'desc' ? 'asc' : 'desc',
            'sort[asset_code]': undefined,
            'sort[category_name]': undefined,
            'sort[asset_name]': undefined,
          })
        );
        break;
      }
    }
  };
  const assetList = useSelector(assetListSelector);
  const totalRecordPage = useSelector(assetTotalRecordPageSelector);
  const body_sample_data = assetList;
  useEffect(() => {
    dispatch(setTotalRecord(totalRecordPage));
  }, [dispatch, totalRecordPage]);

  // Show ditail
  const [showDetail, setShowDetailAsset] = useState(false);

  const showDetailAsset = (dataId) => {
    BlockUI('.main');
    dispatch(assetAction.fetctDetailAsset(dataId));
    Notiflix.Block.remove('.main');

    setShowDetailAsset(true);
  };
  let navigate = useNavigate();

  const handleEditAsset = (e, dataId) => {
    e.stopPropagation();
    let path = `/edit-asset/${dataId}`;
    navigate(path);
    //  console.log(dataId);
  };

  const renderTableBody = () => {
    return body_sample_data.map((item, index) => {
      return (
        <tr key={index + 1} onClick={() => showDetailAsset(item.id)}>
          <td>{item.asset_code}</td>
          <td>{item.asset_name}</td>
          <td>{item.category_name}</td>
          <td>
            <p
              className={`${
                item.state === 'Assigned' ? 'bg-red-100 text-red' : 'bg-blue-100 text-blue'
              } font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
            >
              {item.state}
            </p>
          </td>
          <td>
            <div className="d-flex">
              <button
                className={` ${
                  item.state === 'Assigned' ? 'opacity-25' : ''
                } br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none`}
                onClick={(e) => handleEditAsset(e, item.id)}
              >
                <FaPen className={`text-black font-20px `} />
              </button>

              <span
                className={`${
                  item.state === 'Assigned' ? 'opacity-25' : ''
                } br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center`}
              >
                <FaTimesCircle className="text-danger font-20px " />
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <Table tableHeader={renderTableHeader} tableBody={renderTableBody()} tableSort={handleSortState} />
      <ShowDetailAsset show={showDetail} setStateModal={() => setShowDetailAsset(false)} />
    </>
  );
}
