import { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

import FilterButtonCategory from '../../components/Asset/FilterButtonCategory';
import FilterButtonState from '../../components/Asset/FilterButtonState';
import AssetTable from '../../components/Asset/Table';
import PaginationUI from '../../components/Layouts/PaginateRedux';
import { setCurrentPage, setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { assetFilterSelector, assetListSelector } from '../../redux/selectors/asset/asset.selector';

import './style.css';
export default function Asset() {
  const dispatch = useDispatch();
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  const filterSelectorState = useSelector(assetFilterSelector);

  const [filterState, setFilterState] = useState(['Available', 'Not Available', 'Assigned']);
  const [checkFilterStateCurrent, setcheckFilterStateCurrent] = useState([]);
  const [checkAllState, setcheckAll] = useState(false);
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
    const allFilter = '1,2,3,4';
    const result = checkAll == true ? allFilter : newCheckFilterCategory.toString();
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[category]': result ? result : undefined,
        per_page: 20,
      })
    );
  };

  useEffect(() => {
    dispatch(setTitle('Manage Asset'));
    dispatch(setSubTitle(''));
  }, [dispatch]);

  // Search
  const [inputValueSearchAsset, setInputValueSearchAsset] = useState('');
  const handleSearchAsset = (e) => {
    e.preventDefault();
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
    dispatch(assetAction.setIsAdd(true));
    dispatch(setSubTitle('Create new asset'));
  };

  const listState = useSelector(assetListSelector);
  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-5">Asset List</h5>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex">
          <FilterButtonState
            currentFilter={filterState}
            setCurrentFilter={handleFilterState}
            checkAllState={checkAllState}
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
      <AssetTable />
      <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
        {!isEmpty(listState) && <PaginationUI handlePageChange={handlePageChange} />}
      </div>
    </section>
  );
}
