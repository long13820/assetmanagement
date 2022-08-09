/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

import { assignment_table_header } from '../../../assets/data/assignment_table_header';
import { getAllAssignments } from '../../api/Assignment';
import AssignmentEditForm from '../../components/Assignment/Edit';
import FilterButton from '../../components/Assignment/FilterButton';
import FilterDate from '../../components/Assignment/FilterDate';
import FormInput from '../../components/Assignment/FormInput';
import AssignmentTable from '../../components/Assignment/Table';
import NotFoundData from '../../components/Layouts/NotFoundData';
import { BlockUI } from '../../components/Layouts/Notiflix';
import Pagination from '../../components/Layouts/Pagination';
import Skeleton from '../../components/Layouts/Skeleton';
import { setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';
import { setIsAdd, setIsEdit } from '../../redux/reducer/assignment/assignment.reducer';

export default function Assignment() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...assignment_table_header]);
  const [sort, setCurrentSort] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [filterDate, setFilterDate] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(18);
  const [totalPage, setTotalPage] = React.useState(0);
  const isAdd = useSelector((state) => state.assignment.isAdd);
  const isEdit = useSelector((state) => state.assignment.isEdit);
  const [sortDate, setSortDate] = React.useState('');

  React.useEffect(() => {
    dispatch(setIsAdd(false));
    dispatch(setTitle('Manage Assignment'));
    dispatch(setSubTitle(''));
    handleGetAllAssignments();
    dispatch(setIsEdit(false));
  }, []);

  const forceReload = async () => {
    let tempSort;
    let tempPage;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (page > 1) tempPage = page;
    const result = await getAllAssignments({
      sort: tempSort,
      page: tempPage,
    });
    setAssignment(result);
    Notiflix.Block.remove('#root');
  };

  const handleGetAllAssignments = async () => {
    const result = await getAllAssignments();
    setLoading(false);
    setAssignment(result);
  };

  const handleSort = async (sort, header) => {
    BlockUI('#root');
    let tempSearch;
    let tempFilter;
    let tempSortDate;
    let tempFilterDate;
    if (
      filter === 'Accepted' ||
      filter === 'Waiting for acceptance' ||
      filter === 'Waiting for returning' ||
      filter === 'Declined'
    )
      tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (sortDate !== '') tempSortDate = sortDate;
    if (filterDate !== '') tempFilterDate = filterDate;
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllAssignments({
      sort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
      edit: tempSortDate,
    });
    setAssignment(result, 'reset-page');
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
    let tempSortDate;
    let tempFilter;
    if (
      filter === 'Accepted' ||
      filter === 'Waiting for acceptance' ||
      filter === 'Waiting for returning' ||
      filter === 'Declined'
    )
      tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (sortDate !== '') tempSortDate = sortDate;
    const result = await getAllAssignments({
      sort: tempSort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
      edit: tempSortDate,
    });
    setAssignment(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const handleCurrentFilter = async (value) => {
    let tempFilter;
    if (
      (value === filter && value === 'Accepted') ||
      (value === filter && value === 'Waiting for acceptance') ||
      (value === filter && value === 'Waiting for returning') ||
      (value === filter && value === 'Declined')
    ) {
      setFilter('All');
    } else if (value === filter && value === 'All') {
      setFilter('All');
      return;
    } else {
      setFilter(value);
      if (['Accepted', 'Waiting for acceptance', 'Declined', 'Waiting for returning'].includes(value))
        tempFilter = value;
    }
    BlockUI('#root');
    let tempSearch;
    let tempSort;
    let tempSortDate;
    let tempFilterDate;
    if (search !== '') tempSearch = search;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (sortDate !== '') tempSortDate = sortDate;
    if (filterDate !== '') tempFilterDate = filterDate;
    const result = await getAllAssignments({
      sort: tempSort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
      edit: tempSortDate,
    });
    setAssignment(result, 'reset-page');
    Notiflix.Block.remove('#root');
  };

  const dispatch = useDispatch();
  const goToCreateNewAssignment = (e) => {
    e.stopPropagation();
    setTimeout(() => {
      Notiflix.Block.remove('#root');
      dispatch(setIsAdd(true));
      dispatch(setSubTitle('Create Assignment'));
    }, 500);
    BlockUI('#root', 'fixed');
  };

  const backToManageAssignment = async (field) => {
    let tempSearch;
    let tempFilter;
    let tempPage;
    let tempFilterDate;
    if (
      filter === 'Accepted' ||
      filter === 'Waiting for acceptance' ||
      filter === 'Waiting for returning' ||
      filter === 'Declined'
    )
      tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (page > 1) tempPage = page;
    setSortDate(field);
    if (filterDate !== '') tempFilterDate = filterDate;
    const result = await getAllAssignments({
      sort,
      search: tempSearch,
      filter: tempFilter,
      filterDate: tempFilterDate,
      page: tempPage,
      edit: field,
    });
    setAssignment(result);
    if (field === 'created_at') dispatch(setIsAdd(false));
    if (field === 'updated_at') dispatch(setIsEdit(false));
    Notiflix.Block.remove('#root');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    BlockUI('#root');
    let tempSort;
    let tempFilter;
    let tempSortDate;
    let tempFilterDate;
    if (
      filter === 'Accepted' ||
      filter === 'Waiting for acceptance' ||
      filter === 'Waiting for returning' ||
      filter === 'Declined'
    )
      tempFilter = filter;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (sortDate !== '') tempSortDate = sortDate;
    if (filterDate !== '') tempFilterDate = filterDate;
    if (search !== '') {
      const result = await getAllAssignments({
        sort: tempSort,
        search,
        filter: tempFilter,
        filterDate: tempFilterDate,
      });
      setAssignment(result, 'reset-page');
      Notiflix.Block.remove('#root');
      return;
    }
    const result = await getAllAssignments({
      sort: tempSort,
      filter: tempFilter,
      edit: tempSortDate,
      filterDate: tempFilterDate,
    });
    setAssignment(result, 'reset-page');
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
    let tempSortDate;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (
      filter === 'Accepted' ||
      filter === 'Waiting for acceptance' ||
      filter === 'Waiting for returning' ||
      filter === 'Declined'
    )
      tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (sortDate !== '') tempSortDate = sortDate;
    if (filterDate !== '') tempFilterDate = filterDate;
    const result = await getAllAssignments({
      sort: tempSort,
      filter: tempFilter,
      search: tempSearch,
      page,
      edit: tempSortDate,
      filterDate: tempFilterDate,
    });
    setAssignment(result, 'page');
    Notiflix.Block.remove('#root');
  };

  const setAssignment = (result, value) => {
    setData(result.data);
    if (value !== 'page') setPage(1);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  return (
    <section>
      {!isAdd && !isEdit && <h5 className="text-danger font-weight-bold mb-3">Assignment List</h5>}
      {isAdd && <h5 className="text-danger font-weight-bold mb-3">Create Assignment</h5>}
      {isEdit && <h5 className="text-danger font-weight-bold mb-3">Edit Assignment</h5>}
      {!isAdd && !isEdit ? (
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <FilterButton currentFilter={filter} setCurrentFilter={handleCurrentFilter} />
            <div className="ms-3">
              <FilterDate setCurrentFilter={handleCurrentFilterDate} />
            </div>
          </div>
          <div className="d-flex">
            <Form onSubmit={(e) => handleSearch(e)}>
              <InputGroup>
                <Form.Control
                  placeholder="Asset or Assigned to"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="danger" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
            <Button onClick={goToCreateNewAssignment} variant="danger" className="font-weight-bold ms-3">
              Create new assignment
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
      {!isAdd && !isEdit ? (
        <>
          {!loading ? (
            <>
              {data?.length > 0 ? (
                <AssignmentTable
                  data={data}
                  forceReload={forceReload}
                  sort={sort}
                  renderTableHeader={renderTableHeader}
                  handleSort={handleSort}
                  backtoManageAssignment={backToManageAssignment}
                />
              ) : (
                <NotFoundData />
              )}
            </>
          ) : (
            <Skeleton column={6} />
          )}
          {totalPage > 1 && (
            <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
              <Pagination
                handlePageChange={handlePageChange}
                perPage={perPage}
                currentPage={page}
                totalRecord={totalRecord}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {isEdit && <AssignmentEditForm backtoManageAssignment={backToManageAssignment} />}
          {isAdd && <FormInput backtoManageAssignment={backToManageAssignment} />}
        </>
      )}
    </section>
  );
}
