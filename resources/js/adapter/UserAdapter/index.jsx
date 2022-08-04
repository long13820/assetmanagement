import { differenceInYears, isWeekend } from 'date-fns';
import * as yup from 'yup';

export const locationOptions = [
  {
    value: 1,
    label: 'Ho Chi Minh',
  },
  {
    value: 2,
    label: 'Ha Noi',
  },
  {
    value: 3,
    label: 'Da Nang',
  },
];

export const typeOptions = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Staff' },
];

export const addSchema = yup
  .object({
    first_name: yup
      .string()
      .matches(/^[a-zA-Z\s]+$/, 'Invalid first name format')
      .max(128)
      .trim()
      .required(),
    last_name: yup
      .string()
      .matches(/^[a-zA-Z\s]+$/, 'Invalid last name format')
      .max(128)
      .trim()
      .required(),
    date_of_birth: yup
      .date('Must be a date type')
      .max(new Date(), 'Date of birth cannot be in the future')
      .typeError('Invalid date')
      .test(
        'date_of_birth',
        'User is under 18. Please select a different date',
        (value) => differenceInYears(new Date(), new Date(value)) >= 18
      )
      .required('Required'),
    gender: yup.string().required(),
    joined_date: yup
      .date('Must be a date type')
      .min(yup.ref('date_of_birth'), 'Joined date is not later than Date of Birth. Please select a different date')
      .typeError('Invalid date')
      .test(
        'joined_date',
        'Joined date is Saturday or Sunday. Please select a different date',
        (value) => !isWeekend(value)
      )
      .test({
        name: 'joined_date_2',
        message: 'User is under 18. Please select a different date',
        test(value) {
          return differenceInYears(new Date(value), new Date(this.parent.date_of_birth)) >= 18;
        },
      })
      .required('Required'),
    location_id: yup.number().required(),
  })
  .required();

export const editSchema = yup
  .object({
    date_of_birth: yup
      .date('Must be a date type')
      .max(new Date(), 'Date of birth cannot be in the future')
      .typeError('Invalid date')
      .test(
        'date_of_birth',
        'User is under 18. Please select a different date',
        (value) => differenceInYears(new Date(), new Date(value)) >= 18
      )
      .required('Required'),
    joined_date: yup
      .date('Must be a date type')
      .min(yup.ref('date_of_birth'), 'Joined date is not later than Date of Birth. Please select a different date')
      .typeError('Invalid date')
      .test(
        'joined_date',
        'Joined date is Saturday or Sunday. Please select a different date',
        (value) => !isWeekend(value)
      )
      .test({
        name: 'joined_date_2',
        message: 'User is under 18. Please select a different date',
        test(value) {
          return differenceInYears(new Date(value), new Date(this.parent.date_of_birth)) >= 18;
        },
      })
      .required('Required'),
  })
  .required();
