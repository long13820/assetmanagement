import Cookies from 'js-cookie';

import { concatQueryString } from '../../utils/concatQueryString';
import { titleToSlug } from '../../utils/titleToSlug';
import axiosClient from '../axiosClient';

export const configHeadersAuthenticate = () => {
  const token = Cookies.get('SESSION-TOKEN');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllAssignments = async ({ sort, filter, search, page } = {}) => {
  const url = '/assignments';
  const queryString = [];

  if (sort && sort.length > 0) {
    sort.forEach((item) => {
      queryString.push(`sort[${titleToSlug(item.key)}]=${item.value}`);
    });
  }

  if (filter) {
    queryString.push(`filter[state]=${filter}`);
  }

  if (search) {
    queryString.push(`search=${search}`);
  }

  if (page) {
    queryString.push(`page=${page}`);
  }

  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());

  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return [];
};

export const getAssignmentById = async (id) => {
  const url = `/api/assignments/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return {};
};
