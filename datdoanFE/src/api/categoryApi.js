import axiosClient from "./axiosClient.js";

const categoryApi = {
  getAllClient: () => {
    return axiosClient.get('/client/categories');
  },
  createAdmin: (categoryData, file) => {
    const formData = new FormData();
    formData.append('category', JSON.stringify(categoryData));
    formData.append('image', file);

    return axiosClient.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteAdmin: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  }
};

export default categoryApi;