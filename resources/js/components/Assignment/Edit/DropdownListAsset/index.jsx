/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllAssets } from '../../../../api/Assignment';
import {
  setAssetId,
  setIsFocusAsset,
  setIsFocusUser,
  setIsSearchingAsset,
} from '../../../../redux/reducer/assignment/assignment.reducer';

import './style.css';

export default function DropdownListAsset(props) {
  const assignment = useSelector((state) => state.assignment.assignment);
  const [search, setSearch] = React.useState(assignment.asset_name);
  const isFocusAsset = useSelector((state) => state.assignment.isFocusAsset);
  const [asset, setAssetData] = useState([]);
  const [selectedData, setSelectedData] = useState(assignment.name);
  const handleGetAsset = async () => {
    const result = await getAllAssets();
    setAssetData(result.data);
  };
  const [currentData, setCurrentData] = useState(props.defaultValue);

  const handleChange = (e) => {
    setSearch(e.target.value);
    dispatch(setIsSearchingAsset(true));
    dispatch(setIsFocusAsset(true));
    dispatch(setIsFocusUser(false));
  };
  useEffect(() => {
    handleGetAsset();
    if (search === selectedData || search === assignment.asset_name) {
      dispatch(setIsSearchingAsset(false));
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
        placeholder="Search by Asset Name or Asset Code..."
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
      <div ref={ref} style={{ width: '100%' }} className={className} aria-labelledby={labeledBy}>
        <ul className="list-unstyled dropdownScroll">
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
          <Dropdown.Item onClick={() => handleGetCurrentData(assignment.asset_name, assignment.asset_id)}>
            {assignment.asset_code}&nbsp;&nbsp;-&nbsp;&nbsp;{assignment.asset_name}&nbsp;&nbsp;&nbsp;
            <span className="text-secondary">{'(Current asset)'}</span>
          </Dropdown.Item>
          {asset.map((item) => {
            return (
              <Dropdown.Item key={item.id} onClick={() => handleGetData(item.asset_name, item.id)}>
                {item.asset_code}&nbsp;&nbsp;-&nbsp;&nbsp;{item.asset_name}
              </Dropdown.Item>
            );
          })}
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
