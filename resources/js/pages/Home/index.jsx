import React from 'react';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';

import { home_table_header } from '../../../assets/data/home_table_header';
import { getAllAssignmentsById } from '../../api/Assignment';
import HomeTable from '../../components/Home/Table';
import NotFoundData from '../../components/Layouts/NotFoundData';
import { BlockUI } from '../../components/Layouts/Notiflix';
import Pagination from '../../components/Layouts/Pagination';
import Skeleton from '../../components/Layouts/Skeleton';
import { setSubTitle, setTitle } from '../../redux/reducer/app/app.reducer';

export default function Home() {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [renderTableHeader, setRenderTableHeader] = React.useState([...home_table_header]);
  const [sort, setCurrentSort] = React.useState([]);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [perPage] = React.useState(20);
  const [totalPage, setTotalPage] = React.useState(0);

  React.useEffect(() => {
    dispatch(setTitle('Home'));
    dispatch(setSubTitle(''));
    handleGetAllMyAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forceReload = async () => {
    let tempSort;
    let tempPage;
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    if (page > 1) tempPage = page;
    const result = await getAllAssignmentsById({
      sort: tempSort,
      page: tempPage,
    });
    setAssignmentUser(result);
    Notiflix.Block.remove('#root');
  };

  const handleGetAllMyAssignments = async () => {
    const result = await getAllAssignmentsById();
    setLoading(false);
    setAssignmentUser(result);
  };

  const handleSort = async (sort, header) => {
    BlockUI('#root');
    setCurrentSort(sort);
    setRenderTableHeader(header);
    const result = await getAllAssignmentsById({ sort });
    setAssignmentUser(result, 'reset-page');
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
    if (sort.length > 0) tempSort = JSON.parse(JSON.stringify(sort));
    const result = await getAllAssignmentsById({
      sort: tempSort,
      page,
    });
    setAssignmentUser(result, 'page');
    Notiflix.Block.remove('#root');
  };

  const setAssignmentUser = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
  };

  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-3">My Assignment</h5>
      {!loading ? (
        <>
          {data?.length > 0 ? (
            <HomeTable
              data={data}
              forceReload={forceReload}
              sort={sort}
              renderTableHeader={renderTableHeader}
              handleSort={handleSort}
            />
          ) : (
            <NotFoundData />
          )}
        </>
      ) : (
        <Skeleton column={6} />
      )}
      <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
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
      </div>
    </section>
  );
}
