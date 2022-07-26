import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import PropTypes from 'prop-types';

import './style.css';

export default function FilterButtonState(props) {
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle className="filter-button d-flex align-items-center justity-content-center">
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
            checked={props.currentFilter === 'All'}
            onChange={() => handleFilter('All')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-assigned"
            className="mx-4 my-2 font-weight-bold"
            label="Assigned"
            checked={props.currentFilter === 'Assigned'}
            onChange={() => handleFilter('Assigned')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-staff"
            className="mx-4 font-weight-bold"
            label="Available"
            checked={props.currentFilter === 'Available'}
            onChange={() => handleFilter('Available')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-not_available"
            className="mx-4 font-weight-bold"
            label="Not available"
            checked={props.currentFilter === 'Not available'}
            onChange={() => handleFilter('Not available')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-waiting_recycling"
            className="mx-4 font-weight-bold"
            label="Waiting for recycling"
            checked={props.currentFilter === 'Waiting for recycling'}
            onChange={() => handleFilter('Waiting for recycling')}
          />
          <Form.Check
            type="checkbox"
            id="checkbox-recycled"
            className="mx-4 font-weight-bold"
            label="Recycled"
            checked={props.currentFilter === 'Recycled'}
            onChange={() => handleFilter('Recycled')}
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterButtonState.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
};
