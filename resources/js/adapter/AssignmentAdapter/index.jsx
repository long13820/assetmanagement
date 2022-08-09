import * as yup from 'yup';

export const editAssignmentSchema = yup
  .object({
    asset_name: yup.string().required(),
    user_name: yup.string().required(),
    note: yup.string(),
  })
  .required();
