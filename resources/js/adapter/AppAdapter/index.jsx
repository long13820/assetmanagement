import Cookies from 'js-cookie';
import * as yup from 'yup';

import { handleChangePassword, handleGetInformation, handleLogout, handleSignIn } from '../../api/Auth';
import { BlockUI } from '../../components/Layouts/Notiflix';

export const schemaLogin = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export const schemaChangePassword = yup
  .object({
    old_password: yup.string().required(),
    new_password: yup
      .string()
      .required()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/),
  })
  .required();

export const schemaFirstChangePassword = yup
  .object({
    new_password: yup
      .string()
      .required()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/),
  })
  .required();

export const checkLogin = () => {
  const token = Cookies.get('SESSION-TOKEN');
  return token ? true : false;
};

export const handleGetMe = async () => {
  if (checkLogin) {
    const response = await handleGetInformation();
    if (response === 401) {
      Cookies.remove('SESSION-TOKEN');
      window.location.href = '/login';
    } else {
      return response;
    }
  }
};

export const handleLogin = (data) => {
  BlockUI('.sl-box');
  handleSignIn(data);
};

export const changePassword = (data) => {
  BlockUI('.modal-content');
  return handleChangePassword(data);
};

export const logout = () => {
  BlockUI('.modal-content');
  return handleLogout();
};
