import React from 'react';
import Pagination from 'react-js-pagination';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { currentPageSelector, totalRecordSelector } from '../../../redux/selectors';

import './style.css';

export default function PaginationUI(props) {
  const current_page = useSelector(currentPageSelector);
  const total_record = useSelector(totalRecordSelector);

  const handlePageChange = (page) => {
    props.handlePageChange(page);
  };

  return (
    <Pagination
      activePage={current_page}
      itemsCountPerPage={20}
      totalItemsCount={total_record}
      pageRangeDisplayed={3}
      prevPageText="Previous"
      nextPageText="Next"
      itemClass="page-item"
      linkClass="page-link"
      onChange={handlePageChange}
    />
  );
}

PaginationUI.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
};
