import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { Controller, useForm } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';
import * as yup from 'yup';

import { getAllAssets, handleCreate } from '../../../api/Assignment';
import { getAllUsers } from '../../../api/User';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import {
  setAssetCode,
  setAssetName,
  setIsAdd,
  setStaffCode,
  setUserName,
} from '../../../redux/reducer/assignment/assignment.reducer';
import { formatDate } from '../../../utils/formatDate';
import GetAssetTable from '../../Assignment/GetAssetTable/';
import GetUserTable from '../../Assignment/GetUserTable/';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import { BlockUI } from '../../Layouts/Notiflix';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const schema = yup
  .object({
    asset_name: yup.string().required(),
    user_name: yup.string().required(),
    assigned_date: yup
      .date()
      .required()
      .min(new Date(Date.now() - 86400000)),
  })
  .required();
export default function FormInput(props) {
  const [currentAssetName, setCurrentAssetName] = React.useState({});
  const [currentUserName, setCurrentUserName] = React.useState({});
  const [flagSave, setFlagSave] = React.useState(0);
  const [flagSaveUser, setFlagSaveUser] = React.useState(0);
  const [showUser, setShowUser] = useState(false);
  const [showAsset, setShowAsset] = useState(false);
  const [user, setUser] = useState([]);
  const [asset, setAsset] = useState([]);
  const [totalRecord, setTotalRecord] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(0);

  const dispatch = useDispatch();

  const handleStateModalAsset = (value) => {
    if (value === 'save') {
      setFlagSave(1);
      setValue('asset_name', currentAssetName.name);
    }
    if (value === 'close' && flagSave === 0) {
      setValue('asset_name', '');
    }
    setShowAsset(false);
  };

  const handleStateModalUser = (value) => {
    if (value === 'save') {
      setFlagSaveUser(1);
      setValue('user_name', currentUserName.name);
    }
    if (value === 'close' && flagSaveUser === 0) {
      setValue('user_name', '');
    }
    setShowUser(false);
  };

  const handleShowAsset = () => {
    BlockUI('#root');
    if (flagSave === 0) {
      dispatch(setAssetName(''));
      setCurrentAssetName({});
      setValue('asset_name', '');
    }
    handleGetAssets();
  };

  const handleShowUser = () => {
    BlockUI('#root');
    if (flagSaveUser === 0) {
      dispatch(setUserName(''));
      setCurrentUserName({});
      setValue('user_name', '');
    }
    handleGetUsers();
  };

  const handleGetUsers = async () => {
    const result = await getAllUsers({ sort: [{ key: 'first_name', value: 'asc' }] });
    setUser(result.data);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
    Notiflix.Block.remove('#root');
    setShowUser(true);
  };

  const handleGetAssets = async () => {
    const result = await getAllAssets();
    setAsset(result.data);
    setTotalRecord(result.meta.total);
    setTotalPage(result.meta.last_page);
    Notiflix.Block.remove('#root');
    setShowAsset(true);
  };

  const admin = useSelector((state) => state.app.user);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    TextField: '',
    resolver: yupResolver(schema),
    defaultValues: {
      assigned_date: formatDate(new Date(Date.now()), 'yyyy-MM-DD'),
    },
  });

  const handleCurrentSetAssetName = (name, id, code) => {
    if (Object.keys(currentAssetName).length === 0) {
      dispatch(setAssetName(name));
      dispatch(setAssetCode(code));
      const obj = {
        name,
        id,
      };
      setCurrentAssetName({ ...obj });
      setValue('asset_name', name);
      return;
    }
    if (Object.keys(currentAssetName).length > 0) {
      if (currentAssetName.name === name) {
        dispatch(setAssetName(''));
        setCurrentAssetName({});
        dispatch(setAssetCode(''));
        setValue('asset_name', '');
        return;
      }
      dispatch(setAssetCode(code));
      dispatch(setAssetName(name));
      const obj = {
        name,
        id,
      };
      setCurrentAssetName({ ...obj });
      setValue('asset_name', name);
      return;
    }
  };

  const handleCurrentSetUserName = (name, id, code) => {
    if (Object.keys(currentUserName).length === 0) {
      dispatch(setUserName(name));
      dispatch(setStaffCode(code));
      const obj = {
        name,
        id,
        code,
      };
      setCurrentUserName({ ...obj });
      setValue('user_name', name);
      return;
    }
    if (Object.keys(currentUserName).length > 0) {
      if (currentUserName.name === name) {
        dispatch(setUserName(''));
        dispatch(setStaffCode(''));
        setCurrentUserName({});
        setValue('user_name', '');
        return;
      }
      dispatch(setStaffCode(code));
      dispatch(setUserName(name));
      const obj = {
        name,
        id,
      };
      setCurrentUserName({ ...obj });
      setValue('user_name', name);
      return;
    }
  };

  const onSubmit = async (data) => {
    const response = await handleCreate({
      ...data,
      user_id: currentUserName.id,
      asset_id: currentAssetName.id,
      admin_id: admin.id,
    });

    if (response === 201) {
      SuccessToast('Create assignment is successfully', 3000);
      props.backtoManageAssignment('created_at');
    } else {
      ErrorToast('Created assignment is unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Modal
        scrollable
        backdrop="static"
        show={showUser}
        onHide={() => handleStateModalUser('close')}
        centered
        size="lg"
        contentClassName="select-user-modal"
      >
        <Modal.Body>
          <GetUserTable
            handleCurrentSetUserName={handleCurrentSetUserName}
            data={user}
            totalRecord={totalRecord}
            totalPage={totalPage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleStateModalUser('save')}>
            Save
          </Button>
          <Button variant="outline-secondary" onClick={() => handleStateModalUser('close')} className="ms-3">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        scrollable
        backdrop="static"
        show={showAsset}
        onHide={() => handleStateModalAsset('close')}
        centered
        size="lg"
        contentClassName="select-asset-modal"
      >
        <Modal.Body>
          <GetAssetTable
            handleCurrentSetAssetName={handleCurrentSetAssetName}
            data={asset}
            totalRecord={totalRecord}
            totalPage={totalPage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleStateModalAsset('save')}>
            Save
          </Button>
          <Button variant="outline-secondary" onClick={() => handleStateModalAsset('close')} className="ms-3">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="backgroundCreate">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">User</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <InputGroup className="textFieldBoth" onClick={handleShowUser}>
                  <Form.Control type="text" className="textField" {...register('user_name')} readOnly />
                  <InputGroup.Text className="textField">
                    <BsSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Asset</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <InputGroup className="textFieldBoth" onClick={handleShowAsset}>
                  <Form.Control type="text" className="textField" {...register('asset_name')} readOnly />
                  <InputGroup.Text className="textField">
                    <BsSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Assigned Date</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control type="date" {...register('assigned_date')} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Note</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Controller
                  control={control}
                  name="note"
                  render={({ field }) => (
                    <Form.Control
                      name="note"
                      as="textarea"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </Col>
            </Row>
          </Form.Group>
          {isValid}
          <div className="d-flex justify-content-end mt-4">
            <Button className="font-weight-bold" variant="danger" disabled={!isValid} type="submit">
              &nbsp;Save&nbsp;
            </Button>
            <Button
              className="font-weight-bold ms-3"
              onClick={() => {
                dispatch(setSubTitle(''));
                dispatch(setIsAdd(false));
              }}
              variant="outline-secondary"
              type="cancel"
            >
              Cancel
            </Button>
          </div>
          <div className="mt-3 text-justify">
            <small>
              (*)&nbsp;<span className="font-weight-bold">Assigned date</span>&nbsp;must be&nbsp;
              <span className="font-weight-bold">current</span>
              &nbsp;or&nbsp;<span className="font-weight-bold">future date</span>
            </small>
          </div>
        </Form>
      </div>
    </div>
  );
}
FormInput.propTypes = {
  backtoManageAssignment: PropTypes.func,
};
