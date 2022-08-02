import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editSchema } from '../../../adapter/UserAdapter';
import { editUserById } from '../../../api/User';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setIsEdit } from '../../../redux/reducer/user/user.reducer';
import { userDetailSelector } from '../../../redux/selectors';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Modal from '../../Layouts/Modal';
import { BlockUI } from '../../Layouts/Notiflix';
import EditNote from '../Note';

import './style.css';

const typeOptions = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Staff' },
];

function UserEdit(props) {
  const dispatch = useDispatch();
  const userDetail = useSelector(userDetailSelector);

  const [confirmCancel, setConfirmCancel] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, isDirty, dirtyFields, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(editSchema),
    defaultValues: {
      date_of_birth: formatDate(userDetail.date_of_birth, 'yyyy-MM-DD'),
      joined_date: formatDate(userDetail.joined_date, 'yyyy-MM-DD'),
      gender: userDetail.gender,
      type: userDetail.type,
    },
  });

  const date_of_birth = useWatch({
    control,
    name: 'date_of_birth',
  });

  const onSubmit = async (data) => {
    BlockUI('#root', 'fixed');
    const tempDirtyFields = { ...dirtyFields };
    Object.keys(tempDirtyFields).map((key) => {
      tempDirtyFields[key] = data[key];
    });
    if (tempDirtyFields.date_of_birth && !tempDirtyFields.joined_date) {
      tempDirtyFields.date_of_birth = formatDate(tempDirtyFields.date_of_birth, 'YYYY-MM-DD');
      tempDirtyFields.joined_date = formatDate(data.joined_date, 'YYYY-MM-DD');
    }
    if (tempDirtyFields.joined_date && !tempDirtyFields.date_of_birth) {
      tempDirtyFields.date_of_birth = formatDate(data.date_of_birth, 'YYYY-MM-DD');
      tempDirtyFields.joined_date = formatDate(tempDirtyFields.joined_date, 'YYYY-MM-DD');
    }
    if (tempDirtyFields.date_of_birth && tempDirtyFields.joined_date) {
      tempDirtyFields.date_of_birth = formatDate(tempDirtyFields.date_of_birth, 'YYYY-MM-DD');
      tempDirtyFields.joined_date = formatDate(tempDirtyFields.joined_date, 'YYYY-MM-DD');
    }

    const result = await editUserById(userDetail.id, tempDirtyFields);
    if (result === 200) {
      SuccessToast('Updated user successfully', 3000);
      props.backToManageUser('updated_at', 'edit');
    } else {
      ErrorToast('Updated user unsuccessfully', 3000);
      Notiflix.Block.remove('#root');
    }
  };

  const backtoManagerUser = () => {
    dispatch(setIsEdit(false));
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
                <Form.Control defaultValue={userDetail.first_name} id="user_first_name" type="text" disabled />
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Last Name</p>
              </td>
              <td width="70%">
                <Form.Control defaultValue={userDetail.last_name} id="user_last_name" type="text" disabled />
              </td>
            </tr>
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Date of birth</p>
              </td>
              <td width="70%">
                <Form.Control id="user_date_of_birth" type="date" {...register('date_of_birth')} />
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
                <Form.Control id="user_joined_date" type="date" {...register('joined_date')} />
                <small className="text-red font-weight-semi">
                  {date_of_birth !== '' && errors?.joined_date?.type === 'min' && errors?.joined_date?.message}
                  {date_of_birth !== '' &&
                    errors?.joined_date?.type === 'joined_date_2' &&
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
                      onChange={(options) => onChange(options?.value)}
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
            <tr>
              <td width="30%">
                <p className="font-weight-bold">Location</p>
              </td>
              <td width="70%">
                <Form.Control defaultValue={userDetail.user_location.name} id="user_location" type="text" disabled />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-end p-2">
          <Button
            id="user-save-btn"
            variant="danger"
            type="submit"
            className="font-weight-bold me-3"
            disabled={!isDirty || !isValid}
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
        backdrop="true"
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

UserEdit.propTypes = {
  backToManageUser: PropTypes.func,
};

export default UserEdit;
