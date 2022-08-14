/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FaAngleDown, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { addSchema } from '../../adapter/AssetAdapter';
import { createAsset, createNewCategory, getAllCategories } from '../../api/Asset/assetAPI';
import { setExpiredToken, setSubTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { userSelector } from '../../redux/selectors';
import { formatDate } from '../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../Layouts/Alerts';
import { BlockUI } from '../Layouts/Notiflix';

import './style.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function AssetCreate() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(addSchema),
    defaultValues: {
      state: 'Available',
    },
  });

  const user = useSelector(userSelector);

  const [categoryName, setCategoryName] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [errorAddCategory, setErrorAddCategory] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [errorNameExist, setErrorNameExist] = React.useState('');
  const [errorPrefixExist, setErrorPrefixExist] = React.useState('');
  const [isOpenDatePicker, setIsOpenDatePicker] = React.useState(false);

  const [inputAddCategory, setInputAddCategory] = React.useState({
    category_prefix: '',
    category_name: '',
  });

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    BlockUI('#root', 'fixed');
    const result = await getAllCategories();
    if (result.length >= 0) {
      setCategories(result);
      Notiflix.Block.remove('#root');
    } else if (result === 401) {
      handleSetUnthorization();
      Notiflix.Block.remove('#root');
    } else {
      Notiflix.Block.remove('#root');
      ErrorToast('Something went wrong. Please try again', 3000);
      dispatch(assetAction.setIsAdd(false));
      dispatch(setSubTitle(''));
    }
  };

  const preAddCate = () => {
    let check = true;

    if (inputAddCategory.category_name.replace(/\s/g, '') === '' && inputAddCategory.category_prefix === '') {
      setErrorAddCategory('Please input two input');
      check = false;
    } else if (inputAddCategory.category_name.replace(/\s/g, '') === '') {
      setErrorAddCategory('Please input category name');
      check = false;
    } else if (inputAddCategory.category_prefix === '') {
      setErrorAddCategory('Please input category prefix');
      check = false;
    }
    if (inputAddCategory.category_prefix.length > 5) {
      return false;
    }

    return check;
  };

  const handleOnChangeAdd = (e) => {
    let { value } = e.target;

    value = e.target.name === 'prefix' ? value.replace(/[^A-Za-z]/gi, '') : value.replace(/[^A-Za-z\s]/gi, '');

    setInputAddCategory((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const onSubmit = async (data) => {
    BlockUI('#root');
    data.location_id = user.location_id;
    data.installed_date = formatDate(data.installed_date, 'YYYY-MM-DD');
    const result = await createAsset(data);
    if (result === 200) {
      SuccessToast('Create asset successfully', 3000);
      dispatch(assetAction.setIsAdd(false));
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
    } else if (result === 401) {
      handleSetUnthorization();
    } else {
      ErrorToast('Create asset unsuccessfully', 3000);
    }
    Notiflix.Block.remove('#root');
  };

  const removeNewCategory = () => {
    setInputAddCategory({
      category_name: '',
      category_prefix: '',
    });
    setErrorAddCategory('');
    setErrorPrefixExist('');
    setErrorNameExist('');
    setShow(false);
  };

  const addNewCategory = async () => {
    BlockUI('#root');
    if (!preAddCate()) {
      Notiflix.Block.remove('#root');
      return;
    }

    inputAddCategory.category_prefix = inputAddCategory.category_prefix.toUpperCase();
    inputAddCategory.category_name = inputAddCategory.category_name.replace(/\s+/g, ' ').trim();

    setErrorAddCategory('');
    setErrorPrefixExist('');
    setErrorNameExist('');

    const result = await createNewCategory(inputAddCategory);
    Notiflix.Block.remove('#root');
    if (result !== 401 && result !== 500) {
      if (result.error?.category_name && result.error?.category_prefix) {
        setErrorNameExist('Category is already exists. Please enter a different category');
        setErrorPrefixExist('Prefix is already exists. Please enter a different prefix');
        return;
      }

      if (result.error?.category_name && !result.error?.category_prefix) {
        setErrorNameExist('Category is already exists. Please enter a different category');
        setErrorPrefixExist('');
        return;
      }

      if (!result.error?.category_name && result.error?.category_prefix) {
        setErrorNameExist('');
        setErrorPrefixExist('Prefix is already exists. Please enter a different prefix');
        return;
      }

      if (result.category_name && result.category_prefix && result.id) {
        setCategories([
          ...categories,
          {
            category_name: result.category_name,
            category_prefix: result.category_prefix,
            id: result.id,
          },
        ]);
        setShow(false);
        setInputAddCategory({
          category_name: '',
          category_prefix: '',
        });
        SuccessToast('Add new category successfully', 3000);
      }
    } else if (result === 401) {
      handleSetUnthorization();
    } else {
      ErrorToast('Something went wrong. Please try again', 3000);
    }
  };

  const backtoManagerAsset = () => {
    dispatch(assetAction.setIsAdd(false));
    dispatch(setSubTitle(''));
  };

  const asset_name = useWatch({
    control,
    name: 'asset_name',
  });

  const specification = useWatch({
    control,
    name: 'specification',
  });

  const handleSetUnthorization = () => {
    dispatch(setExpiredToken(true));
    localStorage.removeItem('token');
  };

  return (
    <div className="asset-create-form d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <table align="center" border="0" className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Name</p>
              </td>
              <td width="70%">
                <Form.Control id="form-asset-name" type="text" maxLength={50} {...register('asset_name')} />
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
                <Dropdown
                  onToggle={() => {
                    if (menu) {
                      removeNewCategory();
                    }
                    setMenu(!menu);
                  }}
                  id="categories-list"
                >
                  <Dropdown.Toggle id="form-asset-category" className="cl-toggle d-flex justify-content-between">
                    <span>{categoryName}</span>
                    <span>
                      <FaAngleDown className="text-black" />
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu show={menu} id="form-category-menu" className="cl-menu">
                    <div className="clm-layout">
                      {categories.length > 0 &&
                        categories.map((item) => {
                          return (
                            <Dropdown.Item
                              id={item.category_name}
                              key={item.id}
                              active={categoryName === item.category_name}
                              onClick={() => {
                                setCategoryName(item.category_name);
                                setValue('category_id', item.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              {item.category_name}
                            </Dropdown.Item>
                          );
                        })}
                    </div>
                    <div className="cl-add-new-category">
                      {!show && (
                        <p
                          id="add-new-category-btn"
                          className="add-new-category-btn font-weight-bold text-danger cursor-pointer"
                          onClick={() => setShow(true)}
                        >
                          <u>
                            <i>Add new category</i>
                          </u>
                        </p>
                      )}
                      {show && (
                        <>
                          <div className="d-flex align-items-center">
                            <div className="d-flex flex-grow-1">
                              <Form.Control
                                id="new-category-name"
                                className="w-75"
                                value={inputAddCategory.category_name}
                                name="category_name"
                                onChange={handleOnChangeAdd}
                                placeholder="Bluetooth Mouse"
                                type="text"
                                maxLength={50}
                                minLength={1}
                              />
                              <Form.Control
                                id="new-category-prefix"
                                className="w-25"
                                placeholder="BM"
                                type="text"
                                maxLength={5}
                                minLength={1}
                                value={inputAddCategory.category_prefix}
                                name="category_prefix"
                                onChange={handleOnChangeAdd}
                              />
                            </div>
                            <div className="d-flex ps-3">
                              <FaCheck
                                id="add-category"
                                className="text-danger cursor-pointer"
                                onClick={addNewCategory}
                              />
                              <FaTimes
                                id="cancel-category"
                                className="ms-3 text-black cursor-pointer"
                                onClick={() => removeNewCategory()}
                              />
                            </div>
                          </div>
                          {errorAddCategory !== '' && (
                            <div>
                              <small className="font-weight-semi text-danger">{errorAddCategory}</small>
                            </div>
                          )}
                          {errorNameExist !== '' && (
                            <div>
                              <small className="font-weight-semi text-danger">{errorNameExist}</small>
                            </div>
                          )}
                          {errorPrefixExist !== '' && (
                            <div>
                              <small className="font-weight-semi text-danger">{errorPrefixExist}</small>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Specification</p>
              </td>
              <td width="70%">
                <Form.Control className="textarea-input" as="textarea" {...register('specification')} maxLength={200} />
                <div className="d-flex justify-content-end">
                  <small className="font-weight-bold">
                    {specification === undefined ? 0 : specification.length}/200
                  </small>
                </div>
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
                          onClickOutside={() => setIsOpenDatePicker(!isOpenDatePicker)}
                          onSelect={() => setIsOpenDatePicker(!isOpenDatePicker)}
                          onFocus={() => setIsOpenDatePicker(!isOpenDatePicker)}
                          open={isOpenDatePicker}
                        />
                        <FaCalendarAlt className="icon-date" onClick={() => setIsOpenDatePicker(!isOpenDatePicker)} />
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
                <Form.Check
                  type="radio"
                  label="Available"
                  name="state"
                  id="available"
                  value="Available"
                  {...register('state')}
                />
                <Form.Check
                  type="radio"
                  label="Not available"
                  name="state"
                  id="notavailable"
                  value="Not Available"
                  {...register('state')}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-end mt-3">
          <Button variant="danger" type="submit" disabled={!isValid}>
            Save
          </Button>
          <Button variant="outline-secondary" className="ms-3" onClick={backtoManagerAsset}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

AssetCreate.propTypes = {
  backToManageAsset: PropTypes.func,
};
