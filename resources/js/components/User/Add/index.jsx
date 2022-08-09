import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import { differenceInYears } from 'date-fns';
import moment from 'moment';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { addSchema, locationOptions, typeOptions } from '../../../adapter/UserAdapter';
import { addUser } from '../../../api/User';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setIsAdd } from '../../../redux/reducer/user/user.reducer';
import { userSelector } from '../../../redux/selectors';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import EditNote from '../Note';

import './style.css';

function UserAdd(props) {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [warningLocation, setWarningLocation] = React.useState('');

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      joined_date: '',
      gender: '',
      type: 'Staff',
      location_id: user.location_id,
    },
  });

  const first_name = useWatch({
    control,
    name: 'first_name',
  });

  const last_name = useWatch({
    control,
    name: 'last_name',
  });

  const type = useWatch({
    control,
    name: 'type',
  });

  const date_of_birth = useWatch({
    control,
    name: 'date_of_birth',
  });

  const joined_date = useWatch({
    control,
    name: 'joined_date',
  });

  const checkValidEighteen = () => {
    return date_of_birth !== '' && joined_date !== ''
      ? differenceInYears(new Date(joined_date), new Date(date_of_birth)) >= 18
      : true;
  };

  const onSubmit = async (data) => {
    BlockUI('#root', 'fixed');
    if (data.date_of_birth) data.date_of_birth = formatDate(data.date_of_birth, 'YYYY-MM-DD');
    if (data.joined_date) data.joined_date = formatDate(data.joined_date, 'YYYY-MM-DD');
    const result = await addUser(data);
    if (result === 200) {
      SuccessToast('Create user successfully', 3000);
      props.backToManageUser('created_at', 'create');
    } else {
      ErrorToast('Create user unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };

  const backtoManagerUser = () => {
    dispatch(setIsAdd(false));
    dispatch(setSubTitle(''));
  };

  return (
    <div className="edit_form d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <table align="center" border="0" className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">First Name</p>
              </td>
              <td width="70%">
                <Form.Control
                  id="user_first_name"
                  type="text"
                  {...register('first_name')}
                  maxLength="128"
                  className={`${first_name.length > 0 && errors?.first_name?.type === 'matches' ? 'border-red' : ''}`}
                />
                <div className="d-flex justify-content-between">
                  <small className="text-red font-weight-semi">
                    {first_name.length > 0 && errors?.first_name?.type === 'matches' && errors?.first_name?.message}
                  </small>
                  <small className="font-weight-bold">{first_name.length}/128</small>
                </div>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Last Name</p>
              </td>
              <td width="70%">
                <Form.Control
                  id="user_last_name"
                  type="text"
                  {...register('last_name')}
                  maxLength="128"
                  className={`${last_name.length > 0 && errors?.last_name?.type === 'matches' ? 'border-red' : ''}`}
                />
                <div className="d-flex justify-content-between">
                  <small className="text-red font-weight-semi">
                    {last_name.length > 0 && errors?.last_name?.type === 'matches' && errors?.last_name?.message}
                  </small>
                  <small className="font-weight-bold">{last_name.length}/128</small>
                </div>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Date of birth</p>
              </td>
              <td width="70%">
                <Form.Control
                  id="user_date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                  className={`${
                    moment(date_of_birth, 'YYYY-MM-DD').isValid() &&
                    ['max', 'date_of_birth', 'typeError'].includes(errors?.date_of_birth?.type)
                      ? 'border-red'
                      : ''
                  }`}
                />
                <small className="text-red font-weight-semi">
                  {errors?.date_of_birth?.type === 'typeError' && errors?.date_of_birth?.message}
                  {errors?.date_of_birth?.type === 'max' && errors?.date_of_birth?.message}
                  {errors?.date_of_birth?.type === 'date_of_birth' && errors?.date_of_birth?.message}
                </small>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Gender</p>
              </td>
              <td width="70%">
                <Form.Check
                  id="user_gender_female"
                  inline
                  type="radio"
                  label="Female"
                  value="female"
                  {...register('gender')}
                />
                <Form.Check
                  id="user_gender_male"
                  inline
                  type="radio"
                  label="Male"
                  value="male"
                  {...register('gender')}
                />
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Joined Date</p>
              </td>
              <td width="70%">
                <Form.Control
                  id="user_joined_date"
                  type="date"
                  {...register('joined_date')}
                  className={`${
                    (moment(joined_date, 'YYYY-MM-DD').isValid() &&
                      ['typeError', 'min', 'joined_date'].includes(errors?.joined_date?.type)) ||
                    checkValidEighteen() === false
                      ? 'border-red'
                      : ''
                  }`}
                />
                <small className="text-red font-weight-semi">
                  {date_of_birth !== '' && errors?.joined_date?.type === 'min' && errors?.joined_date?.message}
                  {date_of_birth !== '' &&
                    errors?.joined_date?.type === 'joined_date_2' &&
                    checkValidEighteen() === false &&
                    errors?.joined_date?.message}
                  {errors?.joined_date?.type === 'typeError' && errors?.joined_date?.message}
                  {errors?.joined_date?.type === 'joined_date' && errors?.joined_date?.message}
                </small>
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Type</p>
              </td>
              <td width="70%">
                <Controller
                  control={control}
                  name="type"
                  {...register('type')}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      options={typeOptions}
                      onChange={(options) => {
                        onChange(options?.value);
                        if (options?.value === 'Admin') {
                          setValue('location_id', user.location_id);
                          setWarningLocation('');
                        }
                      }}
                      value={typeOptions?.filter((option) => value === option?.value)}
                      placeholder=""
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#f9d2e4',
                          primary50: '#f9d2e4',
                          primary: '#d6001c',
                        },
                      })}
                    />
                  )}
                />
              </td>
            </tr>
            {type === 'Admin' && (
              <tr>
                <td width="30%">
                  <p className="font-weight-bold">Location</p>
                </td>
                <td width="70%">
                  <Controller
                    control={control}
                    name="location_id"
                    {...register('location_id')}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        options={locationOptions}
                        onChange={(options) => {
                          onChange(options?.value);
                          if (options?.value !== user.location_id) {
                            setWarningLocation(
                              'The created user will not show in the user list until you use the admin account in the selected location'
                            );
                          } else {
                            setWarningLocation('');
                          }
                        }}
                        value={locationOptions?.filter((option) => value === option?.value)}
                        placeholder=""
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: '#f9d2e4',
                            primary50: '#f9d2e4',
                            primary: '#d6001c',
                          },
                        })}
                      />
                    )}
                  />
                  {warningLocation !== '' && <small className="text-danger font-weight-semi">{warningLocation}</small>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-end p-2">
          <Button
            id="user-save-btn"
            variant="danger"
            type="submit"
            className="font-weight-bold me-3"
            disabled={!isValid}
          >
            Save
          </Button>
          <Button
            id="user-save-cancel"
            onClick={() => setConfirmCancel(true)}
            variant="outline-secondary"
            className="font-weight-bold"
          >
            Cancel
          </Button>
        </div>
        <EditNote />
      </Form>
      <Modal
        show={confirmCancel}
        backdrop="static"
        setStateModal={() => setConfirmCancel(false)}
        elementModalTitle={<p>Notification</p>}
        elementModalBody={
          <div>
            <div>
              <h6>Do you want to cancel?</h6>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <Button id="yes-btn" variant="danger" className="font-weight-bold" onClick={() => backtoManagerUser()}>
                Yes
              </Button>
              <Button
                id="no-btn"
                variant="outline-secondary"
                className="ms-3 font-weight-bold"
                onClick={() => setConfirmCancel(false)}
              >
                No
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

UserAdd.propTypes = {
  backToManageUser: PropTypes.func,
};

export default UserAdd;
