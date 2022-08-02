import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { get, put } from '../../htttpHelper';
import { formatDate } from '../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../Layouts/Alerts';

import 'react-datepicker/dist/react-datepicker.css';

function EditAsset() {
  const navigate = useNavigate();

  const [installedDate, setInstalledDate] = useState('');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [errorNameAsset, setErrorNameAsset] = useState('');
  const [errorSpeAsset, setErrorSpeAsset] = useState('');
  const [inputs, setInputs] = useState({
    assetName: '',
    specification: '',
    installedDate: '',
    categoryName: '',
    state: '',
  });
  const dataId = useParams();
  const id = dataId.id;

  useEffect(() => {
    fetchAsset();
  }, []);

  const fetchAsset = () => {
    get(`/assets/${id}`)
      .then((res) => {
        let installedDate = res.data.data[0].installed_date.split('/').reverse().join('-');
        let object = {
          assetName: res.data.data[0].asset_name,
          specification: res.data.data[0].specification,
          installedDate: installedDate,
          categoryName: res.data.data[0].category_name,
          state: res.data.data[0].state,
        };
        setInstalledDate(installedDate);
        setInputs(object);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const preSave = () => {
    let check = true;

    if (inputs.assetName === '') {
      check = false;
    }
    if (inputs.specification === '') {
      check = false;
    }
    if (inputs.installedDate === '') {
      check = false;
    }
    if (inputs.state === '') {
      check = false;
    }
    return check;
  };

  const handleOnChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorNameAsset('');
    setErrorSpeAsset('');
    let check = true;
    if (check === false) {
      return;
    }

    inputs.installedDate = formatDate(installedDate, 'YYYY-MM-DD');

    inputs['asset_name'] = inputs['assetName'];
    inputs.category_name = inputs.categoryName;

    if (inputs.installedDate) {
      inputs['installed_date'] = inputs['installedDate'];
      delete inputs.installedDate;
    }

    delete inputs.assetName;
    delete inputs.categoryName;

    put(`/assets/${id}`, inputs)
      .then(() => {
        SuccessToast('Update asset successfully', 3000);
        navigate('/manage_asset');
      })
      .catch(() => {
        ErrorToast('Update asset unsuccessfully', 3000);
      });
  };

  const openDatePicker = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  return (
    <>
      <h5 className="text-danger font-weight-bold mb-3">Edit Asset</h5>
      <div className="edit_form d-flex justify-content-center">
        <Form onSubmit={handleSubmit}>
          <table align="center" border="0" className="table table-bordered mb-0">
            <tbody>
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Name</p>
                </td>
                <td width="70%">
                  <Form.Control
                    name="assetName"
                    type="text"
                    required
                    onChange={handleOnChange}
                    value={inputs.assetName}
                  />
                  <span id="error">{errorNameAsset}</span>
                </td>
              </tr>
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Category</p>
                </td>
                <td width="70%">
                  <div className="boder_search" style={{ background: 'rgb(239 241 245)' }}>
                    <div className="title_name">{inputs.categoryName}</div>
                    <FaAngleDown className="angledown" />
                  </div>
                </td>
              </tr>

              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Specification</p>
                </td>
                <td width="70%">
                  <Form.Control
                    name="specification"
                    as="textarea"
                    required
                    onChange={handleOnChange}
                    value={inputs.specification}
                  />
                  <span id="error">{errorSpeAsset}</span>
                </td>
              </tr>

              <tr required controlId="installedDate">
                <td width="30%">
                  <p className="font-weight-bold">Installed Date</p>
                </td>
                <td width="70%">
                  <div className="datepicker">
                    <DatePicker
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                      onKeyDown={(e) => e.preventDefault()}
                      selected={installedDate && new Date(installedDate)}
                      onChange={(date) => setInstalledDate(moment(date).format('YYYY-MM-DD'))}
                      placeholderText="dd/MM/yyyy"
                      onClickOutside={openDatePicker}
                      onSelect={openDatePicker}
                      onFocus={openDatePicker}
                      open={isOpenDatePicker}
                    />
                    <FaCalendarAlt className="icon-date" onClick={openDatePicker} />
                  </div>
                </td>
              </tr>
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">State</p>
                </td>

                <td width="70%">
                  <Form.Check
                    type="radio"
                    label="Available"
                    name="state"
                    id="available"
                    required
                    value="Available"
                    onChange={handleOnChange}
                    checked={inputs.state === 'Available'}
                  />
                  <Form.Check
                    type="radio"
                    label="Not available"
                    name="state"
                    id="notavailable"
                    required
                    value="Not Available"
                    onChange={handleOnChange}
                    checked={inputs.state === 'Not Available'}
                  />
                  <Form.Check
                    type="radio"
                    label="Waiting for recycling"
                    name="state"
                    id="wait"
                    required
                    value="Waiting for recycling"
                    onChange={handleOnChange}
                    checked={inputs.state === 'Waiting for recycling'}
                  />
                  <Form.Check
                    type="radio"
                    label="Recycled"
                    name="state"
                    id="recycled"
                    required
                    value="Recycled"
                    onChange={handleOnChange}
                    checked={inputs.state === 'Recycled'}
                  />
                  <Form.Check
                    type="radio"
                    label="Assigned"
                    name="state"
                    id="assigned"
                    required
                    value="Assigned"
                    onChange={handleOnChange}
                    checked={inputs.state === 'Assigned'}
                  />
                </td>
              </tr>

              <tr>
                <td width="30%" />
                <td width="70%">
                  <Button variant="danger" type="submit" disabled={!preSave()}>
                    Save
                  </Button>

                  <Link className="btn btn-outline-secondary" style={{ marginLeft: '40px' }} to="/manage_asset">
                    Cancel
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>

        {/* <ModalNotification title={errorTitle} content={errorMessage} show={showError} setShow={setShowError} /> */}
      </div>
    </>
  );
}
export default EditAsset;
