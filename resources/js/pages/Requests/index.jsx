import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';

import { requests_table_header } from '../../../assets/data/requests_table_header';
import { getAllRequests } from '../../api/Requests';
import NotFoundData from '../../components/Layouts/NotFoundData';
import { BlockUI } from '../../components/Layouts/Notiflix';
import Pagination from '../../components/Layouts/Pagination';
import Skeleton from '../../components/Layouts/Skeleton';
import FilterReturnedDate from '../../components/Requests/FilterReturnedDate/FilterReturnedDate';
import FilterStateButton from '../../components/Requests/FilterStateButton/FilterStateButton';
import RequestsTable from '../../components/Requests/Table';
import { setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';

export default function Requests() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...requests_table_header]);
  const [sort, setCurrentSort] = React.useState([]);
  const [filter, setFilter] = React.useState('All');
  const [filterDate, setFilterDate] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(0);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setTitle('Request for Returning'));
    dispatch(setSubTitle(''));
    handleGetAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetAllRequests = async () => {
    const result = await getAllRequests();
    setLoading(false);
    setRequests(result);
  };

  const handleSort = async (sort, header) => {
    BlockUI('#root');
    let tempSearch;
    let tempFilter;
    let tempFilterDate;
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (filterDate !== '') tempFilterDate = filterDate;
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllRequests({
      sort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
    });
    setRequests(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const handleCurrentFilter = async (value) => {
    let tempFilter;
    if ((value === filter && value === 'Completed') || (value === filter && value === 'Waiting for returning')) {
      setFilter('All');
    } else if (value === filter && value === 'All') {
      setFilter('All');
      return;
    } else {
      setFilter(value);
      if (value === 'Completed' || value === 'Waiting for returning') tempFilter = value;
    }
    BlockUI('#root');
    let tempSearch;
    let tempSort;
    let tempFilterDate;
    if (search !== '') tempSearch = search;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (filterDate !== '') tempFilterDate = filterDate;
    const result = await getAllRequests({
      sort: tempSort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
    });
    setRequests(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const handleCurrentFilterDate = async (value) => {
    let tempFilterDate;
    if (value instanceof Date) {
      tempFilterDate = value;
      setFilterDate(value);
    } else {
      setFilterDate('');
    }
    BlockUI('#root');
    let tempSearch;
    let tempSort;
    let tempFilter;
    if (filter === 'Accepted' || filter === 'Waiting for acceptance') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    const result = await getAllRequests({
      sort: tempSort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
    });
    setRequests(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    BlockUI('#root');
    let tempSort;
    let tempFilter;
    let tempFilterDate;
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (filterDate !== '') tempFilterDate = filterDate;
    if (search !== '') {
      const result = await getAllRequests({
        sort: tempSort,
        search,
        filter: tempFilter,
        filterDate: tempFilterDate,
      });
      setRequests(result, 'reset-page');
      Notiflix.Block.remove('#root');
      return;
    }
    const result = await getAllRequests({ sort: tempSort, filter: tempFilter, filterDate: tempFilterDate });
    setRequests(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const handlePageChange = async (page) => {
    BlockUI('#root');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page);
    let tempSort;
    let tempFilter;
    let tempFilterDate;
    let tempSearch;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (filter === 'Completed' || filter === 'Waiting for returning') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (filterDate !== '') tempFilterDate = filterDate;
    const result = await getAllRequests({
      sort: tempSort,
      filter: tempFilter,
      search: tempSearch,
      filterDate: tempFilterDate,
      page,
    });
    setRequests(result, 'page');
    Notiflix.Block.remove('#root');
  };

  const setRequests = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-3">Request List</h5>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex">
          <FilterStateButton currentFilter={filter} setCurrentFilter={handleCurrentFilter} />
          <div className="ms-3">
            <FilterReturnedDate setCurrentFilter={handleCurrentFilterDate} date={filterDate} />
          </div>
          {filterDate !== '' && (
            <Button variant="danger" className="font-weight-bold ms-3" onClick={() => handleCurrentFilterDate('')}>
              Reset date
            </Button>
          )}
        </div>
        <div>
          <Form onSubmit={(e) => handleSearch(e)}>
            <InputGroup>
              <Form.Control
                placeholder="
                Asset code or asset name or requester's username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button id="search-user" variant="danger" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
      {!loading ? (
        <>
          {data?.length > 0 ? (
            <RequestsTable data={data} sort={sort} renderTableHeader={renderTableHeader} handleSort={handleSort} />
          ) : (
            <NotFoundData />
          )}
        </>
      ) : (
        <Skeleton column={9} />
      )}
      {totalPage > 1 && (
        <div className="d-flex justify-content-end align-items-center mt-3">
          <Pagination
            handlePageChange={handlePageChange}
            perPage={perPage}
            currentPage={page}
            totalRecord={totalRecord}
          />
        </div>
      )}
    </section>
  );
}
