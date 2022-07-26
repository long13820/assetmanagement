import NotFound from '../../../../assets/images/not_found.png';

export default function NotFoundData() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <img src={NotFound} alt="Not Found" width="300px" height="100%" className="mb-3" />
      <h4 className="font-weight-bold text-danger">Oops ... The system could not find any matching data</h4>
    </div>
  );
}
