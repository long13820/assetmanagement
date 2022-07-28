import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { assignment_table_asset } from '../../../../assets/data/assignment_table_asset';
import { getAllAssets } from '../../../api/Assignment';
import NotFoundData from '../../../components/Layouts/NotFoundData';
import { BlockUI } from '../../../components/Layouts/Notiflix';
import Pagination from '../../../components/Layouts/Pagination';
import AssignmentAssetTable from '../TableAsset';

export default function GetAssetTable(props) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...assignment_table_asset]);
  const [sort, setCurrentSort] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(8);
  const [totalPage, setTotalPage] = React.useState(0);

  React.useEffect(() => {
    const handleGetAllAssets = async () => {
      BlockUI('#root');
      const result = await getAllAssets();
      setAsset(result);
      setLoading(false);
      Notiflix.Block.remove('#root');
    };
    handleGetAllAssets();
  }, []);

  const handleSort = async (sort, header) => {
    BlockUI('.select-asset-modal');
    let tempSearch;
    let tempPage;
    if (search !== '') tempSearch = search;
    if (page > 1) tempPage = page;
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllAssets({ sort, search: tempSearch, page: tempPage });
    setAsset(result);
    Notiflix.Block.remove('.select-asset-modal');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    BlockUI('.select-asset-modal');
    let tempSort;
    let tempPage;

    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (page > 1) tempPage = page;
    if (search !== '') {
      const result = await getAllAssets({ sort: tempSort, search, page: tempPage });
      setAsset(result);
      Notiflix.Block.remove('.select-asset-modal');
      return;
    }
    const result = await getAllAssets({ sort: tempSort, page: tempPage });
    setAsset(result);
    Notiflix.Block.remove('.select-asset-modal');
  };

  const handlePageChange = async (page) => {
    BlockUI('.main');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page);
    let tempSort;

    let tempSearch;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (search !== '') tempSearch = search;
    const result = await getAllAssets({ sort: tempSort, search: tempSearch, page });
    setAsset(result, 'page');
    Notiflix.Block.remove('.main');
  };

  const setAsset = (result, value) => {
    setData(result.data);
    if (value !== 'page') setPage(1);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  const handleCurrentSetAssetName = (name, id) => {
    props.handleCurrentSetAssetName(name, id);
  };

  return (
    <section>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <h5 className="text-danger font-weight-bold pt-3 mb-3">Select Asset</h5>
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
        </div>
      </div>
      {!loading && (
        <>
          {data.length > 0 ? (
            <AssignmentAssetTable
              data={data}
              sort={sort}
              handleCurrentSetAssetName={handleCurrentSetAssetName}
              renderTableHeader={renderTableHeader}
              handleSort={handleSort}
            />
          ) : (
            <NotFoundData />
          )}
        </>
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
    </section>
  );
}

GetAssetTable.propTypes = {
  handleCurrentSetAssetName: PropTypes.func,
};
