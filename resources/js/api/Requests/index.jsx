import { concatQueryString } from '../../utils/concatQueryString';
import { formatDate } from '../../utils/formatDate';
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

export const getAllRequests = async ({ sort, filter, search, page, filterDate } = {}) => {
  const url = '/requests';
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

  if (filterDate) {
    queryString.push(`filter[returned_date]=${formatDate(filterDate, 'YYYYMMDD')}`);
  }

  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());

  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return [];
};
