import * as yup from 'yup';

export const addSchema = yup.object({
  asset_name: yup
    .string()
    .required()
    .matches(/^[a-zA-Z\s]+$/, 'Invalid first name format')
    .trim(),
  specification: yup.string().required(),
  installed_date: yup.date().required(),
  state: yup.string(),
  category_id: yup.number().required(),
});
