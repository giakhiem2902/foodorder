import axiosClient from "./axiosClient.js";

const categoryApi = {
  getAllClient: () => {
    return axiosClient.get('/client/categories');
  },
  getByIdClient: (id) => {
    return axiosClient.get(`/client/categories/${id}`);
  },
  
  // For admin CRUD with FormData (file upload support)
  create: (formData) => {
    return axiosClient.post('/admin/categories', formData);
  },
  update: (id, formData) => {
    return axiosClient.put(`/admin/categories/${id}`, formData);
  },
  delete: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },

  // Legacy methods (kept for backward compatibility)
  createAdmin: (categoryData, file) => {
    const formData = new FormData();
    formData.append('category', JSON.stringify(categoryData));
    formData.append('image', file);

    // Let axios/browser set Content-Type (boundary)
    return axiosClient.post('/admin/categories', formData);
  },
  updateAdmin: (id, categoryData, file) => {
    const formData = new FormData();
    formData.append('category', JSON.stringify(categoryData));
    if (file) formData.append('image', file);
    return axiosClient.put(`/admin/categories/${id}`, formData);
  },
  deleteAdmin: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  }
};

export default categoryApi;