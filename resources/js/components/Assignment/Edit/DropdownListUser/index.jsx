/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllUsers } from '../../../../api/User';
import {
  setIsFocusAsset,
  setIsFocusUser,
  setIsSearching,
  setUserId,
} from '../../../../redux/reducer/assignment/assignment.reducer';

import './style.css';

export default function DropdownListUser(props) {
  const assignment = useSelector((state) => state.assignment.assignment);
  const isFocusUser = useSelector((state) => state.assignment.isFocusUser);
  const [search, setSearch] = React.useState(assignment.full_name);
  const [currentData, setCurrentData] = useState(props.defaultValue);
  const [user, setUserData] = React.useState([]);
  const [selectedData, setSelectedData] = useState(assignment.name);

  const handleChange = (e) => {
    setSearch(e.target.value);
    dispatch(setIsSearching(true));
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(true));
  };

  const handleGetUser = async () => {
    const result = await getAllUsers({ sort: [{ key: 'staff_code', value: 'asc' }] });
    setUserData(result.data);
  };

  useEffect(() => {
    handleGetUser();
    if (search === selectedData || search === assignment.full_name) {
      dispatch(setIsSearching(false));
    }
  }, []);

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
        placeholder="Search by User Name or Staff Code..."
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
        <ul className="list-unstyled mb-0 ms-2 p-0 dropdownScroll">
          {React.Children.toArray(children).filter(
            (child) =>
              !search ||
              child.props.children.toString().toLowerCase().match(search) ||
              child.props.children.toString().toUpperCase().match(search) ||
              child.props.children.toString().match(search)
          )}
        </ul>
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
          {user.length > 0 &&
            user.map((item) => {
              return (
                <Dropdown.Item onClick={() => handleGetData(item.full_name, item.id)} key={item.id}>
                  {item.staff_code}&nbsp;&nbsp;-&nbsp;&nbsp;{item.full_name}&nbsp;&nbsp;&nbsp;
                  {item.id === assignment.user_id ? (
                    <span className="text-danger font-weight-bold">{'(Current user)'}</span>
                  ) : (
                    ''
                  )}
                </Dropdown.Item>
              );
            })}
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
