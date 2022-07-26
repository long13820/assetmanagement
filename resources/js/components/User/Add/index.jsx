import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { addSchema, locationOptions, typeOptions } from '../../../adapter/UserAdapter';
import { addUser } from '../../../api/User';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setIsAdd } from '../../../redux/reducer/user/user.reducer';
import { userSelector } from '../../../redux/selectors';
import { formatDate } from '../../../utils/formatDate';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import { BlockUI } from '../../Layouts/Notiflix';
import EditNote from '../Note';

import './style.css';

function UserAdd(props) {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
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

  const type = useWatch({
    control,
    name: 'type',
  });

  const onSubmit = async (data) => {
    BlockUI('#root', 'fixed');
    if (data.date_of_birth) data.date_of_birth = formatDate(data.date_of_birth, 'YYYY-MM-DD');
    if (data.joined_date) data.joined_date = formatDate(data.joined_date, 'YYYY-MM-DD');
    const result = await addUser(data);
    if (result === 200) {
      SuccessToast('Create user successfully', 3000);
      props.backToManageUser('created_at');
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
              <td>
                <p className="font-weight-bold">First Name</p>
              </td>
              <td>
                <Form.Control id="user_first_name" type="text" {...register('first_name')} />
              </td>
            </tr>
            <tr>
              <td>
                <p className="font-weight-bold">Last Name</p>
              </td>
              <td>
                <Form.Control id="user_last_name" type="text" {...register('last_name')} />
              </td>
            </tr>
            <tr>
              <td>
                <p className="font-weight-bold">Date of birth</p>
              </td>
              <td>
                <Form.Control id="user_last_name" type="date" {...register('date_of_birth')} />
              </td>
            </tr>
            <tr>
              <td>
                <p className="font-weight-bold">Gender</p>
              </td>
              <td>
                <Form.Check inline type="radio" label="Female" value="female" {...register('gender')} />
                <Form.Check inline type="radio" label="Male" value="male" {...register('gender')} />
              </td>
            </tr>
            <tr>
              <td>
                <p className="font-weight-bold">Joined Date</p>
              </td>
              <td>
                <Form.Control type="date" {...register('joined_date')} />
              </td>
            </tr>
            <tr>
              <td>
                <p className="font-weight-bold">Type</p>
              </td>
              <td>
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
            {type === 'Admin' && (
              <tr>
                <td>
                  <p className="font-weight-bold">Location</p>
                </td>
                <td>
                  <Controller
                    control={control}
                    name="location_id"
                    {...register('location_id')}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        options={locationOptions}
                        onChange={(options) => onChange(options?.value)}
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
                </td>
              </tr>
            )}
            <tr>
              <td />
              <td className="d-flex justify-content-end">
                <Button variant="danger" type="submit" className="font-weight-bold me-3" disabled={!isValid}>
                  Save
                </Button>
                <Button onClick={backtoManagerUser} variant="secondary" className="font-weight-bold">
                  Cancel
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <EditNote />
      </Form>
    </div>
  );
}

UserAdd.propTypes = {
  backToManageUser: PropTypes.func,
};

export default UserAdd;
