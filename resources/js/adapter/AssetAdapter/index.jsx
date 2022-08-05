import * as yup from 'yup';

export const addSchema = yup
  .object({
    asset_name: yup
      .string()
      .required()
      .matches(/^[0-9a-zA-Z\s]+$/, 'Invalid asset name format')
      .max(50)
      .trim(),
    specification: yup.string().required(),
    installed_date: yup.date().required(),
    state: yup.string(),
    category_id: yup.number().required(),
  })
  .required();

export const editSchema = yup
  .object({
    asset_name: yup
      .string()
      .required()
      .matches(/^[0-9a-zA-Z\s]+$/, 'Invalid asset name format')
      .max(50)
      .trim(),
    specification: yup.string().required(),
    installed_date: yup.date().required(),
    state: yup.string(),
  })
  .required();
