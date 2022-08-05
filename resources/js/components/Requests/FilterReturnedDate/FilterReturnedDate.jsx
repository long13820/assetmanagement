/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/display-name */
import React from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import PropTypes from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const FilterReturnedDateButton = React.forwardRef(({ onClick }, ref) => (
  <Button
    id="custom-filter-returned-date"
    className="custom-filter-returned-date d-flex align-items-center justify-content-center"
    onClick={onClick}
    ref={ref}
  >
    <div className="font-weight-bold flex-grow-1 cfrd-title d-flex align-items-center">
      <p className="flex-grow-1">Returned Date</p>
    </div>
    <span className="cfrd-icon">
      <BsFillCalendarDateFill />
    </span>
  </Button>
));

export default function FilterReturnedDate(props) {
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };

  return (
    <DatePicker
      selected={props.date}
      onChange={(date) => {
        handleFilter(date);
      }}
      customInput={<FilterReturnedDateButton />}
      maxDate={new Date()}
    />
  );
}

FilterReturnedDate.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
  date: PropTypes.any,
};

FilterReturnedDateButton.propTypes = {
  onClick: PropTypes.func,
  onClear: PropTypes.func,
  value: PropTypes.string,
};
