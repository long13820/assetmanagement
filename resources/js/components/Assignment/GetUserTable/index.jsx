import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { assignment_table_user } from '../../../../assets/data/assignment_table_user';
import { getAllUsers } from '../../../api/User';
import NotFoundData from '../../../components/Layouts/NotFoundData';
import { BlockUI } from '../../../components/Layouts/Notiflix';
import Pagination from '../../../components/Layouts/Pagination';
import AssignmentUserTable from '../TableUser';

export default function GetUserTable(props) {
  const [data, setData] = React.useState(props.data);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...assignment_table_user]);
  const [sort, setCurrentSort] = React.useState([
    {
      key: 'first_name',
      value: 'asc',
    },
  ]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(props.totalRecord);
  const [perPage] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(props.totalPage);

  const handleSort = async (sort, header) => {
    BlockUI('.select-user-modal');
    let tempSearch;
    let tempPage;
    if (search !== '') tempSearch = search;
    if (page > 1) tempPage = page;
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllUsers({ sort, search: tempSearch, page: tempPage });
    setUser(result);
    Notiflix.Block.remove('.select-user-modal');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    BlockUI('.select-user-modal');
    let tempSort;
    let tempPage;

    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (page > 1) tempPage = page;
    if (search !== '') {
      const result = await getAllUsers({ sort: tempSort, search, page: tempPage });
      setUser(result);
      Notiflix.Block.remove('.select-user-modal');
      return;
    }
    const result = await getAllUsers({ sort: tempSort, page: tempPage });
    setUser(result);
    Notiflix.Block.remove('.select-user-modal');
  };

  const handlePageChange = async (page) => {
    BlockUI('.select-user-modal');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page);
    let tempSort;

    let tempSearch;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (search !== '') tempSearch = search;
    const result = await getAllUsers({ sort: tempSort, search: tempSearch, page });
    setUser(result, 'page');
    Notiflix.Block.remove('.select-user-modal');
    return;
  };

  const setUser = (result, value) => {
    setData(result.data);
    if (value !== 'page') setPage(1);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  const handleCurrentSetUserName = (name, id, code) => {
    props.handleCurrentSetUserName(name, id, code);
  };

  return (
    <section>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <h5 className="text-danger font-weight-bold pt-3 mb-3">Select User</h5>
        <Form onSubmit={(e) => handleSearch(e)}>
          <InputGroup>
            <Form.Control placeholder="Staff code or name" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="danger" type="submit">
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>
      </div>
      {data.length > 0 ? (
        <AssignmentUserTable
          data={data}
          sort={sort}
          handleCurrentSetUserName={handleCurrentSetUserName}
          renderTableHeader={renderTableHeader}
          handleSort={handleSort}
        />
      ) : (
        <NotFoundData widthImage="140px" />
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

GetUserTable.propTypes = {
  handleCurrentSetUserName: PropTypes.func,
  data: PropTypes.any,
  totalRecord: PropTypes.number,
  totalPage: PropTypes.number,
};
