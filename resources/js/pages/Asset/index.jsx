import { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaSistrix } from 'react-icons/fa';
import { HiFilter } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import AssetTable from '../../components/Asset/Table';
import PaginationUI from '../../components/Layouts/PaginateRedux';
import { setCurrentPage, setTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { assetFilterSelector } from '../../redux/selectors/asset/asset.selector';
import { categoryListSelector } from '../../redux/selectors/category/category.selector';

import './style.css';
export default function Asset() {
  const dispatch = useDispatch();
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  const filterSelectorState = useSelector(assetFilterSelector);
  // Filter State
  const initialFilterState = {
    2: 'Assigned',
    3: 'Available',
    4: 'Not Available',
    5: 'Waiting for recycling',
    6: 'Recycled',
  };
  const [filterState, setFilterState] = useState('');

  const handleFilterState = (e) => {
    if (e.target.id == 'state1') {
      e.target.checked
        ? setFilterState('Assigned,Available,Not Available,Waiting for recycling,Recycled')
        : setFilterState('');
    } else {
      e.target.checked
        ? setFilterState(filterState + initialFilterState[e.target.dataset.state] + ',')
        : setFilterState(
            filterState.replace(
              filterState.slice(
                filterState.indexOf(initialFilterState[e.target.dataset.state]),
                filterState.indexOf(initialFilterState[e.target.dataset.state]) +
                  initialFilterState[e.target.dataset.state].length +
                  1
              ),
              ''
            )
          );
    }
  };
  useEffect(() => {
    dispatch(setTitle('Manage Asset'));
    dispatch(
      assetAction.setFilter({
        ...filterSelectorState,
        'filter[state]': filterState ? filterState.slice(0, -1) : undefined,
        per_page: 20,
      })
    );
  }, [filterState]);
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
  useEffect(() => {
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
        search: inputValueSearchAsset,
      })
    );
  };

  const [...listCategory] = useSelector(categoryListSelector);

  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-5">Asset List</h5>
      <div className="filter_asset">
        <div className="asset_list_left">
          <Dropdown className="margin_right_asset">
            <Dropdown.Toggle className="filter-button d-flex align-items-center justity-content-center">
              <p className="flex-grow-1 font-weight-bold">State</p>
              <div className="fb-icon">
                <HiFilter />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state1'}
                  data-state={1}
                  label={`All `}
                  onChange={handleFilterState}
                  className=" checkAll mx-4 font-weight-bold"
                />
              </>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state2'}
                  data-state={2}
                  label={`Assigned`}
                  onChange={handleFilterState}
                  className="check mx-4 font-weight-bold"
                />
              </>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state3'}
                  data-state={3}
                  label={`Available `}
                  onChange={handleFilterState}
                  className="check mx-4 font-weight-bold"
                />
              </>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state4'}
                  data-state={4}
                  label={`Not available`}
                  onChange={handleFilterState}
                  className="check mx-4 font-weight-bold"
                />
              </>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state5'}
                  data-state={5}
                  label={`Waiting for recycling`}
                  onChange={handleFilterState}
                  className="check mx-4 font-weight-bold"
                />
              </>
              <>
                <Form.Check
                  type="checkbox"
                  id={'state6'}
                  data-state={6}
                  label={`Recycled`}
                  onChange={handleFilterState}
                  className="check mx-4 font-weight-bold"
                />
              </>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="margin_right_asset">
            <Dropdown.Toggle className="filter-button d-flex align-items-center justity-content-center">
              <p className="flex-grow-1 font-weight-bold">Category</p>
              <div className="fb-icon">
                <HiFilter />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="filter_asset_form_select_menu">
              <Form.Check type="checkbox" id={'idAllCategory'} label={'All'} />
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
        <Button variant="danger" id="button-addon2" className="margin-left-100px">
          Create new asset
        </Button>
      </div>
      <AssetTable />
      {/* <Skeleton column={7} /> */}
      <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
        <PaginationUI handlePageChange={handlePageChange} />
      </div>
    </section>
  );
}
