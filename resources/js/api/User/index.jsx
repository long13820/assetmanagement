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

  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return [];
};

export const getUserById = async (id) => {
  const url = `/users/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return {};
};

export const editUserById = async (id, body) => {
  const url = `/users/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 'success') return 200;
  if (response.status !== 'success') return 404;
};

export const addUser = async (body) => {
  const url = '/users';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 'success') return 200;
  if (response.status !== 'success') return 404;
};
