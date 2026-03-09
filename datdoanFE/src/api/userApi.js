import axiosClient from './axiosClient.js';

const userApi = {
  getProfile: () => axiosClient.get('/user/me'),
  updateProfile: (data) => axiosClient.put('/user', data),
};

export default userApi;
