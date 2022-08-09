/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { FaPen, FaTimesCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { asset_table_header } from '../../../../assets/data/asset_table_header';
import { checkAssetById, deleteAssetById, getAssetById } from '../../../api/Asset/assetAPI';
import { setSubTitle, setTotalRecord } from '../../../redux/reducer/app/app.reducer';
import { assetAction } from '../../../redux/reducer/asset/asset.reducer';
import { categoryAction } from '../../../redux/reducer/category/category.reducer';
import { currentPageSelector } from '../../../redux/selectors';
import {
  assetFilterSelector,
  assetListSelector,
  assetLoadingAssetFilterSelector,
  assetLoadingSelector,
  assetTotalRecordPageSelector,
} from '../../../redux/selectors/asset/asset.selector';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import NotFoundData from '../../Layouts/NotFoundData';
import { BlockUI } from '../../Layouts/Notiflix';
import Skeleton from '../../Layouts/Skeleton';
import Table from '../../Layouts/Table';
import ShowDetailAsset from '../Detail';
import ModalDelete from '../ModalDelete';
import ModalDeleteHistory from '../ModalDeleteHistory';

export default function AssetTable(props) {
  const [renderTableHeader] = React.useState([...asset_table_header]);
  const current_page = useSelector(currentPageSelector);
  const assetFilterState = useSelector(assetFilterSelector);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [confirmIdDelete, setConfirmIdDelete] = React.useState(-1);
  const [confirmDeleteWrong, setConfirmDeleteWrong] = React.useState(false);
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
    // eslint-disable-next-line react/prop-types
    props.sortActive(true);
    dispatch(assetAction.setLoadingFilter(true));
    dispatch(assetAction.setSortHeader(false));
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
    BlockUI('#root', 'fixed');
    setTimeout(function () {
      dispatch(assetAction.fetctDetailAsset(dataId));
      Notiflix.Block.remove('#root');
      setShowDetailAsset(true);
    }, 200);
  };

  const handleEditAsset = async (e, dataId) => {
    e.stopPropagation();
    BlockUI('#root', 'fixed');
    const result = await getAssetById(dataId);
    if (Object.keys(result).length > 0) {
      dispatch(assetAction.setEditData(result));
      dispatch(
        assetAction.setIsEdit({
          isEdit: true,
          idAsset: dataId,
        })
      );
      dispatch(setSubTitle('Edit asset'));
    }
    Notiflix.Block.remove('#root');
  };

  const renderTableBody = () => {
    return (
      body_sample_data.length > 0 &&
      body_sample_data.map((item, index) => {
        return (
          <tr key={index + 1} onClick={() => showDetailAsset(item.id)} className="cursor-pointer">
            <td>{item.asset_code}</td>
            <td>{item.asset_name}</td>
            <td>{item.category_name}</td>
            <td>
              <p
                className={`${(() => {
                  if (item.state === 'Assigned') {
                    return 'bg-red-100 text-red';
                  } else if (item.state === 'Waiting for recycling') {
                    return 'bg-warning-100 text-warning';
                  } else if (item.state === 'Recycled') {
                    return 'bg-infor-100 text-info';
                  } else if (item.state === 'Available') {
                    return 'bg-success-100 text-success';
                  } else {
                    return 'bg-blue-100 text-blue';
                  }
                })()} font-weight-bold br-6px py-2 px-3 w-fit-content d-flex align-items-center text-center`}
              >
                {item.state}
              </p>
            </td>
            <td>
              <div className="d-flex">
                <button
                  className="br-6px p-2 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
                  onClick={item.state === 'Assigned' ? undefined : (e) => handleEditAsset(e, item.id)}
                  disabled={item.state === 'Assigned'}
                >
                  <FaPen className={`text-black font-20px ${item.state === 'Assigned' ? 'opacity-50' : ''}`} />
                </button>

                <button
                  className="br-6px p-2 ms-3 bg-gray-100 w-48px h-48px d-flex align-items-center justify-content-center border-none"
                  onClick={item.state === 'Assigned' ? undefined : (e) => handleDeleteAsset(e, item.id)}
                  disabled={item.state === 'Assigned'}
                >
                  <FaTimesCircle className={`text-danger font-20px ${item.state === 'Assigned' ? 'opacity-50' : ''}`} />
                </button>
              </div>
            </td>
          </tr>
        );
      })
    );
  };
  const statusList = useSelector(assetLoadingSelector);
  const statusFilterLoading = useSelector(assetLoadingAssetFilterSelector);

  const handleDeleteAsset = async (e, id) => {
    e.stopPropagation();
    setConfirmIdDelete(id);
    BlockUI('#root', 'fixed');
    const result = await checkAssetById(id);
    if (result === 200) {
      Notiflix.Block.remove('#root');
      setConfirmDelete(true);
    } else {
      Notiflix.Block.remove('#root');
      setConfirmDeleteWrong(true);
    }
  };
  const setStateModalDelete = () => {
    setConfirmIdDelete(-1);
    setConfirmDelete(false);
  };

  const setStateModalDeleteWrong = () => {
    setConfirmIdDelete(-1);
    setConfirmDeleteWrong(false);
  };
  const handleSoftDeleteAsset = async (id) => {
    BlockUI('#root', 'fixed');
    const response = await deleteAssetById(id);
    if (response === 200) {
      SuccessToast('Delete asset is successfully', 3000);
      dispatch(
        assetAction.fetchListAsset({
          'filter[state]': 'Available,Not Available,Assigned,Waiting for recycling,Recycled',
          'filter[category]': undefined,
          'sort[asset_code]': undefined,
          'sort[asset_name]': undefined,
          'sort[category_name]': undefined,
          'sort[state]': undefined,
          'sort[updated_at]': 'desc',
        })
      );
      props.backtoManageAsset();
      setStateModalDelete();
    } else {
      ErrorToast('Delete asset is unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };
  const handleSoftDeleteAssetWrong = async (e, dataId) => {
    e.stopPropagation();
    BlockUI('#root', 'fixed');
    const result = await getAssetById(dataId);
    if (Object.keys(result).length > 0) {
      dispatch(assetAction.setEditData(result));
      dispatch(
        assetAction.setIsEdit({
          isEdit: true,
          idAsset: dataId,
        })
      );
      dispatch(setSubTitle('Edit asset'));
    }
    Notiflix.Block.remove('#root');
  };

  return (
    <>
      {statusFilterLoading == true ? BlockUI('#root', 'fixed') : Notiflix.Block.remove('#root')}
      {statusList == true && statusFilterLoading == false && <Skeleton column={6} />}
      {statusFilterLoading == false && statusList == false && body_sample_data.length > 0 ? (
        <Table tableHeader={renderTableHeader} tableBody={renderTableBody()} tableSort={handleSortState} />
      ) : (
        <div className="text-danger text-center font-weight-bold">
          {statusFilterLoading == false && statusList == false && <NotFoundData />}
        </div>
      )}
      <ModalDelete
        show={confirmDelete}
        id={confirmIdDelete}
        setStateModalDelete={() => setStateModalDelete()}
        handleSoftDeleteAsset={handleSoftDeleteAsset}
      />
      <ModalDeleteHistory
        show={confirmDeleteWrong}
        id={confirmIdDelete}
        setStateModalDeleteWrong={() => setStateModalDeleteWrong()}
        handleSoftDeleteAssetWrong={handleSoftDeleteAssetWrong}
      />
      <ShowDetailAsset show={showDetail} setStateModal={() => setShowDetailAsset(false)} />
    </>
  );
}
AssetTable.propTypes = {
  backtoManageAsset: PropTypes.func,
};
