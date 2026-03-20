import axiosClient from './axiosClient.js';

const userApi = {
  // admin
  getAllAdmin: () => axiosClient.get('/admin/users'),
  createAdmin: (userData) => axiosClient.post('/admin/users', userData),
  updateAdmin: (id, userData) => axiosClient.put(`/admin/users/${id}`, userData),
  deleteAdmin: (id) => axiosClient.delete(`/admin/users/${id}`),
  // profile
  getProfile: () => axiosClient.get('/user/me'),
  updateProfile: (data) => axiosClient.put('/user', data),
}

export default userApi;
