import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { HiFilter } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { categoryListSelector } from '../../../redux/selectors/category/category.selector';

import './style.css';

export default function FilterButtonCategory(props) {
  const handleFilter = (value) => {
    props.setCurrentFilter(value);
  };
  const [...listCategory] = useSelector(categoryListSelector);
  return (
    <Dropdown>
      <Dropdown.Toggle className="filter-button d-flex align-items-center justity-content-center">
        <p className="flex-grow-1 font-weight-bold">Category</p>
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
          {listCategory.map((item, index) => {
            return (
              <div key={index}>
                <Form.Check
                  type="checkbox"
                  className="mx-4 font-weight-bold"
                  data-category={item.id}
                  id={`cateid_${item.id}`}
                  checked={props.currentFilter === item.category_name}
                  label={item.category_name}
                  onChange={() => handleFilter(item.category_name)}
                />
              </div>
            );
          })}
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

FilterButtonCategory.propTypes = {
  currentFilter: PropTypes.string,
  setCurrentFilter: PropTypes.func,
};
