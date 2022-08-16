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

export const handleCreate = async (body) => {
  const response = await axiosClient.post('/assignments', body, configHeadersAuthenticate());
  if (response.data.message === 'Unauthenticated.') {
    return 401;
  }
  if (response.data.status === 201) {
    return 201;
  }
  if (response.data.status === 422) {
    return 422;
  }
};

export const getAllAssets = async ({ sort, filter, search, page } = {}) => {
  const url = '/assets';
  const queryString = ['filter[state]=Available'];

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

  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return response.data;
  } else {
    return 500;
  }
};

export const getAllAssignmentsAsset = async (params) => {
  const token = localStorage.getItem('token');
  const response = await axiosClient
    .get('/assignments', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((respo) => {
      return respo;
    })
    .catch((error) => {
      return error.message;
    });
  if (response.status === 401) {
    return 401;
  }
  if (response.status === 'success') {
    return response;
  }

  if (response.status !== 'success') return [];
};

export const getAllAssignments = async ({ sort, filter, search, page, edit, filterDate } = {}) => {
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

  if (filterDate) {
    queryString.push(`filter[assigned_date]=${formatDate(filterDate, 'YYYYMMDD')}`);
  }

  if (search) {
    queryString.push(`search=${search}`);
  }

  if (page) {
    queryString.push(`page=${page}`);
  }

  if (edit) {
    queryString.push(`sort[${edit}]=desc`);
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

export const getAssignmentById = async (id) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const editAssignmentById = async (id, body) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};

export const getAllAssignmentsById = async ({ sort, page } = {}) => {
  const url = `/assignmentsById`;
  const queryString = [];

  if (sort && sort.length > 0) {
    sort.forEach((item) => {
      queryString.push(`sort[${titleToSlug(item.key)}]=${item.value}`);
    });
  }

  if (page) {
    queryString.push(`page=${page}`);
  }

  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());

  if (response.status === 'success') {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const deleteAssignment = async (id) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.delete(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 404;
  }
};

export const getReturnRequestById = async (id) => {
  const url = `/showReturnRequestId/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') return response.data;
  if (response.status !== 'success') return {};
};

export const acceptAssignment = async (id) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.put(
    url,
    {
      state: 'Accepted',
    },
    configHeadersAuthenticate()
  );
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const declineAssignment = async (id) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.put(
    url,
    {
      state: 'Declined',
    },
    configHeadersAuthenticate()
  );
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const completeRequestById = async (id, body) => {
  const url = `/assignments/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};
