import axiosClient from "./axiosClient.js";

const productApi = {
  getAllClient: async () => {
    const res = await axiosClient.get('/client/products');
    return res;
  },
  getByIdClient: async (id) => {
    return axiosClient.get(`/client/products/${id}`);
  },
  searchClient: async (keyword) => {
    return axiosClient.get(`/client/products/search?keyword=${encodeURIComponent(keyword)}`);
  },
  
  // For admin CRUD with FormData (file upload support)
  create: (formData) => {
    return axiosClient.post('/admin/products', formData);
  },
  update: (id, formData) => {
    return axiosClient.put(`/admin/products/${id}`, formData);
  },
  delete: (id) => {
    return axiosClient.delete(`/admin/products/${id}`);
  },

  // Legacy methods (kept for backward compatibility)
  createAdmin: (productData, file) => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    if (file) formData.append('image', file);
    return axiosClient.post('/admin/products', formData);
  },
  updateAdmin: (id, productData, file) => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    if (file) formData.append('image', file);
    return axiosClient.put(`/admin/products/${id}`, formData);
  },
  deleteAdmin: (id) => {
    return axiosClient.delete(`/admin/products/${id}`);
  }
};

export default productApi;