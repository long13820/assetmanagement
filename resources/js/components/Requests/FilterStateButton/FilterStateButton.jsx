import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import PropTypes from 'prop-types';

import './style.css';

export default function FilterStateButton(props) {
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        id="filter-state-button"
        className="filter-state-button d-flex align-items-center justify-content-center"
      >
        <p className="flex-grow-1 font-weight-bold">State</p>
        <div className="fb-icon">
          <HiFilter />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu id="filter-state-menu">
        <Form>
          <Dropdown.Item onClick={() => handleFilter('All')}>
            <Form.Check
              type="checkbox"
              id="checkbox-all"
              className="mx-4 font-weight-bold"
              label="All"
              checked={props.currentFilter === 'All'}
              onChange={() => handleFilter('All')}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter('Completed')}>
            <Form.Check
              type="checkbox"
              id="checkbox-completed"
              className="mx-4 my-2 font-weight-bold"
              label="Completed"
              checked={props.currentFilter === 'Completed'}
              onChange={() => handleFilter('Completed')}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter('Waiting for returning')}>
            <Form.Check
              type="checkbox"
              id="checkbox-waiting for returning"
              className="mx-4 font-weight-bold"
              label="Waiting for returning"
              checked={props.currentFilter === 'Waiting for returning'}
              onChange={() => handleFilter('Waiting for returning')}
            />
          </Dropdown.Item>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}
FilterStateButton.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
};
