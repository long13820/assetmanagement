/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaAngleDown, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { get, post } from '../../htttpHelper';
import { normalizeSpace } from '../../utils/StringNormalize';

import './style.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function AssetCreate() {
  let navigate = useNavigate();

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
    category_id: '1',
    state: 'Available',
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
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorAddCategory(error);
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

    if (inputAddCategory.category_name.replace(/\s/g, '') === '') {
      check = false;
    }
    if (inputAddCategory.category_prefix === '') {
      check = false;
    }

    if (inputAddCategory.category_prefix.length < 2 || inputAddCategory.category_prefix.length > 2) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorNameAsset('');
    setErrorSpeAsset('');
    let check = true;
    if (inputs.asset_name.length < 10) {
      setErrorNameAsset(
        `Please lengthen this text to 10 character or more (you are currently using ${inputs.assetName.length} character`
      );
      check = false;
    }
    if (inputs.asset_name.length > 40) {
      setErrorNameAsset(
        `Please lengthen this text max 40 character or less (you are currently using ${inputs.assetName.length} character`
      );
      check = false;
    }
    if (inputs.specification.length < 20) {
      setErrorSpeAsset(
        `Please lengthen this text to 20 character or more (you are currently using ${inputs.assetName.length} character`
      );
      check = false;
    }
    if (inputs.specification.length > 80) {
      setErrorSpeAsset(
        `Please lengthen this text max 80 character or less (you are currently using ${inputs.assetName.length} character`
      );
      check = false;
    }

    if (check === false) {
      return;
    }

    inputs.installed_date = installedDate.split('-').join('/');
    inputs.asset_name = normalizeSpace(inputs.asset_name).trim();
    console.log(inputs);
    setIsSaving(true);
    post('/assets', inputs)
      .then(() => {
        navigate('../manage-asset');
        setInputs([...inputs]);
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
        categoryPrefix: item.category_prefix,
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

  const addNewCategory = () => {
    console.log(inputAddCategory);
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
          setErrorAddCategory('Category is already exists. Please enter a different category');
        } else {
          setErrorAddCategory('Prefix is already exists. Please enter a different prefix');
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

  return (
    <>
      <h5 className="content-title">Create asset</h5>
      <Col xs={6}>
        <Form onSubmit={handleSubmit} className="content-form">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Name
            </Form.Label>
            <Col>
              <Form.Control name="asset_name" type="text" required onChange={handleOnChange} />
              <span id="error">{errorNameAsset}</span>
            </Col>
          </Form.Group>
          <Row className="align-items-center mb-3">
            <Col sm={3}>
              <div className="category_area">
                <div className="label">
                  <span>Category</span>
                </div>
              </div>
            </Col>
            <Col>
              <div className="category_input">
                <div className="boder_search" onClick={handleDisplay}>
                  {headerTitle}
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
                          <div className="right">
                            <input
                              id="input_add"
                              value={inputAddCategory.category_prefix}
                              maxLength={2}
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
                            <Button id="link" variant="link" onClick={handleOnClickAdd}>
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
              </div>
            </Col>
          </Row>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Specification
            </Form.Label>
            <Col>
              <Form.Control
                className="textarea-input"
                name="specification"
                as="textarea"
                required
                onChange={handleOnChange}
              />
              <span id="error">{errorSpeAsset}</span>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" required controlId="installed_date">
            <Form.Label column sm={3}>
              Installed Date
            </Form.Label>
            <Col>
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
            </Col>
          </Form.Group>
          <fieldset>
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label as="legend" column sm={3}>
                State
              </Form.Label>

              <Col xs={4}>
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
              </Col>
            </Form.Group>
          </fieldset>

          <Form.Group as={Row} className="float-end mb-3">
            <Col>
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
                onClick={() => navigate('../manage-asset', { replace: true })}
              >
                Cancel
              </button>
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </>
  );
}
