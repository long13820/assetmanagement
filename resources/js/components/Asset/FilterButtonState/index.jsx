import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import PropTypes from 'prop-types';

import './style.css';

export default function FilterButtonState(props) {
  const [checkAll, setCheckAll] = useState(false);

  const handleFilter = (value) => {
    if (value == 'All') {
      setCheckAll(!checkAll);
      props.setCurrentFilter('All');
    } else {
      setCheckAll(false);
      props.setCurrentFilter(value);
    }
  };

  var stateCheck = checkAll ? ['All'] : props.currentFilter;
  return (
    <Dropdown>
      <Dropdown.Toggle className="filter-button btn-asset d-flex align-items-center justity-content-center">
        <p className="flex-grow-1 font-weight-bold">State</p>
        <div className="fb-icon">
          <HiFilter />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Form>
          <Form.Check
            type="checkbox"
            id="checkbox-all"
            className="mx-4 font-weight-bold"
            label="All"
            checked={checkAll ? true : false}
            onChange={() => handleFilter('All')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-assigned"
            className="mx-4 my-2 font-weight-bold"
            label="Assigned"
            checked={stateCheck.indexOf('Assigned') == -1 ? false : true}
            onChange={() => handleFilter('Assigned')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-staff"
            className="mx-4 font-weight-bold"
            label="Available"
            checked={stateCheck.indexOf('Available') == -1 ? false : true}
            onChange={() => handleFilter('Available')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-not_available"
            className="mx-4 font-weight-bold"
            label="Not available"
            checked={stateCheck.indexOf('Not Available') == -1 ? false : true}
            onChange={() => handleFilter('Not Available')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-waiting_recycling"
            className="mx-4 font-weight-bold"
            label="Waiting for recycling"
            checked={stateCheck.indexOf('Waiting for recycling') == -1 ? false : true}
            onChange={() => handleFilter('Waiting for recycling')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-recycled"
            className="mx-4 font-weight-bold"
            label="Recycled"
            checked={stateCheck.indexOf('Recycled') == -1 ? false : true}
            onChange={() => handleFilter('Recycled')}
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterButtonState.propTypes = {
  currentFilter: PropTypes.array,
  setCurrentFilter: PropTypes.func,
};
