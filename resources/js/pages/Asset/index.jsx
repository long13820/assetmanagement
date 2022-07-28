import { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaSistrix } from 'react-icons/fa';
import { HiFilter } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

import FilterButtonState from '../../components/Asset/FilterButtonState';
import AssetTable from '../../components/Asset/Table';
import PaginationUI from '../../components/Layouts/PaginateRedux';
import Skeleton from '../../components/Layouts/Skeleton';
import { setCurrentPage, setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { assetFilterSelector, assetLoadingSelector } from '../../redux/selectors/asset/asset.selector';
import { categoryListSelector } from '../../redux/selectors/category/category.selector';

import './style.css';
export default function Asset() {
  const dispatch = useDispatch();
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  const filterSelectorState = useSelector(assetFilterSelector);

  const [filterState, setFilterState] = useState([]);
  const [checkFilterStateCurrent, setcheckFilterStateCurrent] = useState([]);
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
    } else {
      setFilterState(newCheckFilterState);
    }
    setcheckFilterStateCurrent(newCheckFilterState);
    const result = checkAll == true ? allFilter : newCheckFilterState.toString();
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[state]': result ? result : 'Available,Not Available,Assigned',
        per_page: 20,
      })
    );
  };
  // useEffect(() => {
  //   dispatch(setTitle('Manage Asset'));
  // }, [dispatch]);
  // Filter Category
  const [filterCategory, setFilterCategory] = useState('');
  const handleFilterCategory = (e) => {
    e.target.checked
      ? setFilterCategory(filterCategory + e.target.dataset.category + ',')
      : setFilterCategory(
          filterCategory.replace(
            filterCategory.slice(
              filterCategory.indexOf(e.target.dataset.category),
              filterCategory.indexOf(e.target.dataset.category) + 2
            ),
            ''
          )
        );
  };
  const handleFilterCategoryAll = (e) => {
    e.target.checked
      ? dispatch(
          assetAction.setFilter({
            'filter[category]': undefined,
            per_page: 20,
          })
        )
      : dispatch(
          assetAction.setFilter({
            ...filterSelectorState,
            'filter[category]': filterCategory ? filterCategory.slice(0, -1) : undefined,
            per_page: 20,
          })
        );
  };

  useEffect(() => {
    dispatch(setTitle('Manage Asset'));
    dispatch(setSubTitle(''));
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[category]': filterCategory ? filterCategory.slice(0, -1) : undefined,
        per_page: 20,
      })
    );
  }, [filterCategory]);

  // Search
  const [inputValueSearchAsset, setInputValueSearchAsset] = useState('');
  const handleChangeInputAsset = (e) => {
    setInputValueSearchAsset(e.target.value);
  };
  const handleSearchAsset = () => {
    dispatch(
      assetAction.fetchListAsset({
        ...filterSelectorState,
        search: inputValueSearchAsset,
      })
    );
  };
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/asset`;
    navigate(path);
  };
  const [...listCategory] = useSelector(categoryListSelector);
  const statusList = useSelector(assetLoadingSelector);
  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-5">Asset List</h5>
      <div className="filter_asset">
        <FilterButtonState currentFilter={filterState} setCurrentFilter={handleFilterState} />
        <div className="asset_list_left">
          <Dropdown className="margin_right_asset">
            <Dropdown.Toggle className="filter-button btn-asset d-flex align-items-center justity-content-center">
              <p className="flex-grow-1 font-weight-bold css_category_title">Category</p>
              <div className="fb-icon ">
                <HiFilter />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="filter_asset_form_select_menu">
              <Form.Check type="checkbox" id={'idAllCategory'} label={'All'} onChange={handleFilterCategoryAll} />
              {listCategory.map((item, index) => {
                return (
                  <div key={index}>
                    <Form.Check
                      type="checkbox"
                      data-category={item.id}
                      id={`cateid_${item.id}`}
                      label={item.category_name}
                      onChange={handleFilterCategory}
                    />
                  </div>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <div className="filter_asset_form_select_search ml-5 ">
            <InputGroup className="mb-3">
              <Form.Control
                aria-describedby="basic-addon2"
                value={inputValueSearchAsset}
                onChange={handleChangeInputAsset}
              />
              <Button
                variant="outline-secondary"
                id="button-addon2"
                onClick={handleSearchAsset}
                disabled={isEmpty(inputValueSearchAsset) ? true : false}
              >
                <FaSistrix id="basic-addon2" />
              </Button>
            </InputGroup>
          </div>
        </div>
        <Button onClick={routeChange} variant="danger" id="button-addon2" className="margin-left-100px">
          Create new asset
        </Button>
      </div>
      {statusList ? <Skeleton column={6} /> : <></>}
      <AssetTable />

      <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
        <PaginationUI handlePageChange={handlePageChange} />
      </div>
    </section>
  );
}
