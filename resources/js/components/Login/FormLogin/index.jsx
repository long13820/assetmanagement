import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { yupResolver } from '@hookform/resolvers/yup';

import { handleLogin, schemaLogin } from '../../../adapter/AppAdapter';

export default function FormLogin() {
  const [typePassword, setShowPassword] = React.useState('password');

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit = async (data) => {
    handleLogin(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3 form-user">
        <Form.Label className="font-weight-bold">
          Username&nbsp;<span className="text-danger">*</span>
        </Form.Label>
        <Form.Control {...register('username')} type="text" />
      </Form.Group>

      <Form.Group className="mb-4 form-password">
        <Form.Label className="font-weight-bold">
          Password&nbsp;<span className="text-danger">*</span>
        </Form.Label>
        <div className="fp-input">
          <Form.Control {...register('password')} type={typePassword} />
          {typePassword === 'text' ? (
            <FaEye onClick={() => setShowPassword('password')} />
          ) : (
            <FaEyeSlash onClick={() => setShowPassword('text')} />
          )}
        </div>
      </Form.Group>
      <div className="d-grid gap-2">
        <Button variant="danger" disabled={!isValid} className="font-weight-bold" type="submit">
          Login
        </Button>
      </div>
    </Form>
  );
}
