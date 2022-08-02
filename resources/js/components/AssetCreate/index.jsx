/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaAngleDown, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import { get, post } from '../../htttpHelper';
import { setSubTitle } from '../../redux/reducer/app/app.reducer';
import { assetAction } from '../../redux/reducer/asset/asset.reducer';
import { userSelector } from '../../redux/selectors';
import { normalizeSpace } from '../../utils/stringNormalize';
import { SuccessToast } from '../Layouts/Alerts';

import './style.css';
import 'react-datepicker/dist/react-datepicker.css';
function AssetCreate() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [headerTitle, setHeaderTitle] = useState('');
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [errorAddCategory, setErrorAddCategory] = useState('');
  const [errorNameAsset, setErrorNameAsset] = useState('');
  const [errorSpeAsset, setErrorSpeAsset] = useState('');
  const [installedDate, setInstalledDate] = useState('');
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [inputs, setInputs] = useState({
    asset_name: '',
    specification: '',
    installed_date: '',
    category_id: '',
    state: 'Available',
    location_id: '',
  });
  const [inputAddCategory, setInputAddCategory] = useState({
    category_prefix: '',
    category_name: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    get('/categories')
      .then((res) => {
        setCategories(res.data.data.data);
        if (inputAddCategory.category_name === res.data.data.data.category_name) {
          setErrorAddCategory('Category is already exists. Please enter a different category');
        }
        if (inputAddCategory.category_prefix === res.data.data.data.category_prefix) {
          setErrorAddCategory('Prefix is already exists. Please enter a different prefix');
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorAddCategory(error);
      });
  };

  const preSave = () => {
    let check = true;

    if (inputs.asset_name === '') {
      check = false;
    }
    if (inputs.specification === '') {
      check = false;
    }
    if (installedDate === '') {
      check = false;
    }
    if (inputs.categoryPrefix === '') {
      check = false;
    }
    if (inputs.state === '') {
      check = false;
    }
    return check;
  };

  const preAddCate = () => {
    let check = true;

    let categoryPrefix = handlePrefix(inputAddCategory.category_name);
    if (inputAddCategory.category_name.replace(/\s/g, '') === '' && inputAddCategory.category_prefix === '') {
      setErrorAddCategory('Please input two input ');
      check = false;
    } else if (inputAddCategory.category_name.replace(/\s/g, '') === '') {
      setErrorAddCategory('Please input category name');
      check = false;
    } else if (inputAddCategory.category_prefix === '') {
      setErrorAddCategory('Please input category prefix');
      check = false;
    } else if (categoryPrefix === inputAddCategory.category_prefix) {
      inputAddCategory.category_prefix = categoryPrefix;
    } else if (categoryPrefix !== inputAddCategory.category_prefix) {
      setErrorAddCategory('Please input category prefix right');
      check = false;
    }

    if (inputAddCategory.category_prefix.length > 5 || inputAddCategory.category_prefix.length < 2) {
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

  const handleOnChangeAdd = (e) => {
    let value = e.target.value;

    if (e.target.name === 'prefix') {
      value = value.replace(/[^A-Za-z]/gi, '');
    } else {
      value = value.replace(/[^A-Za-z\s]/gi, '');
      // value = value.replace(/\s+/g, ' ').trim();
    }
    // console.log('vl', value);
    setInputAddCategory((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };
  const user = useSelector(userSelector);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorNameAsset('');
    setErrorSpeAsset('');
    let check = true;
    if (check === false) {
      return;
    }

    inputs.installed_date = installedDate.split('-').join('/');
    inputs.asset_name = normalizeSpace(inputs.asset_name).trim();
    inputs.location_id = user.location_id;
    setIsSaving(true);
    post('/assets', inputs)
      .then(() => {
        SuccessToast('Create asset successfully', 3000);
        navigate('../manage_asset');
      })
      .catch((error) => {
        setIsSaving(false);
        console.log(error);
      });
  };

  const handleOnClickAdd = () => {
    setShow(true);
  };

  const onChangeSelected = (item) => {
    if (show !== true) {
      setDisplay(!display);
      setHeaderTitle(item.category_name);
      setInputs((prevState) => ({
        ...prevState,
        category_id: item.id,
      }));
    }
  };

  const removeNewCategory = () => {
    setInputAddCategory({
      category_name: '',
      category_prefix: '',
    });
    setErrorAddCategory('');
    setShow(false);
  };
  function getNumOfWords(word) {
    let words = word.split(' ');
    return words.length;
  }
  function handlePrefix(categoryName) {
    if (getNumOfWords(categoryName) < 2) {
      return categoryName.slice(0, 2).toUpperCase();
    } else {
      let tokens = categoryName.split(' ');
      return tokens
        .map((token) => token.slice(0, 1))
        .join('')
        .toUpperCase();
    }
  }

  const addNewCategory = () => {
    if (!preAddCate()) {
      return;
    }

    inputAddCategory.category_prefix = inputAddCategory.category_prefix.toUpperCase();
    inputAddCategory.category_name = inputAddCategory.category_name.replace(/\s+/g, ' ').trim();

    setErrorAddCategory('');

    post('/categories', inputAddCategory)
      .then((res) => {
        setCategories([
          ...categories,
          { category_name: res.data.data.category_name, category_prefix: res.data.data.category_prefix },
        ]);

        setShow(false);
        setInputAddCategory({
          category_name: '',
          category_prefix: '',
        });
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setErrorAddCategory('Prefix is already exists. Please enter a different prefix');
        } else {
          setErrorAddCategory('Category is already exists. Please enter a different category');
        }
      });
  };

  const handleDisplay = () => {
    if (show !== true) {
      setShow(false);
      setDisplay(!display);
    }
  };

  const openDatePicker = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  };
  const backtoManagerAsset = () => {
    navigate('../manage_asset', { replace: true });
    dispatch(assetAction.setIsAdd(false));
    dispatch(setSubTitle(''));
  };
  return (
    <>
      <h5 className="text-danger font-weight-bold mb-3">Create new asset</h5>
      <div className="edit_form d-flex justify-content-center">
        <Form onSubmit={handleSubmit}>
          <table align="center" border="0" className="table table-bordered mb-0">
            <tbody>
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Name</p>
                </td>
                <td width="70%">
                  <Form.Control name="asset_name" type="text" required onChange={handleOnChange} />
                  <span id="error">{errorNameAsset}</span>
                </td>
              </tr>
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Category</p>
                </td>
                <td width="70%">
                  <div className="boder_search" onClick={handleDisplay}>
                    <div className="title_name">{headerTitle}</div>
                    <FaAngleDown className="angledown" />
                  </div>
                  <div className="list_below" style={{ display: display ? 'block' : 'none' }}>
                    <ul id="list">
                      {categories.map((item) => (
                        <li className="category_item" key={item.id}>
                          <option className="name_area" onClick={() => onChangeSelected(item)}>
                            {item.category_name}
                          </option>
                        </li>
                      ))}

                      {show === true ? (
                        <li id="end_li">
                          <div className="add_cate">
                            <div className="left">
                              <input
                                id="input_add"
                                value={inputAddCategory.category_name}
                                maxLength={20}
                                minLength={1}
                                name="category_name"
                                onChange={handleOnChangeAdd}
                              />
                            </div>
                            <div className="right-prefix">
                              <input
                                id="input_add"
                                value={inputAddCategory.category_prefix}
                                maxLength={5}
                                minLength={2}
                                name="category_prefix"
                                onChange={handleOnChangeAdd}
                              />
                            </div>
                            <div className="right">
                              <FaCheck className="check" onClick={addNewCategory} />
                              <FaTimes className="times" onClick={removeNewCategory} />
                            </div>
                          </div>
                          <span id="error">{errorAddCategory}</span>
                        </li>
                      ) : (
                        <></>
                      )}
                      {show === false ? (
                        <li id="end_li">
                          <div className="add_cate">
                            {show === false ? (
                              <Button id="link" className="add_new" variant="link" onClick={handleOnClickAdd}>
                                Add new category
                              </Button>
                            ) : (
                              <></>
                            )}
                          </div>
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>

              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Specification</p>
                </td>
                <td width="70%">
                  <Form.Control
                    className="textarea-input"
                    name="specification"
                    as="textarea"
                    required
                    onChange={handleOnChange}
                  />
                  <span id="error">{errorSpeAsset}</span>
                </td>
              </tr>

              <tr required controlId="installed_date">
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
                      maxDate={new Date()}
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
                    defaultChecked
                    value="Available"
                    onChange={handleOnChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Not available"
                    name="state"
                    id="notavailable"
                    required
                    value="Not Available"
                    onChange={handleOnChange}
                  />
                </td>
              </tr>

              <tr>
                <td width="30%" />
                <td width="70%" className="d-flex justify-content-end">
                  {!isSaving ? (
                    <Button variant="danger" type="submit" disabled={!preSave()}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="danger" type="submit" disabled>
                      <Spinner animation="border" size="sm" variant="light" />
                      Save
                    </Button>
                  )}
                  <button
                    className="btn btn-outline-secondary"
                    style={{ marginLeft: '40px' }}
                    onClick={backtoManagerAsset}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
    </>
  );
}
AssetCreate.propTypes = {
  backToManageAsset: PropTypes.func,
};
export default AssetCreate;
