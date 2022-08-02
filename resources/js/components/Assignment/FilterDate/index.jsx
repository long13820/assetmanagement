import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

export default function FilterDate(props) {
  const [date, setDate] = useState('');
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle className="assignment-filter-date d-flex align-items-center justity-content-center">
        <p className="flex-grow-1 afd-name font-weight-bold">Assigned Date</p>
        <div className="fb-icon">
          <BsFillCalendarDateFill />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-3">
        <Form>
          <DatePicker
            selected={date}
            dateFormat="dd/MM/yyyy"
            onChange={(e) => {
              setDate(e);
              handleFilter(e);
            }}
            className="form-control"
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterDate.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
};
