import axiosClient from './axiosClient.js';

const adminOrderApi = {
  getAll: () => axiosClient.get('/admin/orders'),
  updateStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status?status=${encodeURIComponent(status)}`),
  delete: (id) => axiosClient.delete(`/admin/orders/${id}`),
  getRevenue: (startISO, endISO) => axiosClient.get(`/admin/orders/revenue?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}`),
  countByStatus: (status) => axiosClient.get(`/admin/orders/count?status=${encodeURIComponent(status)}`),
  deleteOrder: (id) => axiosClient.delete(`/admin/orders/${id}`)
}

export default adminOrderApi;
