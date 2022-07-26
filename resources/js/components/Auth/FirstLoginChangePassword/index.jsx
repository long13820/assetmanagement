import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { changePassword, handleGetMe, schemaFirstChangePassword } from '../../../adapter/AppAdapter';
import { setUser } from '../../../redux/reducer/app/app.reducer';
import { userSelector } from '../../../redux/selectors';
import { formatDate } from '../../../utils/formatDate';
import Modal from '../../Layouts/Modal';

import './style.css';

export default function ChangePassword(props) {
  const [typeNewPassword, setShowNewPassword] = React.useState('password');

  const dispatch = useDispatch();

  const user = useSelector(userSelector);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaFirstChangePassword),
  });

  const onSubmit = async (data) => {
    let date_of_birth = formatDate(user.date_of_birth, 'DD/MM/YYYY').split('/');
    date_of_birth = date_of_birth.join('');
    data.old_password = `${user.username}@${date_of_birth}`;
    const status = await changePassword(data);
    switch (status) {
      case 403:
        break;
      case 422:
        setError(
          'new_password',
          {
            types: {
              invalid: 'Password is invalid',
            },
          },
          { shouldFocus: true }
        );
        break;
      case 200:
        handleGetMe().then((result) => {
          dispatch(setUser(result));
        });
        props.closeModal();
    }
  };

  return (
    <Modal
      show={props.show}
      backdrop="static"
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Change password</p>}
      elementModalBody={
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <h6>This is the first time you logged in.</h6>
            <h6>You have to change your password to continue.</h6>
          </div>
          <Form.Group className="custom-change-password mb-3">
            <Row className="align-items-center">
              <Col xs={4}>
                <Form.Label className="font-weight-bold mb-0">New password</Form.Label>
              </Col>
              <Col xs={8}>
                <div className="cp-input">
                  <Form.Control {...register('new_password')} type={typeNewPassword} />
                  <small className="text-danger font-weight-bold">{errors?.new_password?.types?.invalid}</small>
                  {typeNewPassword === 'text' ? (
                    <FaEye className="text-black" onClick={() => setShowNewPassword('password')} />
                  ) : (
                    <FaEyeSlash className="text-black" onClick={() => setShowNewPassword('text')} />
                  )}
                </div>
              </Col>
            </Row>
          </Form.Group>
          <div className="text-justify mb-3">
            <small>
              (*) New password must contain&nbsp;<span className="font-weight-bold">8 Characters</span>,&nbsp;
              <span className="font-weight-bold">One Uppercase</span>,&nbsp;
              <span className="font-weight-bold">One Lowercase</span>,&nbsp;
              <span className="font-weight-bold">One Number</span>&nbsp;and&nbsp;
              <span className="font-weight-bold">One Special Case Character</span>
            </small>
          </div>
          <Form.Group className="d-flex justify-content-end">
            <Button type="submit" variant="danger" disabled={!isValid} className="font-weight-bold">
              Save
            </Button>
          </Form.Group>
        </Form>
      }
    />
  );
}

ChangePassword.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
