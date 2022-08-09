import React, { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllAssets } from '../../../../api/Assignment';
import { setAssetId } from '../../../../redux/reducer/assignment/assignment.reducer';

import './style.css';

export default function DropdownListAsset(props) {
  const [search, setSearch] = React.useState('');
  const [asset, setAssetData] = useState([]);
  const handleGetAsset = async () => {
    const result = await getAllAssets();
    setAssetData(result.data);
  };
  const [currentData, setCurrentData] = useState(props.defaultValue);
  useEffect(() => {
    handleGetAsset();
  }, [currentData]);
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <InputGroup
      className="textFieldBoth"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <Form.Control ref={ref} variant="outline-secondary" defaultValue={children} className="textField" readOnly />
      <InputGroup.Text className="textField">
        <HiOutlineChevronDown />
      </InputGroup.Text>
    </InputGroup>
  ));
  CustomToggle.displayName = 'CustomToggle';
  const CustomMenu = React.forwardRef(({ children, className, 'aria-labelledby': labeledBy }, ref) => {
    return (
      <div ref={ref} style={{ width: '100%' }} className={className} aria-labelledby={labeledBy}>
        <div className="textSearch">
          <Form.Control
            autoFocus
            placeholder="Search by User Name or Staff Code..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <ul className="list-unstyled dropdownScroll">
          {React.Children.toArray(children).filter(
            (child) =>
              !search ||
              child.props.children.toString().toLowerCase().match(search) ||
              child.props.children.toString().toUpperCase().match(search) ||
              child.props.children.toString().match(search) ||
              child.props.children.toString().toUpperCase().match(search)
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
  };
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {currentData}
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {asset.map((item) => {
            return (
              <Dropdown.Item onClick={() => handleGetData(item.asset_name, item.id)} key={item.id}>
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
  defaultValue: PropTypes.string.isRequired,
};
