/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, InputGroup, Row, Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllAssets } from '../../../../api/Assignment';
import { setExpiredToken } from '../../../../redux/reducer/app/app.reducer';
import {
  setAssetId,
  setIsFocusAsset,
  setIsFocusUser,
  setIsSearchingAsset,
} from '../../../../redux/reducer/assignment/assignment.reducer';
import { ErrorToast } from '../../../Layouts/Alerts';
import Pagination from '../../../Layouts/Pagination';

import './style.css';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDeboundedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDeboundedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
export default function DropdownListAsset(props) {
  const assignment = useSelector((state) => state.assignment.assignment);
  const [search, setSearch] = React.useState(assignment.asset_name);
  const isFocusAsset = useSelector((state) => state.assignment.isFocusAsset);
  const [asset, setAssetData] = useState([]);
  const [selectedData, setSelectedData] = useState(assignment.name);
  const debouncedSearch = useDebounce(search, 700);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(0);
  const handleGetAsset = async () => {
    setIsLoading(true);
    const result = await getAllAssets({ search: debouncedSearch, page: page });
    if (result === 401) {
      handleSetUnthorization();
      setIsLoading(false);
    } else if (result === 500) {
      ErrorToast('Something went wrong. Please try again', 3000);
      setIsLoading(false);
    } else {
      setAssetData(result.data);
      setTotalPage(result.meta.last_page);
      setTotalRecord(result.meta.total);
      setPage(1);
      setIsLoading(false);
    }
  };
  const [currentData, setCurrentData] = useState(props.defaultValue);

  const handleChange = (e) => {
    setSearch(e.target.value);
    dispatch(setIsSearchingAsset(true));
    dispatch(setIsFocusAsset(true));
    dispatch(setIsFocusUser(false));
    setTotalPage(1);
  };
  const handlePageChange = async (page) => {
    setIsLoading(true);
    const result = await getAllAssets({
      sort: [{ key: 'staff_code', value: 'asc' }],
      search: debouncedSearch,
      page,
    });
    if (result === 401) {
      handleSetUnthorization();
      setIsLoading(false);
    } else if (result === 500) {
      ErrorToast('Something went wrong. Please try again', 3000);
      setIsLoading(false);
    } else {
      setAssetData(result.data);
      setTotalPage(result.meta.last_page);
      setTotalRecord(result.meta.total);
      setPage(page);
      setIsLoading(false);
    }
  };

  const handleSetUnthorization = () => {
    dispatch(setExpiredToken(true));
    localStorage.removeItem('token');
  };

  useEffect(() => {
    setIsLoading(true);
    if (debouncedSearch === '' || debouncedSearch) {
      handleGetAsset();
      setIsLoading(false);
    }
    if (debouncedSearch === selectedData || debouncedSearch === assignment.asset_name) {
      dispatch(setIsSearchingAsset(false));
      setIsLoading(false);
    }
    handlePageChange();
  }, [debouncedSearch]);
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <InputGroup
      className="textFieldBoth"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <Form.Control
        ref={ref}
        variant="outline-secondary"
        className="textField"
        placeholder="Search by Asset Name or Asset Code"
        onChange={handleChange}
        value={search}
        autoFocus={isFocusAsset ? true : false}
      />
      <InputGroup.Text className="textField">
        <HiOutlineChevronDown />
      </InputGroup.Text>
    </InputGroup>
  ));
  CustomToggle.displayName = 'CustomToggle';
  const CustomMenu = React.forwardRef(({ children, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: '100%' }}
        className={className}
        aria-labelledby={labeledBy}
        id="assignment-edit-user-asset"
      >
        <ul className="list-unstyled dropdownScroll mb-0 ps-2">
          {React.Children.toArray(children).length === 0 ? (
            <p className="d-flex justify-content-center text-danger font-weight-bold pt-4">No matching results</p>
          ) : (
            React.Children.toArray(children)
          )}
        </ul>
      </div>
    );
  });
  CustomMenu.displayName = 'CustomMenu';
  const dispatch = useDispatch();
  const handleGetData = (name, id) => {
    dispatch(setAssetId(id));
    setCurrentData(name);
    setSearch(name);
    dispatch(setIsSearchingAsset(false));
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(false));
    setSelectedData(name);
  };
  const handleGetCurrentData = (name, id) => {
    dispatch(setAssetId(id));
    setCurrentData(name);
    setSearch(name);
    dispatch(setIsSearchingAsset(false));
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(false));
    setSelectedData(name);
  };
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {currentData}
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {isLoading ? (
            <div className="d-flex justify-content-center pt-2">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : (assignment.asset_code.toString().match(debouncedSearch) && asset.length === 0) ||
            (assignment.asset_name.toString().match(debouncedSearch) && asset.length === 0) ||
            (assignment.asset_code.toString().toLowerCase().match(debouncedSearch.toString().toLowerCase()) &&
              asset.length === 0) ||
            (assignment.asset_name.toString().toLowerCase().match(debouncedSearch.toString().toLowerCase()) &&
              asset.length === 0) ||
            (assignment.asset_code.toString().toUpperCase().match(debouncedSearch) && asset.length === 0) ||
            (assignment.asset_name.toString().toUpperCase().match(debouncedSearch) && asset.length === 0) ? (
            <Dropdown.Item onClick={() => handleGetCurrentData(assignment.asset_name, assignment.asset_id)}>
              <Row>
                <Col lg={2}>{assignment.asset_code}</Col>
                <Col lg={1}>&nbsp;&nbsp;&nbsp;&nbsp;-</Col>
                <Col lg={9}>
                  {assignment.asset_name} <span className="text-danger font-weight-bold">{'(Current asset)'}</span>
                </Col>
              </Row>
            </Dropdown.Item>
          ) : debouncedSearch.length === 0 ||
            (assignment.asset_code.toString().match(debouncedSearch) && asset.length !== 0) ||
            (assignment.asset_name.toString().match(debouncedSearch) && asset.length !== 0) ||
            (assignment.asset_code.toString().toLowerCase().match(debouncedSearch.toString().toLowerCase()) &&
              asset.length !== 0) ||
            (assignment.asset_name.toString().toLowerCase().match(debouncedSearch.toString().toLowerCase()) &&
              asset.length !== 0) ||
            (assignment.asset_code.toString().toUpperCase().match(debouncedSearch) && asset.length !== 0) ||
            (assignment.asset_name.toString().toUpperCase().match(debouncedSearch) && asset.length !== 0) ? (
            <div>
              <Dropdown.Item onClick={() => handleGetCurrentData(assignment.asset_name, assignment.asset_id)}>
                <Row>
                  <Col lg={2}>{assignment.asset_code}</Col>
                  <Col lg={1}>&nbsp;&nbsp;&nbsp;&nbsp;-</Col>
                  <Col lg={9}>
                    {assignment.asset_name} <span className="text-danger font-weight-bold">{'(Current asset)'}</span>
                  </Col>
                </Row>
              </Dropdown.Item>
              {asset.map((item) => {
                return (
                  <Dropdown.Item key={item.id} onClick={() => handleGetData(item.asset_name, item.id)}>
                    <Row>
                      <Col lg={2}>{item.asset_code}</Col>
                      <Col lg={1}>&nbsp;&nbsp;&nbsp;&nbsp;-</Col>
                      <Col lg={9}>{item.asset_name}</Col>
                    </Row>
                  </Dropdown.Item>
                );
              })}
            </div>
          ) : asset.length !== 0 ? (
            <div>
              {asset.map((item) => {
                return (
                  <Dropdown.Item key={item.id} onClick={() => handleGetData(item.asset_name, item.id)}>
                    <Row>
                      <Col lg={2}>{item.asset_code}</Col>
                      <Col lg={1}>&nbsp;&nbsp;&nbsp;&nbsp;-</Col>
                      <Col lg={9}>{item.asset_name}</Col>
                    </Row>
                  </Dropdown.Item>
                );
              })}
              {totalPage > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3" height="20px">
                  <Pagination
                    handlePageChange={handlePageChange}
                    perPage={perPage}
                    currentPage={page}
                    totalRecord={totalRecord}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="d-flex justify-content-center text-danger font-weight-bold">No matching results</p>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
DropdownListAsset.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.node,
  style: PropTypes.node,
  className: PropTypes.node,
  'aria-labelledby': PropTypes.node,
  defaultValue: PropTypes.string,
  autoFocus: PropTypes.bool,
};
