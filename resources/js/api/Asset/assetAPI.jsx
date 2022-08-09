import axiosClient from '../axiosClient';
const token = localStorage.getItem('token');

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
    const response = await axiosClient
      .get('/assets', {
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
  },
  async getDetailAsset(params) {
    const response = await axiosClient
      .get(`/assets/${params}`, {
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
  },
};
export default assetAPI;

export const editAssetById = async (id, body) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response.status === 'success') return 200;
  if (response.status !== 'success') return 404;
};

export const getAllCategories = async () => {
  const url = '/categories';
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') return response.data.data;
  if (response.status !== 'success') return [];
};

export const getAssetById = async (id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  return response.status === 'success' ? response.data[0] : {};
};

export const createAsset = async (body) => {
  const url = '/assets';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  return response.success === true ? 200 : 400;
};

export const editAsset = async (body, id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  return response.status === 'success' ? 200 : 400;
};

export const createNewCategory = async (body) => {
  const url = '/categories';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  return response.status === 409 ? response.data : response.data;
};

export const deleteAssetById = async (id) => {
  const url = `/assets/${id}`;
  const response = await axiosClient.delete(url, configHeadersAuthenticate());
  return response.success === true ? 200 : 400;
};

export const checkAssetById = async (id) => {
  const url = `/check_asset/${id}`;
  const response = await axiosClient.put(url, {}, configHeadersAuthenticate());
  return response.success === true ? 200 : 400;
};
