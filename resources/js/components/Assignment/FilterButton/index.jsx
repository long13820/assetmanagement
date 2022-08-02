import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import PropTypes from 'prop-types';

import './style.css';

export default function FilterButton(props) {
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle className="assignment-filter-button d-flex align-items-center justity-content-center">
        <p className="afb-name flex-grow-1 font-weight-bold">State</p>
        <div className="fb-icon">
          <HiFilter />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Form>
          <Dropdown.Item onClick={() => handleFilter('All')}>
            <Form.Check
              type="checkbox"
              id="checkbox-all"
              className="mx-4 font-weight-bold"
              label="All"
              checked={props.currentFilter === 'All'}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter('Accepted')}>
            <Form.Check
              type="checkbox"
              id="checkbox-admin"
              className="mx-4 my-2 font-weight-bold"
              label="Accepted"
              checked={props.currentFilter === 'Accepted'}
            />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter('Waiting for acceptance')}>
            <Form.Check
              type="checkbox"
              id="checkbox-staff"
              className="mx-4 font-weight-bold"
              label="Waiting for acceptance"
              checked={props.currentFilter === 'Waiting for acceptance'}
            />
          </Dropdown.Item>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterButton.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
};
