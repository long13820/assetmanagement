import { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import FilterButtonCategory from '../../components/Asset/FilterButtonCategory';
import FilterButtonState from '../../components/Asset/FilterButtonState';
import AssetTable from '../../components/Asset/Table';
import AssetCreate from '../../components/AssetCreate';
import AssetEdit from '../../components/AssetEdit';
import PaginationUI from '../../components/Layouts/PaginateRedux';
import { setCurrentPage, setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { userSelector } from '../../redux/selectors';
import {
  assetFilterSelector,
  assetIsAddSelector,
  assetIsEditSelector,
  assetTotalRecordPageSelector,
} from '../../redux/selectors/asset/asset.selector';

import './style.css';
export default function Asset() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle('Manage Asset'));
    dispatch(setSubTitle(''));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const filterSelectorState = useSelector(assetFilterSelector);
  const isAdd = useSelector(assetIsAddSelector);
  const isEdit = useSelector(assetIsEditSelector);
  const [filterState, setFilterState] = useState(['Available', 'Not Available', 'Assigned']);
  const [checkFilterStateCurrent, setcheckFilterStateCurrent] = useState([]);
  const [checkAllState, setcheckAll] = useState(false);
  const [checkSearch, setCheckSearch] = useState(false);
  const user = useSelector(userSelector);
  const handleFilterState = async (value) => {
    const currentIndex = checkFilterStateCurrent.indexOf(value);
    const newCheckFilterState = [...checkFilterStateCurrent];

    let checkAll = false;
    if (currentIndex === -1) {
      newCheckFilterState.push(value);
    } else {
      newCheckFilterState.splice(currentIndex, 1);
    }
    const allFilter = 'Available,Not Available,Assigned,Waiting for recycling,Recycled';
    if (value == 'All' && checkFilterStateCurrent.indexOf('All') == -1) {
      checkAll = true;
      newCheckFilterState.splice(currentIndex, 1);
      setcheckAll(!checkAllState);
      setcheckFilterStateCurrent('');
      setFilterState([]);
    } else {
      setFilterState(newCheckFilterState);
      setcheckFilterStateCurrent(newCheckFilterState);
    }

    const result = checkAll == true ? allFilter : newCheckFilterState.toString();
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[state]': result ? result : 'Available,Not Available,Assigned',
        per_page: 20,
      })
    );
    dispatch(setCurrentPage(1));

    // dispatch(assetAction.setSortHeader(false));
    dispatch(assetAction.setLoadingFilter(true));
    setCheckSearch(true);
  };
  const handleCheckAllState = (value) => {
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[state]': value,
        per_page: 20,
      })
    );
    dispatch(setCurrentPage(1));
    // dispatch(assetAction.setSortHeader(false));
    dispatch(assetAction.setLoadingFilter(true));
    setCheckSearch(true);
  };
  // Filter Category
  const [filterCategory, setFilterCategory] = useState([0]);
  const [checkFilterCategoryState, setFilterCategoryCurrent] = useState([]);
  const [checkAllCategory, setcheckAllCategory] = useState(false);
  const handleFilterCategory = async (value) => {
    const currentFilterCategory = checkFilterCategoryState.indexOf(value);
    const newCheckFilterCategory = [...checkFilterCategoryState];
    let checkAll = false;
    if (currentFilterCategory == -1) {
      newCheckFilterCategory.push(value);
    } else {
      newCheckFilterCategory.splice(currentFilterCategory, 1);
    }

    if (value == 0 && checkFilterCategoryState.indexOf(0) == -1) {
      checkAll = true;
      newCheckFilterCategory.splice(currentFilterCategory, 1);
      setFilterCategoryCurrent([]);
      setcheckAllCategory(!checkAllCategory);
      setFilterCategory([]);
    } else {
      setFilterCategoryCurrent(newCheckFilterCategory);
      setFilterCategory(newCheckFilterCategory);
    }
    const allFilter = undefined;
    const result = checkAll == true ? allFilter : newCheckFilterCategory.toString();
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[category]': result ? result : undefined,
        page: 1,
        per_page: 20,
      })
    );
    dispatch(setCurrentPage(1));
    // dispatch(assetAction.setSortHeader(false));
    dispatch(assetAction.setLoadingFilter(true));
    setCheckSearch(true);
  };

  // Search
  const [inputValueSearchAsset, setInputValueSearchAsset] = useState('');
  const handleSearchAsset = async (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
    // dispatch(assetAction.setSortHeader(false));
    dispatch(assetAction.setLoadingFilter(true));
    setCheckSearch(true);
  };
  const handleSortActive = (value) => {
    if (value) {
      setInputValueSearchAsset('');
    }
  };
  useEffect(() => {
    if (checkSearch == true) {
      dispatch(
        assetAction.fetchListAsset({
          ...filterSelectorState,
          search: inputValueSearchAsset,
        })
      );
      setCheckSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkSearch]);
  const routeChange = () => {
    dispatch(assetAction.setIsAdd(true));
    dispatch(setSubTitle('Create new asset'));
  };
  const fillterAllItem = (checkEdit) => {
    if (checkEdit) {
      setFilterState('Available,Not Available,Assigned,Waiting for recycling,Recycled');
    }
  };
  const listState = useSelector(assetTotalRecordPageSelector);
  const backtoManageAsset = () => {
    dispatch(assetAction.setIsEdit(false));
    dispatch(setSubTitle(''));
  };
  return (
    <>
      {user?.type === 'Admin' && (
        <section>
          {!isEdit && !isAdd && <h5 className="text-danger font-weight-bold mb-3">Asset List</h5>}
          {isEdit && <h5 className="text-danger font-weight-bold mb-3">Edit asset</h5>}
          {isAdd && <h5 className="text-danger font-weight-bold mb-3">Create new asset</h5>}
          {!isEdit && !isAdd && (
            <>
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex">
                  <FilterButtonState
                    currentFilter={filterState}
                    setCurrentFilter={handleFilterState}
                    checkAllState={checkAllState}
                    setAllState={handleCheckAllState}
                  />
                  <div className="ms-3">
                    <FilterButtonCategory
                      currentFilter={filterCategory}
                      setCurrentFilter={handleFilterCategory}
                      setAllCategory={checkAllCategory}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <Form onSubmit={(e) => handleSearchAsset(e)}>
                    <InputGroup>
                      <Form.Control
                        placeholder="Asset Code or Asset Name"
                        aria-describedby="basic-addon2"
                        value={inputValueSearchAsset}
                        onChange={(e) => setInputValueSearchAsset(e.target.value)}
                      />
                      <Button variant="danger" type="submit">
                        <FaSearch />
                      </Button>
                    </InputGroup>
                  </Form>
                  <Button
                    onClick={routeChange}
                    variant="danger"
                    id="button-addon2"
                    className="font-weight-bold ms-3 btn btn-danger"
                  >
                    Create new asset
                  </Button>
                </div>
              </div>
              <AssetTable sortActive={handleSortActive} backtoManageAsset={backtoManageAsset} />
              <div className="d-flex justify-content-end align-items-center mt-3">
                {listState > 20 && <PaginationUI handlePageChange={handlePageChange} />}
              </div>
            </>
          )}
          {isAdd && <AssetCreate filterAll={fillterAllItem} />}
          {isEdit && <AssetEdit filterAll={fillterAllItem} />}
        </section>
      )}
      {user?.type === 'Staff' && <Navigate to="/" />}
    </>
  );
}
