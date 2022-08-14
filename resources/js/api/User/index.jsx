import { concatQueryString } from '../../utils/concatQueryString';
import { titleToSlug } from '../../utils/titleToSlug';
import axiosClient from '../axiosClient';

export const configHeadersAuthenticate = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllUsers = async ({ sort, filter, search, page, edit } = {}) => {
  const url = '/users';
  const queryString = [];

  if (sort && sort.length > 0) {
    sort.forEach((item) => {
      queryString.push(`sort[${titleToSlug(item.key)}]=${item.value}`);
    });
  }

  if (filter) {
    queryString.push(`filter[type]=${filter}`);
  }

  if (search) {
    queryString.push(`search=${search}`);
  }

  if (page) {
    queryString.push(`page=${page}`);
  }

  if (edit) {
    queryString.push(`sort[updated_at]=desc`);
  }

  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());

  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return response.data;
  } else {
    return 500;
  }
};

export const getUserById = async (id) => {
  const url = `/users/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return {};
  }
};

export const editUserById = async (id, body) => {
  const url = `/users/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return 200;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};

export const addUser = async (body) => {
  const url = '/users';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return 200;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};

export const checkDisabledUser = async (id) => {
  const url = `/check_assignment/${id}`;
  const response = await axiosClient.put(url, {}, configHeadersAuthenticate());
  if (response.message && response.message === 'User can be disabled') {
    return 200;
  } else if (response.message && response.message === 'There are valid assignments belonging to this user.') {
    return 405;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const disableUser = async (id) => {
  const url = `/users/${id}`;
  const response = await axiosClient.delete(url, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === true && response.message === 'User disabled') {
    return 200;
  } else {
    return 500;
  }
};
