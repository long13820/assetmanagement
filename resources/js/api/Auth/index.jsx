import Notiflix from 'notiflix';

import { ErrorToast, SuccessToast } from '../../components/Layouts/Alerts';
import axiosClient from '../axiosClient';

export const configHeadersAuthenticate = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const handleSignIn = async (body) => {
  const response = await axiosClient.post('/login', body);

  const { status } = response;

  if ([400, 403, 422].includes(status)) {
    ErrorToast('Username or password is incorrect. Please try again', 3500);
    Notiflix.Block.remove('.sl-box');
    return;
  }

  if (response.data.status === 200) {
    SuccessToast('Logged in successfully', 1000);
    localStorage.setItem('token', response.data.token);
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    return;
  }

  ErrorToast(3500, 'Server error. Please try again');
  Notiflix.Block.remove('.sl-box');
};

export const handleGetInformation = async () => {
  const response = await axiosClient.get('/me', configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  }

  if (response.status === 'success') {
    return response.data;
  }
};

export const handleChangePassword = async (body, flag) => {
  const response = await axiosClient.put('/change_password', body, configHeadersAuthenticate());

  const { status } = response;

  switch (status) {
    case 403:
      Notiflix.Block.remove('.modal-content');
      return status;
    case 422:
      ErrorToast('Please check again your new password', 3500);
      Notiflix.Block.remove('.modal-content');
      return status;
    case 'success':
      if (flag !== 'no_notification') {
        SuccessToast('Your password has been changed successfully', 3500);
      }
      Notiflix.Block.remove('.modal-content');
      return 200;
    default:
      ErrorToast(3500, 'Server error. Please try again');
      Notiflix.Block.remove('.modal-content');
      return 500;
  }
};

export const handleLogout = async () => {
  const response = await axiosClient.post('/logout', {}, configHeadersAuthenticate());

  const { status } = response;

  switch (status) {
    case 'success':
      SuccessToast('Logout successfully', 1000);
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      break;
    default:
      ErrorToast(3500, 'Server error. Please try again');
      Notiflix.Block.remove('.modal-content');
      return 500;
  }
};
