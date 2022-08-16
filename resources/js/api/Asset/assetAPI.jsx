import axiosClient from '../axiosClient';
// const token = localStorage.getItem('token');

export const configHeadersAuthenticate = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const assetAPI = {
  async getlistAsset(params) {
    const getToken = localStorage.getItem('token');
    const response = await axiosClient
      .get('/assets', {
        params,
        headers: {
          Authorization: `Bearer ${getToken}`,
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
  },
  async getDetailAsset(params) {
    const response = await axiosClient
      .get(`/assets/${params}`, configHeadersAuthenticate())
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
  },
};
export default assetAPI;

export const editAssetById = async (id, body) => {
  const url = `/assets/${id}`;
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

export const getAllCategories = async () => {
  const url = '/categories';
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return response.data.data;
  } else if (response.status === 401) {
    return 401;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};

export const getAssetById = async (id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return response.data[0];
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const createAsset = async (body) => {
  const url = '/assets';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.success === true) {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 400;
  }
};

export const editAsset = async (body, id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 400;
  }
};

export const createNewCategory = async (body) => {
  const url = '/categories';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 409) {
    return response.data;
  } else if (response.success === true) {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 500;
  }
};

export const deleteAssetById = async (id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.delete(url, configHeadersAuthenticate());
  if (response.success === true) {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 400;
  }
};

export const checkAssetById = async (id) => {
  const url = `/check_asset/${id}`;
  const response = await axiosClient.put(url, {}, configHeadersAuthenticate());
  if (response.success === true) {
    return 200;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 400;
  }
};
