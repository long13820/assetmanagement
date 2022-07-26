import axiosClient from '../axiosClient';
const token = localStorage.getItem('token');
const categoryAPI = {
  async getlistCategory(params) {
    const response = await axiosClient
      .get('/categories', {
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

    return response;
  },
};
export default categoryAPI;
