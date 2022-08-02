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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*~`()_+\-=\\[\]{};':"\\|,.<>\\/?])(?=.{8,})/)
      .test({
        name: 'new_password',
        message: 'New password must be different from old password',
        test(value) {
          return this.parent.old_password !== value;
        },
      }),
  })
  .required();

export const schemaFirstChangePassword = yup
  .object({
    new_password: yup
      .string()
      .required()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*~`()_+\-=\\[\]{};':"\\|,.<>\\/?])(?=.{8,})/),
  })
  .required();

export const checkLogin = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

export const handleGetMe = async () => {
  if (checkLogin) {
    const response = await handleGetInformation();
    return response === 401 ? 401 : response;
  }
};

export const handleLogin = (data) => {
  BlockUI('.sl-box');
  handleSignIn(data);
};

export const changePassword = (data, flag) => {
  BlockUI('.modal-content');
  return handleChangePassword(data, flag);
};

export const logout = () => {
  BlockUI('.modal-content');
  return handleLogout();
};
