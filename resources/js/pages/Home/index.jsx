import React from 'react';
import { useDispatch } from 'react-redux';

import HomeTable from '../../components/Home/Table';
import Pagination from '../../components/Layouts/Pagination';
// import Skeleton from '../components/Layouts/Skeleton';
import { setCurrentPage, setTitle } from '../../redux/reducer/app/app.reducer';

export default function Home() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setTitle('Home'));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <section>
      <h5 className="text-danger font-weight-bold mb-3">My Assignment</h5>
      <HomeTable />
      {/* <Skeleton column={7} /> */}
      <div className="d-flex justify-content-end align-items-center pe-5 me-5 mt-3">
        <Pagination handlePageChange={handlePageChange} />
      </div>
    </section>
  );
}
