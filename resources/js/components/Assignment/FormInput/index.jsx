import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { useForm, useWatch } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';
import * as yup from 'yup';

import { editAssetById } from '../../../api/Asset/assetAPI';
import { getAllAssets, handleCreate } from '../../../api/Assignment';
import { getAllUsers } from '../../../api/User';
import { setExpiredToken, setSubTitle } from '../../../redux/reducer/app/app.reducer';
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
import Notification from '../../Layouts/Notification';
import { BlockUI } from '../../Layouts/Notiflix';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const schema = yup
  .object({
    asset_name: yup.string().required(),
    user_name: yup.string().required(),
    note: yup.string().max(200),
    assigned_date: yup
      .date()
      .min(new Date(Date.now() - 86400000))
      .required(),
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
  const [showNotification, setShowNotification] = React.useState(false);
  const dispatch = useDispatch();

  const handleStateModalAsset = (value) => {
    if (value === 'save') {
      setFlagSave(1);
      setValue('asset_name', currentAssetName.name, {
        shouldValidate: true,
      });
    }
    if (value === 'close' && flagSave === 0) {
      setValue('asset_name', '', {
        shouldValidate: true,
      });
    }
    setShowAsset(false);
  };

  const handleStateModalUser = (value) => {
    if (value === 'save') {
      setFlagSaveUser(1);
      setValue('user_name', currentUserName.name, {
        shouldValidate: true,
      });
    }
    if (value === 'close' && flagSaveUser === 0) {
      setValue('user_name', '', {
        shouldValidate: true,
      });
    }
    setShowUser(false);
  };

  const handleShowAsset = () => {
    BlockUI('#root');
    if (flagSave === 0) {
      dispatch(setAssetName(''));
      setCurrentAssetName({});
      setValue('asset_name', '', {
        shouldValidate: true,
      });
    }
    handleGetAssets();
  };

  const handleShowUser = () => {
    BlockUI('#root');
    if (flagSaveUser === 0) {
      dispatch(setUserName(''));
      setCurrentUserName({});
      setValue('user_name', '', {
        shouldValidate: true,
      });
    }
    handleGetUsers();
  };

  const handleGetUsers = async () => {
    const result = await getAllUsers({ sort: [{ key: 'first_name', value: 'asc' }] });
    if (result === 401) {
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else if (result === 500) {
      ErrorToast('Something went wrong. Please try again', 3000);
    } else {
      setUser(result.data);
      setTotalRecord(result.meta.total);
      setTotalPage(result.meta.last_page);
      setShowUser(true);
    }
    Notiflix.Block.remove('#root');
  };

  const handleGetAssets = async () => {
    const result = await getAllAssets();
    if (result === 401) {
      dispatch(setExpiredToken(true));
      localStorage.removeItem('token');
    } else if (result === 500) {
      ErrorToast('Something went wrong. Please try again', 3000);
    } else {
      setAsset(result.data);
      setTotalRecord(result.meta.total);
      setTotalPage(result.meta.last_page);
      setShowAsset(true);
    }
    Notiflix.Block.remove('#root');
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
    reValidateMode: 'onChange',
    defaultValues: {
      assigned_date: formatDate(new Date(), 'yyyy-MM-DD'),
    },
    resolver: yupResolver(schema),
  });

  const note = useWatch({
    control,
    name: 'note',
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
      return;
    }
    if (Object.keys(currentAssetName).length > 0) {
      if (currentAssetName.name === name) {
        dispatch(setAssetName(''));
        setCurrentAssetName({});
        dispatch(setAssetCode(''));
        return;
      }
      dispatch(setAssetCode(code));
      dispatch(setAssetName(name));
      const obj = {
        name,
        id,
      };
      setCurrentAssetName({ ...obj });
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
      return;
    }
    if (Object.keys(currentUserName).length > 0) {
      if (currentUserName.name === name) {
        dispatch(setUserName(''));
        dispatch(setStaffCode(''));
        setCurrentUserName({});
        return;
      }
      dispatch(setStaffCode(code));
      dispatch(setUserName(name));
      const obj = {
        name,
        id,
      };
      setCurrentUserName({ ...obj });
      return;
    }
  };

  const sumbitUnthorization = () => {
    dispatch(setExpiredToken(true));
    localStorage.removeItem('token');
    Notiflix.Block.remove('#root');
  };

  const submitServerError = () => {
    ErrorToast('Created assignment is unsuccessfully', 3000);
    Notiflix.Block.remove('#root');
  };

  const onSubmit = async (data) => {
    BlockUI('#root', 'fixed');
    data.assigned_date = formatDate(data.assigned_date, 'yyyy-MM-DD');
    const response = await handleCreate({
      ...data,
      user_id: currentUserName.id,
      asset_id: currentAssetName.id,
      admin_id: admin.id,
    });
    const stateField = { state: 'Assigned' };
    if (response === 201) {
      const response_2 = await editAssetById(currentAssetName.id, stateField);
      if (response_2 === 200) {
        SuccessToast('Create assignment is successfully', 3000);
        props.backtoManageAssignment('created_at');
      } else if (response_2 === 401) {
        sumbitUnthorization();
      } else {
        submitServerError();
      }
    } else if (response === 401) {
      sumbitUnthorization();
    } else {
      submitServerError();
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
          <Button
            id="save-user-btn"
            variant="danger"
            onClick={() => handleStateModalUser('save')}
            className="font-weight-bold"
          >
            Save
          </Button>
          <Button
            id="cancel-user-btn"
            variant="outline-secondary"
            onClick={() => handleStateModalUser('close')}
            className="ms-3 font-weight-bold"
          >
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
          <Button
            id="save-asset-btn"
            variant="danger"
            onClick={() => handleStateModalAsset('save')}
            className="font-weight-bold"
          >
            Save
          </Button>
          <Button
            id="cancel-asset-btn"
            variant="outline-secondary"
            onClick={() => handleStateModalAsset('close')}
            className="ms-3 font-weight-bold"
          >
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
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Assigned Date</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control type="date" min={new Date().toISOString().split('T')[0]} {...register('assigned_date')} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Note</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control as="textarea" maxLength={200} {...register('note')} />
                <div className="d-flex justify-content-end align-items-center font-weight-bold">
                  <small>{note !== undefined ? note.length : 0}/200</small>
                </div>
              </Col>
            </Row>
          </Form.Group>
          {isValid}
          <div className="d-flex justify-content-end mt-4">
            <Button
              id="save-create-assignment"
              className="font-weight-bold"
              variant="danger"
              disabled={!isValid}
              type="submit"
            >
              Save
            </Button>
            <Button
              id="cancel-create-assignment"
              className="font-weight-bold ms-3"
              onClick={() => setShowNotification(true)}
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
          <div className="mt-3 text-justify">
            <small>
              (*)&nbsp;<span className="font-weight-bold">User, Asset, Assigned date</span>&nbsp;is&nbsp;
              <span className="font-weight-bold">required</span>
            </small>
          </div>
        </Form>
        <Notification
          show={showNotification}
          backToView={() => {
            setShowNotification(true);
            dispatch(setSubTitle(''));
            dispatch(setIsAdd(false));
          }}
          setStateModal={() => setShowNotification(false)}
        />
      </div>
    </div>
  );
}
FormInput.propTypes = {
  backtoManageAssignment: PropTypes.func,
};
