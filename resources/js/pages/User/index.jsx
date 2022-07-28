import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

import { user_table_header } from '../../../assets/data/user_table_header';
import { getAllUsers } from '../../api/User';
import NotFoundData from '../../components/Layouts/NotFoundData';
import { BlockUI } from '../../components/Layouts/Notiflix';
import Pagination from '../../components/Layouts/Pagination';
import Skeleton from '../../components/Layouts/Skeleton';
import UserAddForm from '../../components/User/Add';
import UserEditForm from '../../components/User/Edit';
import FilterButton from '../../components/User/FilterButton';
import UserTable from '../../components/User/Table';
import { setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';
import { setIsAdd, setIsEdit, setResetState } from '../../redux/reducer/user/user.reducer';
import { isAddSelector, isEditSelector } from '../../redux/selectors';
export default function User() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...user_table_header]);
  const [sort, setCurrentSort] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(8);
  const [totalPage, setTotalPage] = React.useState(0);
  const [sortDate, setSortDate] = React.useState('');
  const isAdd = useSelector(isAddSelector);
  const isEdit = useSelector(isEditSelector);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setResetState());
    dispatch(setTitle('Manage User'));
    handleGetAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetAllUsers = async () => {
    const result = await getAllUsers();
    setLoading(false);
    setUser(result);
  };

  const backToManageUser = async (field) => {
    let tempSearch;
    let tempFilter;
    let tempPage;
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (page > 1) tempPage = page;
    setSortDate(field);
    const result = await getAllUsers({
      sort,
      search: tempSearch,
      filter: tempFilter,
      page: tempPage,
      edit: field,
    });
    setUser(result);
    if (field === 'created_at') dispatch(setIsAdd(false));
    if (field === 'updated_at') dispatch(setIsEdit(false));
    dispatch(setSubTitle(''));
    Notiflix.Block.remove('#root');
  };

  const handleSort = async (sort, header) => {
    BlockUI('#root');
    let tempSearch;
    let tempFilter;
    let tempPage;
    let tempSortDate;
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (page > 1) tempPage = page;
    if (sortDate !== '') tempSortDate = sortDate;
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllUsers({
      sort,
      search: tempSearch,
      filter: tempFilter,
      page: tempPage,
      edit: tempSortDate,
    });
    setUser(result);
    Notiflix.Block.remove('#root');
  };

  const handleCurrentFilter = async (value) => {
    let tempFilter;
    if ((value === filter && value === 'Admin') || (value === filter && value === 'Staff')) {
      setFilter('All');
    } else if (value === filter && value === 'All') {
      setFilter('All');
      return;
    } else {
      setFilter(value);
      if (value === 'Admin' || value === 'Staff') tempFilter = value;
    }
    BlockUI('#root');
    let tempSearch;
    let tempSort;
    let tempPage;
    let tempSortDate;
    if (search !== '') tempSearch = search;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (page > 1) tempPage = page;
    if (sortDate !== '') tempSortDate = sortDate;
    const result = await getAllUsers({
      sort: tempSort,
      search: tempSearch,
      filter: tempFilter,
      page: tempPage,
      edit: tempSortDate,
    });
    setUser(result);
    Notiflix.Block.remove('#root');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    BlockUI('#root');
    let tempSort;
    let tempFilter;
    let tempPage;
    let tempSortDate;
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (sortDate !== '') tempSortDate = sortDate;
    if (page > 1) tempPage = page;
    if (search !== '') {
      const result = await getAllUsers({
        sort: tempSort,
        search,
        filter: tempFilter,
        page: tempPage,
        edit: tempSortDate,
      });
      setUser(result);
      Notiflix.Block.remove('#root');
      return;
    }
    const result = await getAllUsers({ sort: tempSort, filter: tempFilter, page: tempPage, edit: tempSortDate });
    setUser(result);
    Notiflix.Block.remove('#root');
  };

  const handlePageChange = async (page) => {
    BlockUI('.main');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page);
    let tempSort;
    let tempFilter;
    let tempSearch;
    let tempSortDate;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (filter === 'Admin' || filter === 'Staff') tempFilter = filter;
    if (search !== '') tempSearch = search;
    if (sortDate !== '') tempSortDate = sortDate;
    const result = await getAllUsers({
      sort: tempSort,
      filter: tempFilter,
      search: tempSearch,
      page,
      edit: tempSortDate,
    });
    setUser(result, 'page');
    Notiflix.Block.remove('.main');
  };

  const setUser = (result, value) => {
    setData(result.data);
    if (value !== 'page') setPage(1);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  const goToCreateNewUser = () => {
    dispatch(setIsAdd(true));
    dispatch(setSubTitle('Create new user'));
  };

  return (
    <section>
      {!isEdit && !isAdd && <h5 className="text-danger font-weight-bold mb-3">User List</h5>}
      {isEdit && <h5 className="text-danger font-weight-bold mb-3">Edit user</h5>}
      {isAdd && <h5 className="text-danger font-weight-bold mb-3">Create new user</h5>}
      {!isEdit && !isAdd ? (
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <FilterButton currentFilter={filter} setCurrentFilter={handleCurrentFilter} />
          <div className="d-flex">
            <Form onSubmit={(e) => handleSearch(e)}>
              <InputGroup>
                <Form.Control
                  placeholder="Staff code or name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="danger" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
            <Button onClick={goToCreateNewUser} variant="danger" className="font-weight-bold ms-3">
              Create new user
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
      {!isEdit && !isAdd ? (
        <>
          {!loading ? (
            <>
              {data.length > 0 ? (
                <UserTable data={data} sort={sort} renderTableHeader={renderTableHeader} handleSort={handleSort} />
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
          {isEdit && <UserEditForm backToManageUser={backToManageUser} />}
          {isAdd && <UserAddForm backToManageUser={backToManageUser} />}
        </>
      )}
    </section>
  );
}
