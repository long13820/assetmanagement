export default function EditNote() {
  return (
    <div>
      <p>
        <small>
          (*)&nbsp;User must be <span className="font-weight-bold">over 18 years old</span>
        </small>
      </p>
      <p>
        <small>
          (*)&nbsp;<span className="font-weight-bold">Joined date</span>&nbsp;is&nbsp;
          <span className="font-weight-bold">not later</span>&nbsp;than&nbsp;
          <span className="font-weight-bold">date of birth</span> or&nbsp;
          <span className="font-weight-bold">is not Saturday</span> or&nbsp;
          <span className="font-weight-bold">Sunday</span>.
        </small>
      </p>
    </div>
  );
}
