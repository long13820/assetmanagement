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

import { handleCreate } from '../../../api/Assignment';
import { setAssetName, setIsAdd, setUserName } from '../../../redux/reducer/assignment/assignment.reducer';
import GetAssetTable from '../../Assignment/GetAssetTable/';
import GetUserTable from '../../Assignment/GetUserTable/';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

const schema = yup
  .object({
    asset_name: yup.string().required(),
    user_name: yup.string().required(),
    assigned_date: yup.date().required().min(new Date()),
  })
  .required();
export default function FormInput(props) {
  const [currentAssetName, setCurrentAssetName] = React.useState({});
  const [currentUserName, setCurrentUserName] = React.useState({});
  const [flagSave, setFlagSave] = React.useState(0);
  const [flagSaveUser, setFlagSaveUser] = React.useState(0);
  const [showUser, setShowUser] = useState(false);
  const [showAsset, setShowAsset] = useState(false);

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
    if (flagSave === 0) {
      dispatch(setAssetName(''));
      setCurrentAssetName({});
      setValue('asset_name', '');
    }
    setShowAsset(true);
  };

  const handleShowUser = () => {
    if (flagSaveUser === 0) {
      dispatch(setUserName(''));
      setCurrentUserName({});
      setValue('user_name', '');
    }
    setShowUser(true);
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
    resolver: yupResolver(schema),
    defaultValues: {
      assigned_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
    },
  });

  const handleCurrentSetAssetName = (name, id) => {
    if (Object.keys(currentAssetName).length === 0) {
      dispatch(setAssetName(name));
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
        setValue('asset_name', '');
        return;
      }
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

  const handleCurrentSetUserName = (name, id) => {
    if (Object.keys(currentUserName).length === 0) {
      dispatch(setUserName(name));
      const obj = {
        name,
        id,
      };
      setCurrentUserName({ ...obj });
      setValue('user_name', name);
      return;
    }
    if (Object.keys(currentUserName).length > 0) {
      if (currentUserName.name === name) {
        dispatch(setUserName(''));
        setCurrentUserName({});
        setValue('user_name', '');
        return;
      }
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
      SuccessToast('Create user successfully', 3000);
      props.backtoManageAssignment('created_at');
    } else {
      ErrorToast('Create user unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Modal
        size="lg"
        backdrop="static"
        className="d-flex"
        show={showUser}
        onHide={() => handleStateModalUser('close')}
        centered
        contentClassName="select-user-modal"
      >
        <Modal.Body>
          <GetUserTable handleCurrentSetUserName={handleCurrentSetUserName} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleStateModalUser('save')}>
            &nbsp;Save&nbsp;
          </Button>
          <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
          <Button variant="outline-secondary" onClick={() => handleStateModalUser('close')}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        backdrop="static"
        className="d-flex justify-content-end"
        show={showAsset}
        onHide={() => handleStateModalAsset('close')}
        centered
        size="lg"
        contentClassName="select-asset-modal"
      >
        <Modal.Body>
          <GetAssetTable handleCurrentSetAssetName={handleCurrentSetAssetName} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleStateModalAsset('save')}>
            &nbsp;Save&nbsp;
          </Button>
          <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
          <Button variant="outline-secondary" onClick={() => handleStateModalAsset('close')}>
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
                <InputGroup>
                  <Form.Control type="text" {...register('user_name')} disabled />
                  <Button variant="danger" onClick={handleShowUser}>
                    <BsSearch />
                  </Button>
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
                <InputGroup>
                  <Form.Control type="text" {...register('asset_name')} disabled />
                  <Button variant="danger" onClick={handleShowAsset}>
                    <BsSearch />
                  </Button>
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
                    <Form.Control as="textarea" selected={field.value} onChange={(date) => field.onChange(date)} />
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
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
            <Button
              className="font-weight-bold"
              onClick={() => dispatch(setIsAdd(false))}
              variant="outline-secondary"
              type="cancel"
            >
              Cancel
            </Button>
          </div>
          <div className="text-justify mb-3">
            <small>(*) Click Search button to select User and Asset name</small>
          </div>
          <div>
            <small>(*) Assigned date must be current or future date</small>
          </div>
        </Form>
      </div>
    </div>
  );
}
FormInput.propTypes = {
  backtoManageAssignment: PropTypes.func,
};
