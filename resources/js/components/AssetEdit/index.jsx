import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { get, put } from '../../htttpHelper';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { assetgetIdSelector } from '../../redux/selectors/asset/asset.selector';
import { formatDate } from '../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../Layouts/Alerts';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

function EditAsset(props) {
  const dispatch = useDispatch();

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
  const dataId = useSelector(assetgetIdSelector);
  const id = dataId;

  useEffect(() => {
    fetchAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAsset = () => {
    get(`/assets/${id}`)
      .then((res) => {
        const installedDate = res.data.data[0].installed_date.split('/').reverse().join('-');
        const object = {
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

  const handleSubmit = async (e) => {
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

    await put(`/assets/${id}`, inputs)
      .then(() => {
        SuccessToast('Update asset successfully', 3000);
      })
      .catch(() => {
        ErrorToast('Update asset unsuccessfully', 3000);
      });

    dispatch(
      assetAction.setIsEdit({
        isEdit: false,
      })
    );
    dispatch(
      assetAction.setFilter({
        'filter[state]': 'Available,Not Available,Assigned,Waiting for recycling,Recycled',
        'filter[category]': undefined,
        'sort[asset_code]': undefined,
        'sort[asset_name]': undefined,
        'sort[category_name]': undefined,
        'sort[state]': undefined,
        'sort[updated_at]': 'desc',
      })
    );
    dispatch(assetAction.setSortHeader(true));
    dispatch(assetAction.setLoadingFilter(true));
    // eslint-disable-next-line react/prop-types
    props.filterAll(true);
  };

  const openDatePicker = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  return (
    <>
      <div className="asset_edit_form d-flex justify-content-center">
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
                    id="edit-asset-name"
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
                  <div className="aef-category-input">
                    <Form.Control id="edit-asset-category" disabled defaultValue={inputs.categoryName} />
                    <FaAngleDown className="aefci-icon" />
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
                    id="edit-asset-specification"
                    as="textarea"
                    required
                    onChange={handleOnChange}
                    value={inputs.specification}
                  />
                  <span id="error">{errorSpeAsset}</span>
                </td>
              </tr>
              <tr required>
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
            </tbody>
          </table>
          <div className="d-flex justify-content-end mt-3">
            <Button id="edit-asset-save btn" variant="danger" type="submit" disabled={!preSave()}>
              Save
            </Button>
            <button
              id="edit-asset-cancel-btn"
              className="btn btn-outline-secondary ms-3"
              onClick={() => dispatch(assetAction.setIsEdit(false))}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
export default EditAsset;
