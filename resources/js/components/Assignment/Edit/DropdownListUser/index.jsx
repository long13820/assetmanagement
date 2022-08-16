/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, InputGroup, Row, Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllUsers } from '../../../../api/User';
import { setExpiredToken } from '../../../../redux/reducer/app/app.reducer';
import {
  setIsFocusAsset,
  setIsFocusUser,
  setIsSearching,
  setUserId,
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

export default function DropdownListUser(props) {
  const assignment = useSelector((state) => state.assignment.assignment);
  const isFocusUser = useSelector((state) => state.assignment.isFocusUser);
  const [search, setSearch] = React.useState(assignment.full_name);
  const [currentData, setCurrentData] = useState(props.defaultValue);
  const [user, setUserData] = React.useState([]);
  const [selectedData, setSelectedData] = useState(assignment.name);
  const debouncedSearch = useDebounce(search, 700);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(0);
  const handleChange = (e) => {
    setSearch(e.target.value);
    dispatch(setIsSearching(true));
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(true));

    setTotalPage(1);
  };

  const handleGetUser = async () => {
    setIsLoading(true);
    const result = await getAllUsers({
      sort: [{ key: 'staff_code', value: 'asc' }],
      search: debouncedSearch,
      page: page,
    });
    if (result === 401) {
      handleSetUnthorization();
      setIsLoading(false);
    } else if (result === 500) {
      ErrorToast('Something went wrong. Please try again', 3000);
      setIsLoading(false);
    } else {
      setUserData(result.data);
      setTotalPage(result.meta.last_page);
      setTotalRecord(result.meta.total);
      setPage(1);
      setIsLoading(false);
    }
  };
  const handlePageChange = async (page) => {
    setIsLoading(true);
    const result = await getAllUsers({
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
      setUserData(result.data);
      setTotalPage(result.meta.last_page);
      setTotalRecord(result.meta.total);
      setPage(page);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if (debouncedSearch === '' || debouncedSearch) {
      handleGetUser();
      setIsLoading(false);
    }
    if (debouncedSearch === selectedData || debouncedSearch === assignment.full_name) {
      dispatch(setIsSearching(false));
    }
    handlePageChange();
  }, [debouncedSearch]);

  const handleSetUnthorization = () => {
    dispatch(setExpiredToken(true));
    localStorage.removeItem('token');
  };

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
        placeholder="Search by User Name or Staff Code"
        onChange={handleChange}
        value={search}
        autoFocus={isFocusUser ? true : false}
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
        id="assignment-edit-user"
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled dropdownScroll mb-0 ps-2">{React.Children.toArray(children)}</ul>
      </div>
    );
  });

  CustomMenu.displayName = 'CustomMenu';
  const dispatch = useDispatch();
  const handleGetData = (name, id) => {
    dispatch(setUserId(id));
    setCurrentData(name);
    dispatch(setIsSearching(false));
    setSearch(name);
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(false));
    setSelectedData(name);
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components1">
          {currentData}
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {isLoading ? (
            <div className="d-flex justify-content-center pt-2">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : user.length > 0 ? (
            <div>
              {user.map((item) => {
                return (
                  <Dropdown.Item onClick={() => handleGetData(item.full_name, item.id)} key={item.id}>
                    <Row>
                      <Col lg={2}>{item.staff_code}</Col>
                      <Col lg={1}>&nbsp;-</Col>
                      <Col lg={9}>
                        {item.full_name}{' '}
                        {item.id === assignment.user_id ? (
                          <span className="text-danger font-weight-bold">{'(Current user)'}</span>
                        ) : (
                          ''
                        )}
                      </Col>
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
DropdownListUser.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.node,
  style: PropTypes.node,
  className: PropTypes.node,
  'aria-labelledby': PropTypes.node,
  defaultValue: PropTypes.string,
  autoFocus: PropTypes.bool,
};
