/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editSchema } from '../../adapter/AssetAdapter';
import { editAsset } from '../../api/Asset/assetAPI';
import { setSubTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { assetEditData, assetgetIdSelector } from '../../redux/selectors/asset/asset.selector';
import { formatDate } from '../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../Layouts/Alerts';
import { BlockUI } from '../Layouts/Notiflix';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

function EditAsset(props) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState('');
  const dataId = useSelector(assetgetIdSelector);
  const editData = useSelector(assetEditData);
  const id = dataId;

  React.useEffect(() => {
    if (editData) {
      setCategoryName(editData.category_name);
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, isDirty, errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(editSchema),
    defaultValues: {
      asset_name: editData?.asset_name,
      specification: editData?.specification,
      state: editData?.state,
      installed_date: new Date(editData?.installed_date),
    },
  });

  const backToManageAssetDispatch = () => {
    dispatch(
      assetAction.setIsEdit({
        isEdit: false,
      })
    );
    dispatch(setSubTitle(''));
    dispatch(
      assetAction.fetchListAsset({
        'filter[state]': 'Available,Not Available,Assigned',
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
    props.filterAll(false);
  };

  const onSubmit = async (data) => {
    BlockUI('#root');
    data.installed_date = formatDate(data.installed_date, 'YYYY-MM-DD');
    const result = await editAsset(data, id);
    if (result === 200) {
      SuccessToast('Update asset successfully', 3000);
      backToManageAssetDispatch();
    } else {
      ErrorToast('Update asset unsuccessfully', 3000);
    }
    Notiflix.Block.remove('#root');
  };

  const asset_name = useWatch({
    control,
    name: 'asset_name',
  });

  return (
    <div className="asset_edit_form d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <table align="center" border="0" className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Name</p>
              </td>
              <td width="70%">
                <Form.Control id="edit-asset-name" type="text" maxLength={50} {...register('asset_name')} />
                <div className="d-flex justify-content-between">
                  <small className="text-red font-weight-semi">
                    {asset_name?.length > 0 && errors?.asset_name?.type === 'matches' && errors?.asset_name?.message}
                  </small>
                  <small className="font-weight-bold">{asset_name === undefined ? 0 : asset_name.length}/50</small>
                </div>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Category</p>
              </td>
              <td width="70%">
                <div className="aef-category-input">
                  <Form.Control id="edit-asset-category" disabled defaultValue={categoryName} />
                  <FaAngleDown className="aefci-icon" />
                </div>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Specification</p>
              </td>
              <td width="70%">
                <Form.Control id="edit-asset-specification" as="textarea" {...register('specification')} />
              </td>
            </tr>
            <tr required>
              <td width="30%">
                <p className="font-weight-bold">Installed Date</p>
              </td>
              <td width="70%">
                <div className="datepicker">
                  <Controller
                    name="installed_date"
                    {...register('installed_date')}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <DatePicker
                          className="form-control"
                          selected={value}
                          onChange={onChange}
                          dateFormat="dd/MM/yyyy"
                          showMonthDropdown
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={50}
                          placeholderText="dd/mm/yyyy"
                          maxDate={new Date()}
                        />
                        <FaCalendarAlt className="icon-date" />
                      </>
                    )}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">State</p>
              </td>
              <td width="70%">
                <Form.Check type="radio" label="Available" id="available" value="Available" {...register('state')} />
                <Form.Check
                  type="radio"
                  label="Not available"
                  id="notavailable"
                  value="Not Available"
                  {...register('state')}
                />
                <Form.Check
                  type="radio"
                  label="Waiting for recycling"
                  id="wait"
                  value="Waiting for recycling"
                  {...register('state')}
                />
                <Form.Check type="radio" label="Recycled" id="recycled" value="Recycled" {...register('state')} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-end mt-3">
          <Button
            id="edit-asset-save"
            variant="danger"
            className="font-weight-bold me-3"
            type="submit"
            disabled={!isDirty || !isValid}
          >
            Save
          </Button>
          <Button
            id="edit-asset-cancel-btn"
            variant="outline-secondary"
            className="font-weight-bold"
            onClick={() => {
              dispatch(assetAction.setIsEdit(false));
              dispatch(setSubTitle(''));
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

EditAsset.propTypes = {
  filterAll: PropTypes.func,
};

export default EditAsset;
